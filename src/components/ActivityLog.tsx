import type { LogEntry, LogType } from "../types"

interface Props {
  log: LogEntry[]
}

const ICONS: Record<LogType, string> = {
  cooked:  "🥘",
  skipped: "⏭️",
  eatout:  "😬",
}

export default function ActivityLog({ log }: Props) {
  if (log.length === 0) {
    return (
      <div className="activity-log">
        <div className="activity-log__empty">No meals logged yet. Start cooking! 🍳</div>
      </div>
    )
  }

  return (
    <div className="activity-log">
      <div className="activity-log__heading">Recent activity</div>
      <div className="activity-log__list">
        {[...log].reverse().map((entry) => (
          <div key={entry.id} className="activity-log__item">
            <span className="activity-log__icon">{ICONS[entry.type]}</span>
            <span className="activity-log__meal">
              {entry.meal.charAt(0).toUpperCase() + entry.meal.slice(1)}
            </span>
            <span className="activity-log__date">{entry.date}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
