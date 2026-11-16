import { useNavigation } from "../context/NavigationContext";
import "../styles/HomeLink.css";

function HomeLink() {
  const { goTo, pageReady } = useNavigation();
  return <button className="global-home-link" disabled={!pageReady} onClick={() => goTo("about")}>HOME</button>;
}

export default HomeLink;
