import { useState } from "react"
import type { MealTime } from "../types"

interface Props {
  logCook:   (meal: MealTime, date: string) => void
  logSkip:   (meal: MealTime, date: string) => void
  logEatOut: (meal: MealTime, date: string) => void
}

const MEALS: MealTime[] = ["breakfast", "lunch", "dinner"]

function todayString(): string {
  return new Date().toISOString().split("T")[0]
}

export default function ActionButtons({ logCook, logSkip, logEatOut }: Props) {
  const [selectedMeal, setSelectedMeal] = useState<MealTime | null>(null)
  const [date, setDate] = useState(todayString)

  function handleAction(action: "cook" | "skip" | "eatout") {
    if (!selectedMeal) return
    if (action === "cook")   logCook(selectedMeal, date)
    else if (action === "skip") logSkip(selectedMeal, date)
    else                     logEatOut(selectedMeal, date)
    setSelectedMeal(null)
    setDate(todayString())
  }

  function handleBack() {
    setSelectedMeal(null)
    setDate(todayString())
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
      <div className="action-buttons__date-row">
        <label className="action-buttons__date-label" htmlFor="log-date">Date</label>
        <input
          id="log-date"
          className="action-buttons__date-input"
          type="date"
          value={date}
          max={todayString()}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="action-buttons__actions">
        <button className="btn-action btn-cook"   onClick={() => handleAction("cook")}>
          We Cooked 🥘
        </button>
        <button className="btn-action btn-skip"   onClick={() => handleAction("skip")}>
          We Skipped ⏭️
        </button>
        <button className="btn-action btn-eatout" onClick={() => handleAction("eatout")}>
          We Ate Out 😬
        </button>
        <button className="btn-back" onClick={handleBack}>← Back</button>
      </div>
    </div>
  )
}
