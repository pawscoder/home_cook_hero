import type { Reward } from "../types"

interface Props {
  streak: number
  rewards: Reward[]
}

export default function RewardsProgress({ streak, rewards }: Props) {
  const nextReward = rewards
    .filter((r) => !r.unlocked)
    .sort((a, b) => a.streakTarget - b.streakTarget)[0] ?? null

  const progress = nextReward
    ? Math.min((streak / nextReward.streakTarget) * 100, 100)
    : 100

  if (!nextReward) return null

  return (
    <div className="rewards-progress">
      <div className="rewards-progress__next">
        <div className="rewards-progress__next-label">
          Next: {nextReward.label} ({nextReward.streakTarget} meals)
        </div>
        <progress
          className="rewards-progress__bar"
          value={progress}
          max={100}
        />
        <div className="rewards-progress__counter">
          {streak} / {nextReward.streakTarget}
        </div>
      </div>
    </div>
  )
}
