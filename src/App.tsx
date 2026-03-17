import { useEffect, useState } from "react"
import { onAuthStateChanged} from "firebase/auth"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar"
import Dashboard from "./screens/Dashboard"
import Rewards from "./screens/Rewards"
import MealRandomizer from "./screens/MealRandomizer"
import Settings from "./screens/Settings"
import Login from "./screens/Login"
import SignUp from "./screens/SignUp"
import { useHousehold } from "./hooks/useHousehold"
import { auth } from "./firebase"
import type { User } from 'firebase/auth';


function AuthenticatedApp() {
  const { loading } = useHousehold()

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Syncing with your household... 🍳
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div id="anim-root" />
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/meals" element={<MealRandomizer />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showSignUp, setShowSignUp] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setAuthLoading(false)
    })
    return unsubscribe
  }, [])

  if (authLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Loading…
      </div>
    )
  }

  if (user) return <AuthenticatedApp />

  return showSignUp
    ? <SignUp onSwitchToLogin={() => setShowSignUp(false)} />
    : <Login onSwitchToSignUp={() => setShowSignUp(true)} />
}
