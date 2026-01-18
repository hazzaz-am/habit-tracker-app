import { Client, Account, TablesDB } from "react-native-appwrite";

let client: Client;
export let account: Account;
export let tablesDB: TablesDB;

client = new Client();
client
	.setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
	.setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
	.setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_NAME!);

account = new Account(client);
tablesDB = new TablesDB(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!
export const HABITS_TABLE_ID = process.env.EXPO_PUBLIC_HABITS_TABLE_ID!