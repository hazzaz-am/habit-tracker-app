# Habit Tracker App

A mobile habit tracking application built with React Native and Expo. Track your daily habits, complete them with intuitive swipe gestures, and monitor your streak progress over time.

## What This App Does

- **Create habits** — Add habits with a title, description, and frequency (daily, weekly, or monthly)
- **Track today's habits** — View all your habits on the main screen and mark them complete with a swipe
- **Complete habits** — Swipe left on a habit card to mark it done for today
- **Delete habits** — Swipe right on a habit card to remove it
- **Streak analytics** — See current streak, best streak, and total completions for each habit
- **Top streaks ranking** — View your top 3 habits ranked by longest streak
- **Real-time sync** — Data updates in real time across devices via Appwrite subscriptions
- **User authentication** — Sign up, sign in, and sign out with email/password

---

## Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | React Native with Expo |
| **Language** | TypeScript |
| **Navigation** | Expo Router (file-based routing) |
| **Backend** | [Appwrite](https://appwrite.io/) (Auth + Database + Realtime) |
| **UI Components** | React Native Paper |
| **Gestures** | React Native Gesture Handler (swipeable cards) |
| **Animations** | React Native Reanimated |
| **Icons** | @expo/vector-icons (MaterialCommunityIcons) |

---

## Prerequisites

- **Node.js** (v18 or newer recommended)
- **npm** or **yarn**
- **Expo Go** app on your phone (for mobile testing) or **Android Studio** / **Xcode** (for emulators)
- **Appwrite account** — [Create one free at appwrite.io](https://cloud.appwrite.io/register)

---

## How to Run Locally

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd habit-tracker-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Appwrite backend

You need an Appwrite project with:

- **Auth** — Enable Email/Password authentication
- **Database** — Create a database with two tables:

  **Table: `habits`**

  | Attribute    | Type   | Size |
  |-------------|--------|------|
  | user_id     | string | 36   |
  | title       | string | 255  |
  | description | string | 1000 |
  | frequency   | string | 20   |
  | streak_count| integer| —    |
  | last_completed | string | — |

  **Table: `habit_completions`**

  | Attribute  | Type   | Size |
  |-----------|--------|------|
  | habit_id  | string | 36   |
  | user_id   | string | 36   |
  | completed_at | string | — |

- **Permissions** — Ensure your Appwrite project allows access for authenticated users as needed for these tables.

### 4. Configure environment variables

Create a `.env` file in the project root (you can copy from `.env.example`):

```env
EXPO_PUBLIC_APPWRITE_ENDPOINT="https://cloud.appwrite.io/v1"
EXPO_PUBLIC_APPWRITE_PROJECT_ID="your-project-id"
EXPO_PUBLIC_APPWRITE_PROJECT_NAME="habit-tracker-app"
EXPO_PUBLIC_DB_ID="your-database-id"
EXPO_PUBLIC_HABITS_TABLE_ID="your-habits-table-id"
EXPO_PUBLIC_HABITS_COMPLETION_TABLE_ID="your-completions-table-id"
```

Replace the placeholder values with your actual Appwrite project and table IDs.

### 5. Start the development server

```bash
npm start
```

This opens the Expo dev server. From there you can:

- Press **`a`** to open in Android emulator
- Press **`i`** to open in iOS simulator (macOS only)
- Press **`w`** to open in web browser
- Scan the QR code with **Expo Go** on your phone to run on a physical device

---

## Project Structure

```
habit-tracker-app/
├── app/
│   ├── _layout.tsx        # Root layout, auth guard
│   ├── auth.tsx           # Sign in / Sign up screen
│   └── (tabs)/
│       ├── _layout.tsx    # Tab navigation
│       ├── index.tsx      # Today's habits (main screen)
│       ├── add-habit.tsx  # Add new habit
│       └── streaks.tsx    # Streak analytics
├── hooks/
│   └── auth-context.tsx   # Authentication context
├── lib/
│   └── appwrite.ts        # Appwrite client setup
├── types/
│   └── habits.ts          # TypeScript interfaces
└── assets/
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS (macOS only) |
| `npm run web` | Run in web browser |
| `npm run lint` | Run ESLint |

---

## License

MIT
