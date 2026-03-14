import { useHousehold } from "../hooks/useHousehold"

export default function Dashboard() {
  const { data } = useHousehold()

  return (
    <div>
      <h1>Home Cook Hero</h1>
      <p>Current streak: {data.streak}</p>
      <p>Best streak: {data.bestStreak}</p>
      <p>Money saved this month: ${data.moneySavedThisMonth}</p>
    </div>
  )
}
