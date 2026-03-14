interface Props {
  moneySavedThisMonth: number
  mealsCookedThisMonth: number
}

export default function StatsRow({ moneySavedThisMonth, mealsCookedThisMonth }: Props) {
  return (
    <div className="stats-row">
      <div className="stats-row__tile">
        <div className="stats-row__value">${moneySavedThisMonth}</div>
        <div className="stats-row__label">saved this month</div>
      </div>
      <div className="stats-row__tile">
        <div className="stats-row__value">{mealsCookedThisMonth}</div>
        <div className="stats-row__label">meals cooked</div>
      </div>
    </div>
  )
}
