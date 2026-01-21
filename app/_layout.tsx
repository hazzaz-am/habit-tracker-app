import AuthProvider, { useAuth } from "@/hooks/auth-context";
import {  Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from 'react-native-gesture-handler';


function RouteGuard({ children }: { children: React.ReactNode; }) {
	const router = useRouter();
	const { user, isUserLoading } = useAuth();
	const segments = useSegments();

	useEffect(() => {
		const isAuthGroup = segments[0] === "auth";

		if (!isAuthGroup && !user && !isUserLoading) {
			router.replace("/auth");
		} else if (user && isAuthGroup && !isUserLoading) {
			router.replace("/");
		}
	}, [user, segments, isUserLoading, router]);

	return <>{children}</>;
}

export default function RootLayout() {
	return (
		<GestureHandlerRootView>
		<AuthProvider>
			{/* <PaperProvider> */}
				<SafeAreaProvider>
					<RouteGuard>
						<Stack>
							<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						</Stack>
					</RouteGuard>
				</SafeAreaProvider>
			{/* </PaperProvider> */}
		</AuthProvider>
		</GestureHandlerRootView>
	);
}
