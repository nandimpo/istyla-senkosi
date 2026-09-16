import { useRef, useState } from "react";

const DRAG_THRESHOLD = 35;
const SWIPE_THRESHOLD = 45;
const SCROLL_COOLDOWN_MS = 800;
const SCROLL_DELTA_THRESHOLD = 12;
const TOUCH_SCROLL_THRESHOLD = 40;

export function useClickGesture({ onAdvance }) {
  return {
    handlers: {
      onClick: () => onAdvance(),
    },
  };
}

export function useSwipeGesture({ onAdvance, onRetreat }) {
  const [direction, setDirection] = useState(1);
  const startX = useRef(null);

  const onPointerDown = (event) => {
    startX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const release = (event) => {
    if (startX.current === null) return;
    const delta = startX.current - event.clientX;
    startX.current = null;
    if (delta > SWIPE_THRESHOLD) {
      setDirection(1);
      onAdvance();
    } else if (delta < -SWIPE_THRESHOLD) {
      setDirection(-1);
      onRetreat();
    }
  };
  const cancel = () => {
    startX.current = null;
  };

  return {
    direction,
    handlers: {
      onPointerDown,
      onPointerUp: release,
      onPointerCancel: cancel,
    },
  };
}

export function useDragGesture({ onAdvance, onRetreat }) {
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(null);

  const onPointerDown = (event) => {
    if (event.button !== 0 || event.target.closest("button, a, input, select, textarea")) return;
    startY.current = event.clientY;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (startY.current === null) return;
    const raw = startY.current - event.clientY;
    setDragOffset(Math.max(-160, Math.min(160, raw)));
  };
  const settle = (event) => {
    if (startY.current === null) return;
    const delta = startY.current - event.clientY;
    startY.current = null;
    setDragging(false);
    setDragOffset(0);
    if (delta > DRAG_THRESHOLD) onAdvance();
    else if (delta < -DRAG_THRESHOLD) onRetreat();
  };
  const cancel = () => {
    startY.current = null;
    setDragging(false);
    setDragOffset(0);
  };

  return {
    dragOffset,
    dragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: settle,
      onPointerCancel: cancel,
      onLostPointerCapture: cancel,
    },
  };
}

export function useScrollGesture({ onAdvance, onRetreat }) {
  const cooling = useRef(false);
  const touchStartY = useRef(null);

  const cooldown = () => {
    cooling.current = true;
    setTimeout(() => {
      cooling.current = false;
    }, SCROLL_COOLDOWN_MS);
  };

  const onWheel = (event) => {
    if (cooling.current) return;
    if (event.deltaY > SCROLL_DELTA_THRESHOLD) {
      cooldown();
      onAdvance();
    } else if (event.deltaY < -SCROLL_DELTA_THRESHOLD) {
      cooldown();
      onRetreat();
    }
  };

  const onTouchStart = (event) => {
    touchStartY.current = event.touches[0].clientY;
  };
  const onTouchEnd = (event) => {
    if (touchStartY.current === null || cooling.current) return;
    const delta = touchStartY.current - event.changedTouches[0].clientY;
    touchStartY.current = null;
    if (delta > TOUCH_SCROLL_THRESHOLD) {
      cooldown();
      onAdvance();
    } else if (delta < -TOUCH_SCROLL_THRESHOLD) {
      cooldown();
      onRetreat();
    }
  };

  return {
    handlers: {
      onWheel,
      onTouchStart,
      onTouchEnd,
    },
  };
}
