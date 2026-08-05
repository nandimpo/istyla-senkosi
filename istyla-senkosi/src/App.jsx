import { Routes, Route, Navigate } from "react-router-dom";
import Experience from "./pages/Experience";
import ChapterNav from "./components/ChapterNav";
import MenuNav from "./components/MenuNav";
import ChapterPager from "./components/ChapterPager";
import HomeLink from "./components/HomeLink";
import { ActiveSectionProvider } from "./context/ActiveSectionContext";

function App() {
  return <ActiveSectionProvider><Routes>
    <Route path="/" element={<Experience />} />
    <Route path="/introduction" element={<Navigate to="/#introduction" replace />} />
    <Route path="/swenka" element={<Navigate to="/#swenka" replace />} />
    <Route path="/pantsula" element={<Navigate to="/#pantsula" replace />} />
    <Route path="/skhothane" element={<Navigate to="/#skhothane" replace />} />
    <Route path="/reflection" element={<Navigate to="/#reflection" replace />} />
  </Routes><HomeLink /><ChapterNav /><ChapterPager /><MenuNav /></ActiveSectionProvider>;
}
export default App;
