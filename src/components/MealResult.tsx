import type { MealCategory } from "../types"

interface Props {
  result: string | null
  category: MealCategory
}

const EMOJI: Record<MealCategory, string> = {
  breakfast: "🍳",
  lunch: "🥗",
  dinner: "🍽️",
  snacks: "🍎",
}

export default function MealResult({ result, category }: Props) {
  if (result === null) {
    return (
      <div className="meal-result">
        <span className="meal-result__empty">Tap spin to get a meal idea</span>
      </div>
    )
  }

  return (
    <div className="meal-result">
      {/* key remounts the inner content on each new result, replaying pop-in */}
      <div key={result} className="meal-result__inner">
        <div className="meal-result__emoji">{EMOJI[category]}</div>
        <div className="meal-result__name">{result}</div>
      </div>
    </div>
  )
}
