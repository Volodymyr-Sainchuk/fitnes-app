import { Camera, Globe, MapPin, MessageCircle, Phone, Play, Send } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { to: "/", label: "Головна" },
  { to: "/classes", label: "Заняття" },
  { to: "/trainers", label: "Тренери" },
  { to: "/memberships", label: "Абонементи" },
  { to: "/contact", label: "Контакти" },
];

const socialLinks = [
  { href: "https://www.instagram.com/sportlend.club/", label: "Instagram Sportlend", icon: Camera },
  { href: "https://www.facebook.com/sportlend.club/", label: "Facebook Sportlend", icon: MessageCircle },
  { href: "https://www.youtube.com/@sportlendclub", label: "YouTube Sportlend", icon: Play },
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
              <Phone size={16} />
              <a href="tel:+380501234567">+38 (050) 123-45-67</a>
            </li>
            <li>
              <Send size={16} />
              <a href="mailto:hello@sportlend.club">hello@sportlend.club</a>
            </li>
            <li>
              <MapPin size={16} />
              <a
                href="https://www.google.com/maps/search/?api=1&query=Kyiv+Shevchenka+12"
                target="_blank"
                rel="noopener noreferrer"
              >
                Київ, вул. Шевченка 12
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Sportlend</span>
        <div className="footer-socials">
          {socialLinks.map(({ href, label, icon: Icon }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <Icon size={18} />
            </a>
          ))}
        </div>
        <span>
          <a href="https://sportlend.club" target="_blank" rel="noopener noreferrer">
            sportlend.club
          </a>
        </span>
      </div>
    </footer>
  );
}
