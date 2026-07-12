import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import Navigation from "../Navigation/Navigation.jsx";

export default function Header() {
  return (
    <header className="site-header">
      <div className="brand-wrap">
        <Link to="/" className="brand-link" aria-label="Sportlend головна">
          <div className="brand-icon">
            <Dumbbell size={20} />
          </div>
          <div>
            <p className="brand-name">Sportlend</p>
            <p className="brand-subtitle">Преміум фітнес-клуб</p>
          </div>
        </Link>
      </div>
      <Navigation />
    </header>
  );
}
