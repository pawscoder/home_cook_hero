import { useState } from "react"
import type {
  HouseholdState,
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
    { id: "r1", label: "Nice dinner out 🍷", streakTarget: 7, unlocked: false },
    { id: "r2", label: "Spa day 💆", streakTarget: 14, unlocked: false },
    { id: "r3", label: "Weekend trip ✈️", streakTarget: 30, unlocked: false },
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

export function useHousehold() {
  const [data, setData] = useState<HouseholdState>(load)

  function update(next: HouseholdState) {
    save(next)
    setData(next)
  }

  function logCook(meal: MealTime): void {
    const newStreak = data.streak + 1
    const newBest = Math.max(newStreak, data.bestStreak)
    const next: HouseholdState = {
      ...data,
      streak: newStreak,
      bestStreak: newBest,
      mealsCookedThisMonth: data.mealsCookedThisMonth + 1,
      moneySavedThisMonth: data.moneySavedThisMonth + data.avgMealSavings,
      log: [
        ...data.log,
        { id: Date.now(), type: "cooked", meal, date: today(), note: "" },
      ],
      rewards: unlockRewards(data.rewards, newStreak),
    }
    update(next)
  }

  function logEatOut(meal: MealTime): void {
    const newBest = Math.max(data.streak, data.bestStreak)
    const next: HouseholdState = {
      ...data,
      streak: 0,
      bestStreak: newBest,
      log: [
        ...data.log,
        { id: Date.now(), type: "eatout", meal, date: today(), note: "" },
      ],
    }
    update(next)
  }

  function logSkip(meal: MealTime): void {
    const newStreak = data.streak + 1
    const newBest = Math.max(newStreak, data.bestStreak)
    const next: HouseholdState = {
      ...data,
      streak: newStreak,
      bestStreak: newBest,
      log: [
        ...data.log,
        { id: Date.now(), type: "skipped", meal, date: today(), note: "" },
      ],
      rewards: unlockRewards(data.rewards, newStreak),
    }
    update(next)
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
