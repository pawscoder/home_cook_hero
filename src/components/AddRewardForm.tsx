import { useState } from "react"
import type { Reward } from "../types"

interface Props {
  rewards: Reward[]
  updateRewards: (rewards: Reward[]) => void
}

export default function AddRewardForm({ rewards, updateRewards }: Props) {
  const [label, setLabel] = useState("")
  const [streakTarget, setStreakTarget] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const target = parseInt(streakTarget, 10)
    if (!label.trim() || isNaN(target) || target < 1) return

    const newReward: Reward = {
      id: Date.now().toString(),
      label: label.trim(),
      streakTarget: target,
      unlocked: false,
    }
    updateRewards([...rewards, newReward])
    setLabel("")
    setStreakTarget("")
  }

  return (
    <form className="add-reward-form" onSubmit={handleSubmit}>
      <div className="add-reward-form__title">Add a reward</div>
      <div className="add-reward-form__fields">
        <input
          type="text"
          placeholder="Reward label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          className="add-reward-form__target"
          type="number"
          placeholder="Meals"
          value={streakTarget}
          min={1}
          onChange={(e) => setStreakTarget(e.target.value)}
        />
      </div>
      <button className="btn-save" type="submit">Add Reward</button>
    </form>
  )
}
