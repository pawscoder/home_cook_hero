import { useState } from "react"
import type { MealCategory } from "../types"
import { useHousehold } from "../hooks/useHousehold"

const MEAL_CATEGORIES: MealCategory[] = ["breakfast", "lunch", "dinner", "snacks"]

const CATEGORY_LABELS: Record<MealCategory, string> = {
  breakfast: "Breakfast",
  lunch:     "Lunch",
  dinner:    "Dinner",
  snacks:    "Snacks",
}

function NamesSection() {
  const { data, updateSettings } = useHousehold()
  const [p1, setP1] = useState(data.players.p1)
  const [p2, setP2] = useState(data.players.p2)

  function handleSave() {
    updateSettings({ players: { p1, p2 } })
  }

  return (
    <section className="settings__section">
      <div className="settings__section-title">Our Names</div>
      <div className="settings__fields">
        <label className="settings__label">
          Partner 1
          <input type="text" value={p1} onChange={(e) => setP1(e.target.value)} />
        </label>
        <label className="settings__label">
          Partner 2
          <input type="text" value={p2} onChange={(e) => setP2(e.target.value)} />
        </label>
      </div>
      <button className="btn-save" onClick={handleSave}>Save</button>
    </section>
  )
}

function SavingsSection() {
  const { data, updateSettings } = useHousehold()
  const [value, setValue] = useState(String(data.avgMealSavings))

  function handleSave() {
    const parsed = parseInt(value, 10)
    if (!isNaN(parsed) && parsed > 0) {
      updateSettings({ avgMealSavings: parsed })
    }
  }

  return (
    <section className="settings__section">
      <div className="settings__section-title">Average Savings Per Meal</div>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <p className="settings__hint">
        We calculate your monthly savings based on this amount per home-cooked meal
      </p>
      <button className="btn-save" onClick={handleSave}>Save</button>
    </section>
  )
}

function MealListSection({ category }: { category: MealCategory }) {
  const { data, updateMeals } = useHousehold()
  const [text, setText] = useState(data.meals[category].join("\n"))

  function handleSave() {
    const meals = text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
    updateMeals(category, meals)
  }

  return (
    <div className="settings__meal-category">
      <div className="settings__category-label">{CATEGORY_LABELS[category]}</div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
      />
      <button className="btn-save" onClick={handleSave}>Save</button>
    </div>
  )
}

function DangerZone() {
  const { resetStreak } = useHousehold()

  function handleReset() {
    const confirmed = window.confirm(
      "Are you sure? This will reset your current streak to 0. Your best streak will be preserved."
    )
    if (confirmed) resetStreak()
  }

  return (
    <section className="settings__section settings__section--danger">
      <div className="settings__section-title">Danger Zone</div>
      <button className="btn-danger" onClick={handleReset}>Reset Streak</button>
    </section>
  )
}

export default function Settings() {
  return (
    <div className="screen settings-screen">
      <div className="screen-heading">Settings</div>
      <NamesSection />
      <SavingsSection />
      <section className="settings__section">
        <div className="settings__section-title">Edit Meal Lists</div>
        {MEAL_CATEGORIES.map((cat) => (
          <MealListSection key={cat} category={cat} />
        ))}
      </section>
      <DangerZone />
    </div>
  )
}
