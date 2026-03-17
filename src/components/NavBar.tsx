import { useState, useRef, useEffect } from "react"
import { NavLink } from "react-router-dom"
import { signOut } from "firebase/auth"
import { auth } from "../firebase"

const LINKS = [
  { to: "/",        icon: "🏠", label: "Home"    },
  { to: "/meals",   icon: "🎲", label: "Meals"   },
  { to: "/rewards", icon: "🏆", label: "Rewards" },
]

export default function NavBar() {
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!moreOpen) return
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [moreOpen])

  return (
    <nav className="navbar">
      {LINKS.map(({ to, icon, label }) => (
        <NavLink key={to} to={to} end={to === "/"}>
          <span className="navbar__icon">{icon}</span>
          {label}
        </NavLink>
      ))}
      <div ref={moreRef} className="navbar__more-wrap">
        <button
          className="navbar__more-btn"
          onClick={() => setMoreOpen(o => !o)}
          aria-label="More options"
        >
          <span className="navbar__icon" style={{ fontSize: 14, letterSpacing: 2 }}>•••</span>
          More
        </button>
        {moreOpen && (
          <div className="navbar__more-panel">
            <NavLink
              to="/settings"
              className="navbar__more-item"
              onClick={() => setMoreOpen(false)}
            >
              <span>⚙️</span> Settings
            </NavLink>
            <button
              className="navbar__more-item"
              onClick={() => { setMoreOpen(false); signOut(auth) }}
            >
              <span>🚪</span> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
