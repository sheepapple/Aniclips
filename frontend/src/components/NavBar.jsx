import { Link } from "react-router-dom"
import "../css/Navbar.css"

function NavBar() {
    return <nav className="navbar">
        <div className="navbar-brand">
            <Link to="/">Aniclips</Link>
        </div>
        <div className="navbar-links">
            <Link to="/projects/Aniclips" className="nav-link">Home</Link>
            <Link to="/projects/Aniclips/favorites" className="nav-link">Favorites</Link>
            <Link to="/projects/Aniclips/clips" className="nav-link">Clips (experimental)</Link>
        </div>
    </nav>
}

export default NavBar