import { useAuth } from "@/hooks/auth-context";
import {
	DATABASE_ID,
	HABITS_COMPLETIONS_TABLE_ID,
	HABITS_TABLE_ID,
	tablesDB,
} from "@/lib/appwrite";
import { IHabit, IHabitCompletion } from "@/types/habits";
import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Query } from "react-native-appwrite";

interface IStreakData {
	currentStreak: number;
	longestStreak: number;
	total: number;
}

export default function StreaksScreen() {
	const { user } = useAuth();
	const [habits, setHabits] = useState<IHabit[]>([]);
	const [completions, setCompletions] = useState<IHabitCompletion[]>([]);
	const [error, setError] = useState<string | null>(null);

	const fetchHabits = useCallback(async () => {
		try {
			if (!user) return;
			setError(null);
			const habitLists = await tablesDB.listRows<IHabit>({
				databaseId: DATABASE_ID,
				tableId: HABITS_TABLE_ID,
				queries: [Query.equal("user_id", user.$id)],
			});
			setHabits(habitLists.rows);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
				return;
			}
			setError("Something went wrong while fetching habits.");
		}
	}, [user]);

	const fetchCompletions = useCallback(async () => {
		try {
			const response = await tablesDB.listRows<IHabitCompletion>({
				databaseId: DATABASE_ID,
				tableId: HABITS_COMPLETIONS_TABLE_ID,
				queries: [Query.equal("user_id", user?.$id ?? "")],
			});
			setCompletions(response.rows);
		} catch (error) {
			console.error(error);
		}
	}, [user]);

	useEffect(() => {
		if (!user) return;

		fetchHabits();
		fetchCompletions();
	}, [fetchHabits, fetchCompletions, user]);

	const getStreakData = (habitId: string): IStreakData => {
		const habitCompletions = completions
			.filter((c) => c.habit_id === habitId)
			.sort(
				(a, b) =>
					new Date(a.completed_at).getTime() -
					new Date(b.completed_at).getTime(),
			);

		if (habitCompletions?.length === 0) {
			return {
				currentStreak: 0,
				longestStreak: 0,
				total: 0,
			};
		}

    let currentStreak = 0;
    let longestStreak = 0;
    let total = habitCompletions.length;

    let lastDate: Date | null = null;
    let streak = 0;

    habitCompletions.forEach(h => {
      const date = new Date(h.completed_at)
      if (lastDate) {
        const diff = (date.getTime() - lastDate.getTime()) /  (1000 * 60 * 60 * 24)

        if (diff <= 1.5) {
          streak += 1;
        } else {
          streak = 1;
        }
      } else {
        if (streak > longestStreak) {
          longestStreak = streak
        } 
        currentStreak = streak
        lastDate = date
      }
    })

    return {
      currentStreak,
      longestStreak,
      total
    }
	};

  const habitStreaks = habits.map(h => {
    const {currentStreak, longestStreak, total} = getStreakData(h.$id)
    return {
      habit: h,
      bestStreak: longestStreak,
      streak: currentStreak,
      total
    }
  })

  const rankedHabits = habitStreaks.sort((a, b) => a.bestStreak -  b.bestStreak)
  console.log(rankedHabits.map(r => r.habit.title))

	return (
		<View>
			<Text>Streaks Screen</Text>
		</View>
	);
}
