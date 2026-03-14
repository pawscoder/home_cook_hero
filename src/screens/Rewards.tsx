import { useHousehold } from "../hooks/useHousehold"
import RewardsProgress from "../components/RewardsProgress"
import RewardItem from "../components/RewardItem"
import AddRewardForm from "../components/AddRewardForm"

export default function Rewards() {
  const { data, updateRewards } = useHousehold()

  function handleDelete(id: string) {
    updateRewards(data.rewards.filter((r) => r.id !== id))
  }

  const nextRewardId = data.rewards
    .filter((r) => !r.unlocked)
    .sort((a, b) => a.streakTarget - b.streakTarget)[0]?.id ?? null

  return (
    <div className="screen">
      <div className="screen-heading">Rewards</div>
      <RewardsProgress streak={data.streak} rewards={data.rewards} />
      <div className="rewards-screen__list">
        {data.rewards.map((reward) => (
          <RewardItem
            key={reward.id}
            reward={reward}
            isNext={reward.id === nextRewardId}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <div className="rewards-screen__add">
        <AddRewardForm rewards={data.rewards} updateRewards={updateRewards} />
      </div>
    </div>
  )
}
