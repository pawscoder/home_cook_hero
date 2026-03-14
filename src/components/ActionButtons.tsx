import { useState } from "react"
import type { MealTime } from "../types"

interface Props {
  logCook: (meal: MealTime) => void
  logSkip: (meal: MealTime) => void
  logEatOut: (meal: MealTime) => void
}

const MEALS: MealTime[] = ["breakfast", "lunch", "dinner"]

export default function ActionButtons({ logCook, logSkip, logEatOut }: Props) {
  const [selectedMeal, setSelectedMeal] = useState<MealTime | null>(null)

  function handleAction(action: "cook" | "skip" | "eatout") {
    if (!selectedMeal) return
    if (action === "cook") logCook(selectedMeal)
    else if (action === "skip") logSkip(selectedMeal)
    else logEatOut(selectedMeal)
    setSelectedMeal(null)
  }

  if (selectedMeal === null) {
    return (
      <div className="action-buttons">
        <div className="action-buttons__title">Log a meal</div>
        <div className="action-buttons__meals">
          {MEALS.map((meal) => (
            <button
              key={meal}
              className="btn-meal"
              onClick={() => setSelectedMeal(meal)}
            >
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="action-buttons">
      <div className="action-buttons__header">
        {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)} — what happened?
      </div>
      <div className="action-buttons__actions">
        <button className="btn-action btn-cook" onClick={() => handleAction("cook")}>
          We Cooked 🥘
        </button>
        <button className="btn-action btn-skip" onClick={() => handleAction("skip")}>
          We Skipped ⏭️
        </button>
        <button className="btn-action btn-eatout" onClick={() => handleAction("eatout")}>
          We Ate Out 😬
        </button>
        <button className="btn-back" onClick={() => setSelectedMeal(null)}>
          ← Back
        </button>
      </div>
    </div>
  )
}
