import { Camera, MapPin, Phone, Send } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Головна" },
  { to: "/classes", label: "Заняття" },
  { to: "/trainers", label: "Тренери" },
  { to: "/memberships", label: "Абонементи" },
  { to: "/contact", label: "Контакти" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <p className="section-eyebrow">Sportlend</p>
          <h3>Преміум фітнес для сильного щоденного ритму.</h3>
          <p>Тренажерний зал, групові заняття, персональний супровід і атмосфера, що надихає з першого кроку.</p>
        </div>
        <div>
          <h4>Навігація</h4>
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Контакти</h4>
          <ul className="footer-contact-list">
            <li>
              <Phone size={16} /> +38 (050) 123-45-67
            </li>
            <li>
              <Send size={16} /> hello@sportlend.club
            </li>
            <li>
              <MapPin size={16} /> Київ, вул. Шевченка 12
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Sportlend</span>
        <div className="footer-socials">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram Sportlend">
            <Send size={18} />
          </a>
          <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok Sportlend">
            <Camera size={18} />
          </a>
        </div>
        <span>Volodymyr Sainchuk — CEO</span>
      </div>
    </footer>
  );
}
