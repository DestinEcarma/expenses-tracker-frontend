import { Category } from "pages/tracker/utilities/types";
import { GetTransactionsData } from "pages/tracker/transactions/utilities/types";

import camelcaseKeys from "camelcase-keys";
import { StatusCode as StatusCodes } from "./status-code";

export type StatusCode = number;

const API_URL =
	!process.env.NODE_ENV || process.env.NODE_ENV === "development"
		? "http://127.0.0.1:8000/api"
		: "https://expenses-tracker.shuttleapp.rs/api";
const USER_URL = `${API_URL}/user`;
const AUTH_URL = `${USER_URL}/auth`;
const TRAKCER_URL = `${AUTH_URL}/tracker`;
const CATEGORY_URL = `${TRAKCER_URL}/category`;
const CATEGORIES_URL = `${TRAKCER_URL}/categories`;

const CAMELCASEKEYS_OPTIONS = { deep: true };

const MAIN_REQUEST: RequestInit = {
	headers: {
		"Content-Type": "application/json",
	},
	credentials: "include",
};

const POST_METHOD: RequestInit = {
	...MAIN_REQUEST,
	method: "POST",
};

const GET_METHOD: RequestInit = {
	...MAIN_REQUEST,
	method: "GET",
};

const DELETE_METHOD: RequestInit = {
	...MAIN_REQUEST,
	method: "DELETE",
};

const PATCH_METHOD: RequestInit = {
	...MAIN_REQUEST,
	method: "PATCH",
};

const ERROR_MESSAGE = "The server encountered an error. Please try again later.";

export async function Auth(): Promise<StatusCode> {
	return fetch(`${AUTH_URL}`, GET_METHOD).then((response) => {
		if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
			throw new Error(ERROR_MESSAGE);
		}

		return response.status;
	});
}

export async function SignUp(username: string, password: string): Promise<StatusCode> {
	return fetch(`${USER_URL}/sign-up`, {
		...POST_METHOD,
		body: JSON.stringify({ username, password }),
	}).then((response) => {
		if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
			throw new Error(ERROR_MESSAGE);
		}

		return response.status;
	});
}

export async function Login(username: string, password: string): Promise<StatusCode> {
	return fetch(`${USER_URL}/login`, {
		...POST_METHOD,
		body: JSON.stringify({ username, password }),
	}).then((response) => {
		if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
			throw new Error(ERROR_MESSAGE);
		}

		return response.status;
	});
}

export async function Logout(): Promise<StatusCode> {
	return fetch(`${USER_URL}/logout`, DELETE_METHOD).then((response) => {
		if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
			throw new Error(ERROR_MESSAGE);
		}

		return response.status;
	});
}

export async function GetCategories(): Promise<[Category[], StatusCode]> {
	return fetch(`${CATEGORIES_URL}`, GET_METHOD).then(async (response) => {
		if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
			throw new Error(ERROR_MESSAGE);
		}

		return [camelcaseKeys(await response.json(), CAMELCASEKEYS_OPTIONS) as Category[], response.status];
	});
}

export async function GetTransactions(categoryId: string): Promise<[GetTransactionsData, StatusCode]> {
	return fetch(`${CATEGORY_URL}/${categoryId}/transactions`, GET_METHOD).then(async (response) => {
		if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
			throw new Error(ERROR_MESSAGE);
		}

		const data = camelcaseKeys(await response.json(), CAMELCASEKEYS_OPTIONS) as GetTransactionsData;

		data.transactions = data.transactions.map((transaction) => ({
			...transaction,
			createdAt: new Date(transaction.createdAt),
		}));

		return [data, response.status];
	});
}

export async function AddCategory(name: string, icon: string): Promise<[Category, StatusCode]> {
	return fetch(`${CATEGORIES_URL}`, {
		...POST_METHOD,
		body: JSON.stringify({ name, icon }),
	}).then(async (response) => {
		if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
			throw new Error(ERROR_MESSAGE);
		}

		return [
			{
				...(await response.json()),
				name,
				icon,
				transactions: 0,
				amount: 0,
				precent: 0,
				color: "#000000",
			},
			response.status,
		];
	});
}

export async function AddTransaction(categoryId: string, description: string, amount: number): Promise<StatusCode> {
	return fetch(`${CATEGORY_URL}/${categoryId}/transactions`, {
		...POST_METHOD,
		body: JSON.stringify({ amount, description }),
	}).then(async (response) => {
		if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
			throw new Error(ERROR_MESSAGE);
		}

		return response.status;
	});
}

export async function EditCategory(id: string, name: string, icon: string): Promise<StatusCode> {
	return fetch(`${CATEGORIES_URL}/${id}`, {
		...PATCH_METHOD,
		body: JSON.stringify({ name, icon }),
	}).then((response) => {
		if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
			throw new Error(ERROR_MESSAGE);
		}

		return response.status;
	});
}

export async function DeleteCategory(id: string): Promise<StatusCode> {
	return fetch(`${CATEGORIES_URL}/${id}`, DELETE_METHOD).then((response) => {
		if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
			throw new Error(ERROR_MESSAGE);
		}

		return response.status;
	});
}

export async function DeleteTransaction(categoryId: string, transactionId: string): Promise<StatusCode> {
	return fetch(`${CATEGORY_URL}/${categoryId}/transactions/${transactionId}`, DELETE_METHOD).then((response) => {
		if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
			throw new Error(ERROR_MESSAGE);
		}

		return response.status;
	});
}
