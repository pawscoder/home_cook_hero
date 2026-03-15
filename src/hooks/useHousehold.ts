import { useState, useEffect } from "react"
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import type {
  HouseholdState,
  LogEntry,
  MealCategory,
  MealTime,
  Reward,
} from "../types"

const HOUSEHOLD_ID = import.meta.env.VITE_HOUSEHOLD_ID as string

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

function today(): string {
  return new Date().toISOString().split("T")[0]
}

function unlockRewards(rewards: Reward[], streak: number): Reward[] {
  return rewards.map((r) =>
    !r.unlocked && streak >= r.streakTarget ? { ...r, unlocked: true } : r
  )
}

function recalculateFromLog(
  log: LogEntry[],
  avgMealSavings: number,
  previousBestStreak: number
): Pick<HouseholdState, "streak" | "bestStreak" | "mealsCookedThisMonth" | "moneySavedThisMonth"> {
  const currentMonth = new Date().toISOString().slice(0, 7)
  let streak = 0
  let bestStreak = previousBestStreak
  let mealsCookedThisMonth = 0

  const sorted = [...log].sort((a, b) => a.id - b.id)

  for (const entry of sorted) {
    if (entry.type === "cooked") {
      streak++
      if (streak > bestStreak) bestStreak = streak
    } else if (entry.type === "eatout") {
      if (streak > bestStreak) bestStreak = streak
      streak = 0
    }
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
  const [data, setData] = useState<HouseholdState>(DEFAULT_STATE)
  const [loading, setLoading] = useState(true)

  const docRef = doc(db, "households", HOUSEHOLD_ID)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      docRef,
      async (snapshot) => {
        if (!snapshot.exists()) {
          await setDoc(docRef, DEFAULT_STATE)
        } else {
          setData(snapshot.data() as HouseholdState)
          setLoading(false)
        }
      },
      (error) => {
        console.error("Firestore error:", error)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  async function write(next: HouseholdState) {
    await updateDoc(docRef, next as unknown as Record<string, unknown>)
  }

  function buildLog(meal: MealTime, type: "cooked" | "eatout" | "skipped", date: string): LogEntry[] {
    const filtered = data.log.filter(
      (e) => !(e.date === date && e.meal === meal)
    )
    return [...filtered, { id: Date.now(), type, meal, date, note: "" }]
  }

  function logCook(meal: MealTime, date: string = today()): void {
    const newLog = buildLog(meal, "cooked", date)
    const isOverwrite = newLog.length === data.log.length

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

    write({
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

    if (isOverwrite) {
      const recalc = recalculateFromLog(newLog, data.avgMealSavings, data.bestStreak)
      write({
        ...data,
        streak: recalc.streak,
        bestStreak: recalc.bestStreak,
        mealsCookedThisMonth: recalc.mealsCookedThisMonth,
        moneySavedThisMonth: recalc.moneySavedThisMonth,
        log: newLog,
      })
    } else {
      const bestStreak = Math.max(data.streak, data.bestStreak)
      write({ ...data, streak: 0, bestStreak, log: newLog })
    }
  }

  function logSkip(meal: MealTime, date: string = today()): void {
    const newLog = buildLog(meal, "skipped", date)
    const isOverwrite = newLog.length === data.log.length

    if (isOverwrite) {
      const recalc = recalculateFromLog(newLog, data.avgMealSavings, data.bestStreak)
      write({
        ...data,
        streak: recalc.streak,
        bestStreak: recalc.bestStreak,
        mealsCookedThisMonth: recalc.mealsCookedThisMonth,
        moneySavedThisMonth: recalc.moneySavedThisMonth,
        log: newLog,
      })
    } else {
      write({ ...data, log: newLog })
    }
  }

  function spinMeal(category: MealCategory): string {
    const list = data.meals[category]
    return list[Math.floor(Math.random() * list.length)]
  }

  function updateSettings(partial: Partial<HouseholdState>): void {
    write({ ...data, ...partial })
  }

  function updateMeals(category: MealCategory, meals: string[]): void {
    write({ ...data, meals: { ...data.meals, [category]: meals } })
  }

  function updateRewards(rewards: Reward[]): void {
    write({ ...data, rewards: unlockRewards(rewards, data.streak) })
  }

  function resetStreak(): void {
    write({
      ...data,
      streak: 0,
      mealsCookedThisMonth: 0,
      moneySavedThisMonth: 0,
      log: [],
      rewards: data.rewards.map((r) => ({ ...r, unlocked: false })),
    })
  }

  return {
    data,
    loading,
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
