// src/features/navbar/view/navbar.tsx
import { getNavbarItems } from "../controller/navbarcontroller";
import "../styles/navbar.css";

type NavbarProps = {
  activePage: string;
  setActivePage: (page: string) => void;
};

export default function Navbar({ activePage, setActivePage }: NavbarProps) {
  const items = getNavbarItems();
  return (
    <aside className="sidebar">
      <div className="sidebar-title">Skill Sync</div>
      <nav className="sidebar-nav">
        <ul>
          {items.map((item, idx) => (
            <li
              key={idx}
              className={activePage === item.page ? "active" : ""}
              onClick={() => setActivePage(item.page)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-avatar">G</span>
          <span className="sidebar-user-name">Ganeswara Dan...</span>
        </div>
      </div>
    </aside>
  );
}
