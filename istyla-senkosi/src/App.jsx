import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Introduction from "./pages/Introduction";
import Swenka from "./pages/Swenka";
import Pantsula from "./pages/Pantsula";
import Skhothane from "./pages/Skhothane";
import Reflection from "./pages/Reflection";
import ChapterNav from "./components/ChapterNav";
import MenuNav from "./components/MenuNav";
import ChapterPager from "./components/ChapterPager";
import HomeLink from "./components/HomeLink";
import { ChapterReadyProvider } from "./context/ChapterReadyContext";

function App() {
  return <ChapterReadyProvider><Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/introduction" element={<Introduction />} />
    <Route path="/swenka" element={<Swenka />} />
    <Route path="/pantsula" element={<Pantsula />} />
    <Route path="/skhothane" element={<Skhothane />} />
    <Route path="/reflection" element={<Reflection />} />
  </Routes><HomeLink /><ChapterNav /><ChapterPager /><MenuNav /></ChapterReadyProvider>;
}
export default App;

