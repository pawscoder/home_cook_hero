import { useRef, useEffect } from "react"
import { useHousehold } from "../hooks/useHousehold"
import type { MealTime } from "../types"
import StreakCard from "../components/StreakCard"
import StatsRow from "../components/StatsRow"
import RewardsProgress from "../components/RewardsProgress"
import ActionButtons from "../components/ActionButtons"
import ActivityLog from "../components/ActivityLog"
import {
  triggerCelebration,
  triggerSkip,
  triggerGuilt,
  triggerRewardUnlock,
} from "../utils/animations"

export default function Dashboard() {
  const { data, logCook, logSkip, logEatOut } = useHousehold()
  const prevRewardsRef = useRef(data.rewards)

  // Detect newly unlocked rewards after any state update
  useEffect(() => {
    const prev = prevRewardsRef.current
    const newlyUnlocked = data.rewards.filter(
      (r) => r.unlocked && !prev.find((p) => p.id === r.id)?.unlocked
    )
    newlyUnlocked.forEach((r) => triggerRewardUnlock(r.label))
    prevRewardsRef.current = data.rewards
  }, [data.rewards])

  function handleCook(meal: MealTime) {
    logCook(meal)
    triggerCelebration()
  }

  function handleSkip(meal: MealTime) {
    logSkip(meal)
    triggerSkip()
  }

  function handleEatOut(meal: MealTime) {
    logEatOut(meal)
    triggerGuilt()
  }

  return (
    <div className="screen">
      <StreakCard
        streak={data.streak}
        bestStreak={data.bestStreak}
        players={data.players}
      />
      <StatsRow
        moneySavedThisMonth={data.moneySavedThisMonth}
        mealsCookedThisMonth={data.mealsCookedThisMonth}
      />
      <RewardsProgress streak={data.streak} rewards={data.rewards} />
      <ActionButtons
        logCook={handleCook}
        logSkip={handleSkip}
        logEatOut={handleEatOut}
      />
      <ActivityLog log={data.log} />
    </div>
  )
}
