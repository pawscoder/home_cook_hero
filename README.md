# Home Cook Hero

> **Vibe code experiment** — built session by session with Claude Code, with some disagreements and corrections, in the end, only a small amount of manual coding was needed.

A shared household habit tracker for cooking at home. Helps members of a household break the habit of eating out, track streaks, celebrate wins, and stay motivated with rewards.

## Tech Stack

- **React + TypeScript** via Vite
- **React Router** — 4 screens + auth screens
- **canvas-confetti** — celebration animations
- **Firebase** — Firestore (data layer) + Firebase Auth (authentication)

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
| `/login` | Login | Sign in with email/password |
| `/signup` | Sign Up | Create a new account |

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
    SpinButton.tsx
    RewardItem.tsx
    AddRewardForm.tsx
    NavBar.tsx
  screens/
    Dashboard.tsx
    MealRandomizer.tsx
    Rewards.tsx
    Settings.tsx
    Login.tsx
    SignUp.tsx
  utils/
    animations.ts           # confetti + guilt helpers
    dateHelpers.ts          # date formatting utilities
    authErrors.ts           # Firebase auth error messages
  firebase.ts               # Firestore + Auth initialization
  App.tsx
  main.tsx
```

## Data Layer

All state is managed through a single custom hook — `useHousehold.ts`. Components never access the data layer directly.

```
Components → useHousehold.ts → Firebase Firestore
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

| Session | Goal | Status |
|---|---|---|
| 1 | Project setup + types + `useHousehold` hook | Done |
| 2 | Dashboard skeleton + ActionButtons | Done |
| 3 | RewardsProgress + reward unlocking | Done |
| 4 | Meal Randomizer screen | Done |
| 5 | Settings screen | Done |
| 6 | Firebase data layer migration | Done |
| 7 | Authentication (Login + Sign Up) | Done |
| 8 | Animations + polish | Planned |
