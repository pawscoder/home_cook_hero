import type { Reward } from "../types"

interface Props {
  reward: Reward
  isNext: boolean
  onDelete?: (id: string) => void
}

export default function RewardItem({ reward, isNext, onDelete }: Props) {
  let status: string
  let modifier: string
  if (reward.unlocked)   { status = "✅"; modifier = "reward-item--unlocked" }
  else if (isNext)       { status = "🎯"; modifier = "reward-item--next" }
  else                   { status = "🔒"; modifier = "reward-item--locked" }

  return (
    <div className={`reward-item ${modifier}`}>
      <span className="reward-item__status">{status}</span>
      <span className="reward-item__label">{reward.label}</span>
      <span className="reward-item__target">{reward.streakTarget} meals</span>
      {onDelete && (
        <button className="btn-delete" onClick={() => onDelete(reward.id)}>
          Delete
        </button>
      )}
    </div>
  )
}
