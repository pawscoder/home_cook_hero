import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar"
import Dashboard from "./screens/Dashboard"
import Rewards from "./screens/Rewards"
import MealRandomizer from "./screens/MealRandomizer"
import Settings from "./screens/Settings"
import { useHousehold } from "./hooks/useHousehold"

export default function App() {
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
