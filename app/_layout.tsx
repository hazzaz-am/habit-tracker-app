import AuthProvider from "@/hooks/auth-context";
import { Redirect, Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RouteGuard({ children }: { children: React.ReactNode }) {
	// Add your authentication logic here
	const isAuthenticated = false; // Replace with real auth check

	if (!isAuthenticated) {
		return <Redirect href="/auth" />;
	}

	return <>{children}</>;
}

export default function RootLayout() {
	return (
		<AuthProvider>
			<PaperProvider>
				<SafeAreaProvider>
					<RouteGuard>
						<Stack>
							<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						</Stack>
					</RouteGuard>
				</SafeAreaProvider>
			</PaperProvider>
		</AuthProvider>
	);
}
