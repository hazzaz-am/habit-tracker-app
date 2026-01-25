import { useAuth } from "@/hooks/auth-context";
import { client, DATABASE_ID, HABITS_TABLE_ID, tablesDB } from "@/lib/appwrite";
import { IHabit } from "@/types/habits";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { Query, RealtimeResponseEvent } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { ActivityIndicator, Button, Surface, Text, useTheme } from "react-native-paper";

export default function Index() {
	const { signOut, user } = useAuth();
	const [habits, setHabits] = useState<IHabit[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const theme = useTheme();

	const swipeableRefs = useRef<{ [key: string]: Swipeable | null; }>({});

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

	const renderLeftActions = () => (
		<View style={style.swipeLeftAction}>
			<MaterialCommunityIcons name="trash-can-outline" size={32} color={"#fff"} />
		</View>
	);

	const renderRightActions = () => (
		<View style={style.swipeRightAction}>
			<MaterialCommunityIcons name="check-circle-outline" size={32} color={"#fff"} />
		</View>
	);

	const handleDeleteHabitById = async (id: string) => {
		try {
			await tablesDB.deleteRow({ databaseId: DATABASE_ID, tableId: HABITS_TABLE_ID, rowId: id });
		} catch (error) {
			if (error instanceof Error) {
				Alert.alert("Error", error.message);
				return;
			} else {
				Alert.alert("Error", "Something went wrong while deleting the habit.");
				return;
			}
		}
	};

	useEffect(() => {
		if (!user) return;

		const channel = `databases.${DATABASE_ID}.tables.${HABITS_TABLE_ID}.rows`;

		const unsubscribe = client.subscribe(channel, (response: RealtimeResponseEvent<IHabit>) => {
			const { events, payload } = response;

			if (!payload) return;

			// Filter events to only handle rows that belong to the current user
			if ('user_id' in payload && payload.user_id !== user.$id) {
				return;
			}

			// Check if any of the events match create, update, or delete
			// Events can be an array or a single string, so we normalize it
			const eventArray = Array.isArray(events) ? events : [events];

			// Check for create, update, or delete in any format
			const isCreate = eventArray.some(e =>
				String(e).includes('create') ||
				String(e).includes('rows.create') ||
				String(e) === 'create'
			);
			const isUpdate = eventArray.some(e =>
				String(e).includes('update') ||
				String(e).includes('rows.update') ||
				String(e) === 'update'
			);
			const isDelete = eventArray.some(e =>
				String(e).includes('delete') ||
				String(e).includes('rows.delete') ||
				String(e) === 'delete'
			);

			// Handle create event
			if (isCreate) {
				fetchHabits();
			}

			// Handle update event
			if (isUpdate) {
				fetchHabits();
			}

			// Handle delete event
			if (isDelete) {
				fetchHabits();
			}
		});

		fetchHabits();
		// Cleanup subscription on unmount
		return () => {
			unsubscribe();
		};
	}, [fetchHabits, user]);

	// if (loading) {
	// 	return (
	// 		<View style={style.loadingContainer}>
	// 			<ActivityIndicator size={"large"} animating={true} color={"#6200ee"} />
	// 		</View>
	// 	);
	// }

	return (
		<View
			style={style.container}
		>
			<View style={style.header}>
				<Text style={style.headerTitle} variant="headlineSmall">Today&apos;s Habits</Text>
				<Button mode="text" onPress={handleSignOut} icon={"logout"}>Sign Out</Button>
			</View>
			{error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
			<ScrollView showsVerticalScrollIndicator={false}>
				{
					habits.length > 0 ? (
						habits.map((habit) => (
							<Swipeable
								key={habit.$id}
								ref={(ref) => {
									swipeableRefs.current[habit.$id] = ref;
								}}
								overshootLeft={false}
								overshootRight={false}
								renderLeftActions={renderLeftActions}
								renderRightActions={renderRightActions}
								onSwipeableOpen={(direction) => {
									if (direction === "left") {
										handleDeleteHabitById(habit.$id);
									}
									swipeableRefs.current[habit.$id]?.close();
								}}
							>
								<Surface style={style.card} elevation={0}>

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
							</Swipeable>
						))
					) : (
						<View style={style.emptyContainer}>
							<Text style={style.emptyText}>No habits found.</Text>
						</View>
					)
				}
			</ScrollView>
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
	},
	swipeLeftAction: {
		justifyContent: "center",
		alignItems: "flex-start",
		flex: 1,
		backgroundColor: "#e53935",
		borderRadius: 18,
		marginBottom: 18,
		marginTop: 2,
		paddingLeft: 16
	},
	swipeRightAction: {
		justifyContent: "center",
		alignItems: "flex-end",
		backgroundColor: "#4caf50",
		flex: 1,
		borderRadius: 18,
		marginBottom: 18,
		marginTop: 2,
		paddingRight: 16
	}

});