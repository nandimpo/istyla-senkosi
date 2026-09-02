import { useNavigation } from "../context/NavigationContext";
import "../styles/HomeLink.css";

function HomeLink() {
  const { goTo } = useNavigation();
  return <button className="global-home-link" onClick={() => goTo("about")}>HOME</button>;
}

export default HomeLink;
