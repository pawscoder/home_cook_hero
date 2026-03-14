# Home Cook Hero

A shared household habit tracker for cooking at home. Helps members of a household break the habit of eating out, track streaks, celebrate wins, and stay motivated with rewards.

## Tech Stack

- **React + TypeScript** via Vite
- **React Router** — 4 screens
- **canvas-confetti** — celebration animations
- **localStorage** — data layer (Firebase swap planned for later)

## Getting Started

```bash
npm install
npm run dev
```

## Screens

| Route | Screen | Description |
|---|---|---|
| `/` | Dashboard | Streak, stats, rewards progress, log a meal |
| `/meals` | Meal Randomizer | Spin for a random meal idea by category |
| `/rewards` | Rewards | View and manage milestone rewards |
| `/settings` | Settings | Names, savings rate, meal lists, danger zone |

## Project Structure

```
src/
  types.ts                  # all shared TypeScript interfaces and types
  hooks/
    useHousehold.ts         # the only file that touches localStorage
  components/
    StreakCard.tsx
    StatsRow.tsx
    RewardsProgress.tsx
    ActionButtons.tsx
    ActivityLog.tsx
    MealTabs.tsx
    MealResult.tsx
    RewardItem.tsx
    AddRewardForm.tsx
    NavBar.tsx
  screens/
    Dashboard.tsx
    MealRandomizer.tsx
    Rewards.tsx
    Settings.tsx
  utils/
    animations.ts           # confetti + guilt helpers
    dateHelpers.ts          # date formatting utilities
  App.tsx
  main.tsx
```

## Data Layer

All state is managed through a single custom hook — `useHousehold.ts`. Components never access localStorage directly. This makes the planned Firebase migration a one-file change.

```
Components → useHousehold.ts → localStorage (now) → Firebase (later)
```

The hook exposes:

```ts
const {
  data,             // HouseholdState — full app state
  logCook,          // (meal: MealTime) => void
  logEatOut,        // (meal: MealTime) => void
  logSkip,          // (meal: MealTime) => void
  spinMeal,         // (category: MealCategory) => string
  updateSettings,   // (partial: Partial<HouseholdState>) => void
  updateMeals,      // (category: MealCategory, meals: string[]) => void
  updateRewards,    // (rewards: Reward[]) => void
  resetStreak,      // () => void
} = useHousehold()
```

## Rewards

Three built-in milestone rewards, unlocked automatically when streak targets are hit:

| Reward | Streak Target |
|---|---|
| Nice dinner out 🍷 | 7 days |
| Spa day 💆 | 14 days |
| Weekend trip ✈️ | 30 days |

## Build Plan

| Session | Goal |
|---|---|
| 1 | Project setup + types + `useHousehold` hook |
| 2 | Dashboard skeleton + ActionButtons |
| 3 | RewardsProgress + reward unlocking |
| 4 | Meal Randomizer screen |
| 5 | Settings screen |
| 6 | Animations + polish |
| 7 | Firebase swap |
