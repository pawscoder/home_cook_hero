import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from "./components/NavBar"
import Dashboard from "./screens/Dashboard"
import Rewards from "./screens/Rewards"
import MealRandomizer from "./screens/MealRandomizer"
import Settings from "./screens/Settings"

export default function App() {
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
