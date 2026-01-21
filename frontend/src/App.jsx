import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import { MovieProvider } from "./contexts/MovieContext.jsx";
import "./css/App.css";
import Clips from "./pages/Clips";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";

function App() {
  //console.log("rip lol")
  return (
    <MovieProvider>
      <NavBar />
    <main className="main-content">
      <Routes>
        <Route path="/projects/Aniclips/" element={<Home />} />
        <Route path="/projects/Aniclips/favorites" element={<Favorites />} />
        <Route path="/projects/Aniclips/clips" element={<Clips />} />
      </Routes>
    </main>
    </MovieProvider>
  );
}

export default App;
