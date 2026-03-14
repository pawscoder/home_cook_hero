import type { MealCategory } from "../types"

interface Props {
  activeCategory: MealCategory
  onChange: (category: MealCategory) => void
}

const CATEGORIES: MealCategory[] = ["breakfast", "lunch", "dinner", "snacks"]

const LABELS: Record<MealCategory, string> = {
  breakfast: "Breakfast",
  lunch:     "Lunch",
  dinner:    "Dinner",
  snacks:    "Snacks",
}

export default function MealTabs({ activeCategory, onChange }: Props) {
  return (
    <div className="meal-tabs">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={`meal-tab${activeCategory === cat ? " meal-tab--active" : ""}`}
          onClick={() => onChange(cat)}
          aria-current={activeCategory === cat ? "true" : undefined}
        >
          {LABELS[cat]}
        </button>
      ))}
    </div>
  )
}
