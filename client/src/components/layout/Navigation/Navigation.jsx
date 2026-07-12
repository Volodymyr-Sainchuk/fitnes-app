import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth/useAuth.jsx";

const links = [
  { href: "/", label: "Головна" },
  { href: "/classes", label: "Заняття" },
  { href: "/trainers", label: "Тренери" },
  { href: "/memberships", label: "Абонементи" },
  { href: "/contact", label: "Контакти" },
];

export default function Navigation() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <nav className="top-nav" aria-label="Головна навігація">
      <button
        className="mobile-menu-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Відкрити меню"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <div className={`nav-links ${open ? "nav-links-open" : ""}`}>
        {links.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        {user?.role === "ADMIN" ? (
          <NavLink to="/admin" className="nav-link" onClick={() => setOpen(false)}>
            Адмін-панель
          </NavLink>
        ) : null}
        {user ? (
          <>
            <NavLink to="/dashboard" className="nav-link" onClick={() => setOpen(false)}>
              Кабінет
            </NavLink>
            <button className="nav-link nav-link-button" onClick={() => logout()}>
              Вийти
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link" onClick={() => setOpen(false)}>
              Увійти
            </NavLink>
            <NavLink to="/register" className="nav-link" onClick={() => setOpen(false)}>
              Реєстрація
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
