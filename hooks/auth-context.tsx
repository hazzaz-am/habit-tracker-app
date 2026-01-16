import { account } from "@/lib/appwrite";
import { createContext, useContext } from "react";
import { ID, Models } from "react-native-appwrite";

type AuthContextType = {
	// user: Models.User<Models.Preferences> | null;
	signIn: (email: string, password: string) => Promise<string | null>;
	signUp: (email: string, password: string) => Promise<string | null>;
	// signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const signUp = async (email: string, password: string) => {
		try {
			await account.createEmailPasswordSession({ email, password });
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
			return null;
		} catch (error) {
			if (error instanceof Error) {
				return error.message;
			}
			return "An unknown error occurred during sign in.";
		}
	};

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signUp,
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
