import { GetTransactionsData, Transaction } from "pages/tracker/transactions/utilities/types";
import { Category } from "pages/tracker/utilities/types";
import { StatusCodes } from "utilities/status-code";
import axios, { AxiosResponse } from "axios";
import camelcaseKeys from "camelcase-keys";

interface RawTransaction extends Omit<Transaction, "createdAt"> {
	createdAt: string;
}

const USER_PATH = "/user";
const AUTH_PATH = `${USER_PATH}/auth`;
const TRAKCER_PATH = `${AUTH_PATH}/tracker`;
const CATEGORY_PATH = `${TRAKCER_PATH}/category`;
const CATEGORIES_PATH = `${TRAKCER_PATH}/categories`;

const API = axios.create({
	withCredentials: true,
	baseURL:
		!process.env.NODE_ENV || process.env.NODE_ENV === "development"
			? "http://127.0.0.1:8000/api"
			: "https://expenses-tracker.shuttleapp.rs/api",
});

// Reusable Reponse Handler functions

async function DateResponseHandler<T>(response: AxiosResponse<T, any>): Promise<T> {
	if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
		throw new Error("The server encountered an error. Please try again later.");
	}

	if (typeof response.data === "object") {
		return camelcaseKeys(response.data as Record<string, any>, { deep: true }) as T;
	}

	return response.data as T;
}

// User endpoints

export async function Login(username: string, password: string) {
	return API.post(`${USER_PATH}/login`, { username, password });
}

export async function SignUp(username: string, password: string) {
	return API.post(`${USER_PATH}/sign-up`, { username, password });
}

export async function Logout() {
	return API.delete(`${USER_PATH}/logout`);
}

// Auth endpoints

export async function Auth() {
	return API.get(`${AUTH_PATH}`);
}

// Tracker endpoints

// Categories endpoints

export async function GetCategories(): Promise<Category[]> {
	return API.get(CATEGORIES_PATH).then(DateResponseHandler<Category[]>);
}

export async function AddCategory(name: string, icon: string): Promise<Category> {
	return API.post(CATEGORIES_PATH, { name, icon })
		.then(DateResponseHandler<{ id: string }>)
		.then(({ id }) => ({ id, name, icon, amount: 0, transactions: 0 }) as Category);
}

export async function EditCategory(id: string, name: string, icon: string) {
	return API.patch(`${CATEGORIES_PATH}/${id}`, { name, icon });
}

export async function DeleteCategory(id: string) {
	return API.delete(`${CATEGORIES_PATH}/${id}`);
}

// Transactions endpoints

export async function GetTransactions(categoryId: string): Promise<GetTransactionsData> {
	return API.get(`${CATEGORY_PATH}/${categoryId}/transactions`)
		.then(DateResponseHandler<{ category: Category; transactions: RawTransaction[] }>)
		.then(
			({ category, transactions }) =>
				({
					category,
					transactions: transactions.map(({ createdAt, ...transaction }) => ({
						...transaction,
						createdAt: new Date(createdAt),
					})),
				}) as GetTransactionsData,
		);
}

export async function AddTransaction(categoryId: string, description: string, amount: number) {
	return API.post(`${CATEGORY_PATH}/${categoryId}/transactions`, { amount, description });
}

export async function DeleteTransaction(categoryId: string, transactionId: string) {
	return API.delete(`${CATEGORY_PATH}/${categoryId}/transactions/${transactionId}`);
}
