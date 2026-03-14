import { useState } from "react"
import type {
  HouseholdState,
  LogEntry,
  MealCategory,
  MealTime,
  Reward,
} from "../types"

const STORAGE_KEY = "home-cook-hero"

const DEFAULT_STATE: HouseholdState = {
  streak: 0,
  bestStreak: 0,
  mealsCookedThisMonth: 0,
  moneySavedThisMonth: 0,
  avgMealSavings: 25,
  log: [],
  players: {
    p1: "Partner 1",
    p2: "Partner 2",
  },
  meals: {
    breakfast: [
      "Avocado toast",
      "Smoothie bowl",
      "Scrambled eggs & toast",
      "Overnight oats",
      "Greek yogurt parfait",
      "Banana pancakes",
    ],
    lunch: [
      "Grain bowl",
      "Chicken wraps",
      "Caesar salad",
      "Tomato soup & grilled cheese",
      "Tuna sandwich",
      "Leftovers stir fry",
    ],
    dinner: [
      "Pasta arrabbiata",
      "Chicken stir fry",
      "Tacos",
      "Roast chicken & veggies",
      "Salmon with rice",
      "Homemade pizza",
      "Lentil curry",
    ],
    snacks: [
      "Hummus & veggies",
      "Fruit salad",
      "Yogurt & granola",
      "Mixed nuts",
      "Apple & peanut butter",
      "Rice cakes",
    ],
  },
  rewards: [
    { id: "r1", label: "Nice dinner out 🍷", streakTarget: 21, unlocked: false },
    { id: "r2", label: "Spa day 💆", streakTarget: 42, unlocked: false },
    { id: "r3", label: "Weekend trip ✈️", streakTarget: 90, unlocked: false },
  ],
}

function load(): HouseholdState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as HouseholdState
  } catch {
    // fall through to default
  }
  return DEFAULT_STATE
}

function save(state: HouseholdState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function today(): string {
  return new Date().toISOString().split("T")[0]
}

function unlockRewards(rewards: Reward[], streak: number): Reward[] {
  return rewards.map((r) =>
    !r.unlocked && streak >= r.streakTarget ? { ...r, unlocked: true } : r
  )
}

// Derives streak, bestStreak, mealsCookedThisMonth, and moneySavedThisMonth
// directly from the log array. Used when overwriting an existing entry so that
// all counters stay consistent regardless of the old→new type transition.
function recalculateFromLog(
  log: LogEntry[],
  avgMealSavings: number,
  previousBestStreak: number
): Pick<HouseholdState, "streak" | "bestStreak" | "mealsCookedThisMonth" | "moneySavedThisMonth"> {
  const currentMonth = new Date().toISOString().slice(0, 7) // "YYYY-MM"
  let streak = 0
  let bestStreak = previousBestStreak
  let mealsCookedThisMonth = 0

  // Sort by id (Date.now()) to replay events in insertion order
  const sorted = [...log].sort((a, b) => a.id - b.id)

  for (const entry of sorted) {
    if (entry.type === "cooked") {
      streak++
      if (streak > bestStreak) bestStreak = streak
    } else if (entry.type === "eatout") {
      if (streak > bestStreak) bestStreak = streak
      streak = 0
    }
    // skipped: streak unchanged
    if (entry.type === "cooked" && entry.date.startsWith(currentMonth)) {
      mealsCookedThisMonth++
    }
  }

  return {
    streak,
    bestStreak,
    mealsCookedThisMonth,
    moneySavedThisMonth: mealsCookedThisMonth * avgMealSavings,
  }
}

export function useHousehold() {
  const [data, setData] = useState<HouseholdState>(load)

  function update(next: HouseholdState) {
    save(next)
    setData(next)
  }

  // Builds the new log for a meal action, replacing any existing entry for the
  // same meal type on the same day. Returns the updated log array.
  function buildLog(meal: MealTime, type: "cooked" | "eatout" | "skipped", date: string): LogEntry[] {
    const filtered = data.log.filter(
      (e) => !(e.date === date && e.meal === meal)
    )
    return [...filtered, { id: Date.now(), type, meal, date, note: "" }]
  }

  function logCook(meal: MealTime, date: string = today()): void {
    const newLog = buildLog(meal, "cooked", date)
    const isOverwrite = newLog.length === data.log.length // same length means an entry was replaced

    let streak: number, bestStreak: number, mealsCookedThisMonth: number, moneySavedThisMonth: number

    if (isOverwrite) {
      ;({ streak, bestStreak, mealsCookedThisMonth, moneySavedThisMonth } =
        recalculateFromLog(newLog, data.avgMealSavings, data.bestStreak))
    } else {
      streak = data.streak + 1
      bestStreak = Math.max(streak, data.bestStreak)
      mealsCookedThisMonth = data.mealsCookedThisMonth + 1
      moneySavedThisMonth = data.moneySavedThisMonth + data.avgMealSavings
    }

    update({
      ...data,
      streak,
      bestStreak,
      mealsCookedThisMonth,
      moneySavedThisMonth,
      log: newLog,
      rewards: unlockRewards(data.rewards, streak),
    })
  }

  function logEatOut(meal: MealTime, date: string = today()): void {
    const newLog = buildLog(meal, "eatout", date)
    const isOverwrite = newLog.length === data.log.length

    let bestStreak: number

    if (isOverwrite) {
      const recalc = recalculateFromLog(newLog, data.avgMealSavings, data.bestStreak)
      update({
        ...data,
        streak: recalc.streak,
        bestStreak: recalc.bestStreak,
        mealsCookedThisMonth: recalc.mealsCookedThisMonth,
        moneySavedThisMonth: recalc.moneySavedThisMonth,
        log: newLog,
      })
    } else {
      bestStreak = Math.max(data.streak, data.bestStreak)
      update({ ...data, streak: 0, bestStreak, log: newLog })
    }
  }

  function logSkip(meal: MealTime, date: string = today()): void {
    const newLog = buildLog(meal, "skipped", date)
    const isOverwrite = newLog.length === data.log.length

    if (isOverwrite) {
      const recalc = recalculateFromLog(newLog, data.avgMealSavings, data.bestStreak)
      update({
        ...data,
        streak: recalc.streak,
        bestStreak: recalc.bestStreak,
        mealsCookedThisMonth: recalc.mealsCookedThisMonth,
        moneySavedThisMonth: recalc.moneySavedThisMonth,
        log: newLog,
      })
    } else {
      // Skip is neutral — streak unchanged, no reward check
      update({ ...data, log: newLog })
    }
  }

  function spinMeal(category: MealCategory): string {
    const list = data.meals[category]
    return list[Math.floor(Math.random() * list.length)]
  }

  function updateSettings(partial: Partial<HouseholdState>): void {
    update({ ...data, ...partial })
  }

  function updateMeals(category: MealCategory, meals: string[]): void {
    update({ ...data, meals: { ...data.meals, [category]: meals } })
  }

  function updateRewards(rewards: Reward[]): void {
    update({ ...data, rewards })
  }

  function resetStreak(): void {
    update({ ...data, streak: 0 })
  }

  return {
    data,
    logCook,
    logEatOut,
    logSkip,
    spinMeal,
    updateSettings,
    updateMeals,
    updateRewards,
    resetStreak,
  }
}
