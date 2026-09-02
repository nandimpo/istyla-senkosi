import { Routes, Route, Navigate } from "react-router-dom";
import Experience from "./pages/Experience";
import ChapterNav from "./components/ChapterNav";
import MenuNav from "./components/MenuNav";
import HomeLink from "./components/HomeLink";
import { NavigationProvider } from "./context/NavigationContext";

function App() {
  return <NavigationProvider><Routes>
    <Route path="/" element={<Experience />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes><HomeLink /><ChapterNav /><MenuNav /></NavigationProvider>;
}
export default App;
