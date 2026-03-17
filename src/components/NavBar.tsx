import { NavLink } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"

const LINKS = [
  { to: "/",         icon: "🏠", label: "Home"     },
  { to: "/meals",    icon: "🎲", label: "Meals"    },
  { to: "/rewards",  icon: "🏆", label: "Rewards"  },
  { to: "/settings", icon: "⚙️", label: "Settings" },
]

export default function NavBar() {
  return (
    <nav className="navbar">
      {LINKS.map(({ to, icon, label }) => (
        <NavLink key={to} to={to} end={to === "/"}>
          <span className="navbar__icon">{icon}</span>
          {label}
        </NavLink>
      ))}
      <button
        onClick={() => signOut(auth)}
        style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px", fontSize: "12px", color: "inherit", padding: "0 8px" }}
      >
        <span className="navbar__icon">🚪</span>
        Logout
      </button>
    </nav>
  )
}
