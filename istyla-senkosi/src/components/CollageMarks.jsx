import circle from "../assets/images/Illustrations/Circle.png";
import star from "../assets/images/Illustrations/Star.png";
import yellowStar from "../assets/images/Illustrations/Yellow_Star.png";
import swiggle from "../assets/images/Illustrations/Swiggle.png";
import zigzag from "../assets/images/Illustrations/Zigzag.png";
import "../styles/CollageMarks.css";

const assets = { circle, star, blueStar: star, yellowStar, swiggle, zigzag };
export default function CollageMarks({ className, height, marks }) {
  return <svg className={`${className} collage-asset-marks`} viewBox={`0 0 1000 ${height}`} preserveAspectRatio="none" aria-hidden="true">
    {marks.map(([kind,x,y,width,height], index) => <image key={index} className={`collage-mark--${kind}`} href={assets[kind]} x={x} y={y} width={width} height={height} preserveAspectRatio="none" />)}
  </svg>;
}
