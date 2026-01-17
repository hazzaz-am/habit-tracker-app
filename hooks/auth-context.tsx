import { account } from "@/lib/appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { ID, Models } from "react-native-appwrite";

type AuthContextType = {
	user: Models.User<Models.Preferences> | null;
	isUserLoading: boolean;
	signIn: (email: string, password: string) => Promise<string | null>;
	signUp: (email: string, password: string) => Promise<string | null>;
	signOut: () => Promise<string | undefined>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {

	const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
	const [isUserLoading, setIsUserLoading] = useState(true);

	useEffect(() => {
		getUser();
	}, []);

	const getUser = async () => {
		try {
			const session = await account.get();
			setUser(session);
		} catch (error) {
			setUser(null);
			if (error instanceof Error) {
				return error.message;
			}
			return "An unknown error occurred during get user.";
		} finally {
			setIsUserLoading(false);
		}
	};

	const signUp = async (email: string, password: string) => {
		try {
			await account.create({ userId: ID.unique(), email, password });
			await signIn(email, password);
			return null;
		} catch (error) {
			if (error instanceof Error) {
				return error.message;
			}
			return "An unknown error occurred during sign up.";
		}
	};

	const signIn = async (email: string, password: string) => {
		try {
			await account.createEmailPasswordSession({ email, password });
			const session = await account.get();
			setUser(session);
			return null;
		} catch (error) {
			if (error instanceof Error) {
				return error.message;
			}
			return "An unknown error occurred during sign in.";
		}
	};

	const signOut = async () => {
		try {
			await account.deleteSession({ sessionId: "current" });
			setUser(null);
		} catch (error) {
			if (error instanceof Error) {
				return error.message;
			}
			return "An unknown error occurred during sign out.";
		}
	};

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signUp,
				user,
				signOut,
				isUserLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
