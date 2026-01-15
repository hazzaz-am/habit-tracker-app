import { Client, Account } from "react-native-appwrite";

let client: Client;
export let account: Account;

client = new Client();
client
	.setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
	.setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
	.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME!);

account = new Account(client);
