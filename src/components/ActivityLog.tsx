import type { LogEntry, LogType } from "../types"

interface Props {
  log: LogEntry[]
}

const ICONS: Record<LogType, string> = {
  cooked:  "🥘",
  skipped: "⏭️",
  eatout:  "😬",
}

// Group entries by date, return dates sorted newest-first
function groupByDate(log: LogEntry[]): { date: string; entries: LogEntry[] }[] {
  const map = new Map<string, LogEntry[]>()
  for (const entry of log) {
    const group = map.get(entry.date) ?? []
    group.push(entry)
    map.set(entry.date, group)
  }
  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([date, entries]) => ({ date, entries }))
}

export default function ActivityLog({ log }: Props) {
  if (log.length === 0) {
    return (
      <div className="activity-log">
        <div className="activity-log__empty">No meals logged yet. Start cooking! 🍳</div>
      </div>
    )
  }

  const days = groupByDate(log)

  return (
    <div className="activity-log">
      <div className="activity-log__heading">Recent activity</div>
      <div className="activity-log__list">
        {days.map(({ date, entries }) => (
          <div key={date} className="activity-log__day">
            <span className="activity-log__date">{date}</span>
            <div className="activity-log__meals">
              {entries.map((entry) => (
                <span key={entry.id} className="activity-log__chip">
                  <span className="activity-log__icon">{ICONS[entry.type]}</span>
                  <span className="activity-log__meal">
                    {entry.meal.charAt(0).toUpperCase() + entry.meal.slice(1)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
