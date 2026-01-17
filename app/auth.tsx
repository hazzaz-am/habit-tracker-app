import { useAuth } from "@/hooks/auth-context";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const { signIn, signUp } = useAuth();

	const theme = useTheme();

	const handleAuth = async () => {
		if (!email || !password) {
			setError("Please fill in all fields");
			return;
		}

		if (password.length < 6) {
			setError("Password must be at least 6 characters long");
			return;
		}
		setError(null);

		if (isSignUp) {
			const signUpError = await signUp(email, password);
			if (signUpError) {
				setError(signUpError);
			}
		} else {
			const signInError = await signIn(email, password);
			if (signInError) {
				setError(signInError);
			}
		}
	};

	const handleSwitchMode = () => {
		setIsSignUp((prev) => !prev);
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			style={styles.container}
		>
			<View style={styles.content}>
				<Text style={styles.title} variant="headlineMedium">
					{isSignUp ? "Create Account" : "Welcome Back"}
				</Text>
				<TextInput
					style={styles.input}
					label={"Email"}
					id="email"
					autoCapitalize="none"
					keyboardType="email-address"
					placeholder="example@gmail.com"
					mode="outlined"
					onChangeText={setEmail}
					value={email}
				/>
				<TextInput
					style={styles.input}
					label={"Password"}
					id="password"
					autoCapitalize="none"
					secureTextEntry
					placeholder="********"
					mode="outlined"
					onChangeText={setPassword}
					value={password}
				/>
				{error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
				<Button style={styles.button} mode="contained" onPress={handleAuth}>
					{isSignUp ? "Sign Up" : "Sign In"}
				</Button>
				<Button
					style={styles.switchModeButton}
					mode="text"
					onPress={handleSwitchMode}
				>
					{isSignUp
						? "Already have an account? Sign In"
						: "Don't have an account? Sign Up"}
				</Button>
			</View>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	content: {
		flex: 1,
		padding: 16,
		justifyContent: "center",
	},
	title: {
		textAlign: "center",
		marginBottom: 24,
	},
	input: {
		marginBottom: 16,
	},
	button: {
		marginTop: 8,
	},
	switchModeButton: {
		marginTop: 16,
	},
});
