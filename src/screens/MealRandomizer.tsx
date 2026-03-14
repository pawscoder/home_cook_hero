import { useState } from "react"
import type { MealCategory } from "../types"
import { useHousehold } from "../hooks/useHousehold"
import MealTabs from "../components/MealTabs"
import MealResult from "../components/MealResult"
import SpinButton from "../components/SpinButton"

export default function MealRandomizer() {
  const { spinMeal } = useHousehold()
  const [activeCategory, setActiveCategory] = useState<MealCategory>("breakfast")
  const [currentResult, setCurrentResult] = useState<string | null>(null)

  function handleSpin() {
    setCurrentResult(spinMeal(activeCategory))
  }

  function handleTabChange(category: MealCategory) {
    setActiveCategory(category)
    setCurrentResult(null)
  }

  return (
    <div className="screen">
      <div className="screen-heading">Meal Randomizer</div>
      <MealTabs activeCategory={activeCategory} onChange={handleTabChange} />
      <MealResult result={currentResult} category={activeCategory} />
      <SpinButton onSpin={handleSpin} />
      {currentResult !== null && (
        <button className="respin-btn" onClick={handleSpin}>
          Not that one 🔄
        </button>
      )}
    </div>
  )
}
