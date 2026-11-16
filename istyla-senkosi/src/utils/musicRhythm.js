// Analyse the soundtrack without routing or changing its audible playback.
const analyses = new Map();

export function detectBeatTimes(samples, sampleRate) {
  const size = Math.max(1, Math.round(sampleRate * .02));
  const energies = [];
  for (let start = 0; start < samples.length; start += size) {
    let sum = 0;
    const end = Math.min(samples.length, start + size);
    for (let i = start; i < end; i++) sum += samples[i] * samples[i];
    energies.push(Math.sqrt(sum / (end - start)));
  }
  const flux = energies.map((energy, i) => Math.max(0, energy - (energies[i - 1] || 0)));
  const beats = [];
  for (let i = 1; i < flux.length - 1; i++) {
    const from = Math.max(0, i - 25);
    const to = Math.min(flux.length, i + 25);
    const average = flux.slice(from, to).reduce((sum, value) => sum + value, 0) / (to - from);
    const time = i * size / sampleRate;
    if (flux[i] > Math.max(.001, average * 1.7) && flux[i] >= flux[i - 1] && flux[i] > flux[i + 1] && (!beats.length || time - beats.at(-1) >= .24)) beats.push(time);
  }
  return beats;
}

export function soundtrackBeats(source) {
  if (!source) return Promise.resolve([]);
  if (!analyses.has(source)) {
    analyses.set(source, (async () => {
      const response = await fetch(source);
      if (!response.ok) return [];
      const Context = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      if (!Context) return [];
      const context = new Context(1, 1, 22050);
      const buffer = await context.decodeAudioData(await response.arrayBuffer());
      return detectBeatTimes(buffer.getChannelData(0), buffer.sampleRate);
    })().catch(() => []));
  }
  return analyses.get(source);
}
