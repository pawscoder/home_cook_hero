export type MealCategory = "breakfast" | "lunch" | "dinner" | "snacks"

export type LogType = "cooked" | "eatout" | "skipped"

export type MealTime = "breakfast" | "lunch" | "dinner"

export interface LogEntry {
  id: number
  type: LogType
  meal: MealTime
  date: string // ISO date string, date only e.g. "2025-03-13"
  note: string
}

export interface Reward {
  id: string
  label: string
  streakTarget: number
  unlocked: boolean
}

export interface Players {
  p1: string
  p2: string
}

export interface MealLists {
  breakfast: string[]
  lunch: string[]
  dinner: string[]
  snacks: string[]
}

export interface HouseholdState {
  streak: number
  bestStreak: number
  mealsCookedThisMonth: number
  moneySavedThisMonth: number
  avgMealSavings: number
  log: LogEntry[]
  players: Players
  meals: MealLists
  rewards: Reward[]
}
