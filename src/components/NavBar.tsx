import { NavLink } from "react-router-dom"

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
    </nav>
  )
}
