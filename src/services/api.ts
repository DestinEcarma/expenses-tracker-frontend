import { GetTransactionsData, Transaction } from "pages/tracker/transactions/utilities/types";
import { Category } from "pages/tracker/utilities/types";
import { StatusCode, StatusCodes } from "utilities/status-code";
import axios, { AxiosResponse } from "axios";

interface RawTransaction extends Omit<Transaction, "createdAt"> {
	createdAt: string;
}

const USER_PATH = `$/user`;
const AUTH_PATH = `${USER_PATH}/auth`;
const TRAKCER_PATH = `${AUTH_PATH}/tracker`;
const CATEGORY_PATH = `${TRAKCER_PATH}/category`;
const CATEGORIES_PATH = `${TRAKCER_PATH}/categories`;

const API = axios.create({
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
	baseURL:
		!process.env.NODE_ENV || process.env.NODE_ENV === "development"
			? "http://127.0.0.1:8000/api"
			: "https://expenses-tracker.shuttleapp.rs/api",
});

// Reusable Reponse Handler functions

async function SimpleResponseHanlder(response: AxiosResponse<any, any>): Promise<StatusCode> {
	if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
		throw new Error("The server encountered an error. Please try again later.");
	}

	return response.status;
}

async function DateResponseHandler<T>(response: AxiosResponse<T, any>): Promise<[T, StatusCode]> {
	if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
		throw new Error("The server encountered an error. Please try again later.");
	}

	return [response.data as T, response.status];
}

// User endpoints

export async function Login(username: string, password: string): Promise<StatusCode> {
	return API.post(`${USER_PATH}/login`, { username, password }).then(SimpleResponseHanlder);
}

export async function SignUp(username: string, password: string): Promise<StatusCode> {
	return API.post(`${USER_PATH}/sign-up`, { username, password }).then(SimpleResponseHanlder);
}

export async function Logout(): Promise<StatusCode> {
	return API.delete(`${USER_PATH}/logout`).then(SimpleResponseHanlder);
}

// Auth endpoints

export async function Auth(): Promise<StatusCode> {
	return API.get(`${AUTH_PATH}`).then(SimpleResponseHanlder);
}

// Tracker endpoints

// Categories endpoints

export async function GetCategories(): Promise<[Category[], StatusCode]> {
	return API.get(CATEGORIES_PATH).then(DateResponseHandler<Category[]>);
}

export async function AddCategory(name: string, icon: string): Promise<[Category, StatusCode]> {
	return API.post(CATEGORY_PATH, { name, icon })
		.then(DateResponseHandler<{ id: string }>)
		.then(([{ id }, status]) => [{ id, name, icon, amount: 0, transactions: 0 }, status] as [Category, StatusCode]);
}

export async function EditCategory(id: string, name: string, icon: string): Promise<StatusCode> {
	return API.patch(`${CATEGORY_PATH}/${id}`, { name, icon }).then(SimpleResponseHanlder);
}

export async function DeleteCategory(id: string): Promise<StatusCode> {
	return API.delete(`${CATEGORY_PATH}/${id}`).then(SimpleResponseHanlder);
}

// Transactions endpoints

export async function GetTransactions(categoryId: string): Promise<[GetTransactionsData, StatusCode]> {
	return API.get(`${CATEGORY_PATH}/${categoryId}/transactions`)
		.then(DateResponseHandler<{ category: Category; transactions: RawTransaction[] }>)
		.then(
			([{ category, transactions }, status]) =>
				[
					{
						category,
						transactions: transactions.map(({ createdAt, ...transaction }) => ({
							...transaction,
							createdAt: new Date(createdAt),
						})),
					},
					status,
				] as [GetTransactionsData, StatusCode],
		);
}

export async function AddTransaction(categoryId: string, description: string, amount: number): Promise<StatusCode> {
	return API.post(`${CATEGORY_PATH}/${categoryId}/transactions`, { amount, description }).then(SimpleResponseHanlder);
}

export async function DeleteTransaction(categoryId: string, transactionId: string): Promise<StatusCode> {
	return API.delete(`${CATEGORY_PATH}/${categoryId}/transactions/${transactionId}`).then(SimpleResponseHanlder);
}
