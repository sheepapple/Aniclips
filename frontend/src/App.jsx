import "./css/App.css";
import Favorites from "./pages/Favorites"
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext.jsx";  

function App() {
  //console.log("rip lol")
  return (
    <MovieProvider>
      <NavBar />
    <main className="main-content"> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </main>
    </MovieProvider>
  );
} 

export default App;
