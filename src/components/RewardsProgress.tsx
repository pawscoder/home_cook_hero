import type { Reward } from "../types"
import RewardItem from "./RewardItem"

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

  return (
    <div className="rewards-progress">
      {nextReward ? (
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
      ) : (
        <div className="rewards-progress__all-done">All rewards unlocked! 🎉</div>
      )}
      <div className="rewards-progress__list">
        {rewards.map((reward) => (
          <RewardItem
            key={reward.id}
            reward={reward}
            isNext={nextReward?.id === reward.id}
          />
        ))}
      </div>
    </div>
  )
}
