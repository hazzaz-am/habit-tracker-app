import { Models } from "react-native-appwrite";

export interface IHabit extends Models.Row {
  user_id: string;
  title: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly";
  streak_count: number;
  last_completed: string;
}

export interface IHabitCompletion extends Models.Row {
  habit_id: string;
  user_id: string;
  completed_at: string;
}