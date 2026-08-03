import { Link } from "react-router-dom";
import "../styles/HomeLink.css";

function HomeLink() {
  return <Link className="global-home-link" to="/">HOME</Link>;
}

export default HomeLink;