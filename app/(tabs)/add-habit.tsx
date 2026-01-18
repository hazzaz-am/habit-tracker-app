import { useAuth } from '@/hooks/auth-context';
import { DATABASE_ID, HABITS_TABLE_ID, tablesDB } from '@/lib/appwrite';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ID } from "react-native-appwrite";
import { Button, SegmentedButtons, TextInput, useTheme } from 'react-native-paper';


const FREQUENCIES = ["daily", "weekly", "monthly"];

type TFrequency = (typeof FREQUENCIES)[number];

export default function AddHabitScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<TFrequency>("daily");
  const [error, setError] = useState("");
  const { user } = useAuth();
  const theme = useTheme();
  const router = useRouter();

  const handleHabitSubmit = async () => {
    if (!user) return;
    try {
      await tablesDB.createRow({ databaseId: DATABASE_ID, tableId: HABITS_TABLE_ID, rowId: ID.unique(), data: { title, description, frequency, user_id: user.$id, streak_count: 0, last_completed: new Date().toISOString() } });
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }
      setError("Something went wrong while adding the habit.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput label={"Title"} mode='outlined' onChangeText={setTitle} style={styles.input} />
      <TextInput label={"Description"} mode='outlined' onChangeText={setDescription} style={styles.input} />
      <View style={styles.frequencyContainer}>
        <SegmentedButtons value={frequency} onValueChange={setFrequency} buttons={FREQUENCIES.map(frq => ({
          value: frq,
          label: frq.charAt(0).toUpperCase() + frq.slice(1),
        }))} />
      </View>
      <Button mode='contained' onPress={handleHabitSubmit} disabled={!title || !description}>Add Habit</Button>
      {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  frequencyContainer: {
    marginBottom: 24,
  },

  input: {
    marginBottom: 16,
  }


});