import { useAuth } from "@/hooks/auth-context";
import { DATABASE_ID, HABITS_TABLE_ID, tablesDB } from "@/lib/appwrite";
import { IHabit } from "@/types/habits";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { ActivityIndicator, Button, Surface, Text, useTheme } from "react-native-paper";

export default function Index() {
	const { signOut, user } = useAuth();
	const [habits, setHabits] = useState<IHabit[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const theme = useTheme();

	const fetchHabits = useCallback(async () => {
		try {
			if (!user) return;
			setLoading(true);
			setError(null);
			const habitLists = await tablesDB.listRows<IHabit>({
				databaseId: DATABASE_ID,
				tableId: HABITS_TABLE_ID,
				queries: [
					Query.equal("user_id", user.$id),
				]
			});
			setHabits(habitLists.rows);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
				return;
			}
			setError("Something went wrong while fetching habits.");
		} finally {
			setLoading(false);
		}
	}, [user]);

	const handleSignOut = async () => {
		await signOut();
	};

	useEffect(() => {
		fetchHabits()
	}, [fetchHabits]);

	if (loading) {
		return (
			<View style={style.loadingContainer}>
				<ActivityIndicator size={"large"} animating={true} color={"#6200ee"} />
			</View>
		);
	}

	return (
		<View
			style={style.container}
		>
			<View style={style.header}>
				<Text style={style.headerTitle} variant="headlineSmall">Today&apos;s Habits</Text>
				<Button mode="text" onPress={handleSignOut} icon={"logout"}>Sign Out</Button>
			</View>
			{error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
			{
				habits.length > 0 ? (
					habits.map((habit) => (
						<Surface key={habit.$id} style={style.card} elevation={0}>

							<View style={style.cardContent}>
								<Text style={style.cardTitle}>{habit.title}</Text>
								<Text style={style.cardDescription}>{habit.description}</Text>
								<View style={style.cardFooter}>
									<View style={style.streakContainer}>
										<MaterialCommunityIcons size={20} name="fire" color={"coral"} />
										<Text style={style.streakCount}>{habit.streak_count} day streak</Text>
									</View>
									<View style={style.frequencyContainer}>
										<Text style={style.frequencyText}>{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</Text>
									</View>
								</View>
							</View>
						</Surface>
					))
				) : (
					<View style={style.emptyContainer}>
						<Text style={style.emptyText}>No habits found.</Text>
					</View>
				)
			}
		</View>
	);
}


// Style Sheet
const style = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: "#f5f5f5",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 24
	},
	headerTitle: {
		fontWeight: "bold",
	},
	card: {
		marginBottom: 18,
		borderRadius: 18,
		backgroundColor: "#f7f2fa",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.08,
		shadowRadius: 8,
		elevation: 4,
		width: "100%",
	},
	cardContent: {
		padding: 20,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 4,
		color: "#22223b"
	},
	cardDescription: {
		fontSize: 15,
		marginBottom: 16,
		color: "#6c6c80"
	},
	cardFooter: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	streakContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff3e0",
		borderRadius: 12,
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	streakCount: {
		marginLeft: 6,
		color: "#ff9800",
		fontWeight: "bold",
		fontSize: 14,
	},
	frequencyContainer: {
		backgroundColor: "#ede7f6",
		borderRadius: 12,
		paddingHorizontal: 12,
		paddingVertical: 4,
	},
	frequencyText: {
		color: "#7c4fff",
		fontWeight: "bold",
		fontSize: 14,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyText: {
		color: "#666666"
	}

});