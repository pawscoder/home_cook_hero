import type { Players } from "../types"

interface Props {
  streak: number
  bestStreak: number
  players: Players
}

export default function StreakCard({ streak, bestStreak, players }: Props) {
  return (
    <div className="streak-card">
      {/* key={streak} remounts this element on each streak change, replaying the CSS animation */}
      <span key={streak} className="streak-card__number">{streak}</span>
      <div className="streak-card__label">day streak</div>
      <div className="streak-card__best">Best: {bestStreak}</div>
      <div className="streak-card__players">
        {players.p1} &amp; {players.p2}
      </div>
    </div>
  )
}
