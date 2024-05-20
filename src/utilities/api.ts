import {
	CategoryExpense,
	RawCategoryExpense,
} from "pages/tracker/utilities/types";
import { Transactions } from "pages/tracker/transactions/utilities/types";

import data from "pages/tracker/utilities/sample-data";
import camelcaseKeys from "camelcase-keys";
import { STATUS_CODES } from "http";

export type StatusCode = number;

// const API_URL = "https://expenses-tracker.shuttleapp.rs/api";
const API_URL = "https://expenses-tracker.shuttleapp.rs/api";
const USER_URL = `${API_URL}/user`;
const AUTH_URL = `${USER_URL}/auth`;
const TRAKCER_URL = `${AUTH_URL}/tracker`;
const CATEGORY_URL = `${TRAKCER_URL}/category`;
const CATEGORIES_URL = `${TRAKCER_URL}/categories`;

const HEADERS = {
	headers: {
		"Content-Type": "application/json",
	},
};

const POST_METHOD = {
	method: "POST",
	...HEADERS,
};

const GET_METHOD = {
	method: "GET",
	...HEADERS,
};

const DELETE_METHOD = {
	method: "DELETE",
	...HEADERS,
};

const PATCH_METHOD = {
	method: "PATCH",
	...HEADERS,
};

export async function Auth(): Promise<StatusCode> {
	return fetch(`${AUTH_URL}`, { ...GET_METHOD, credentials: "include" }).then(
		(response) => response.status
	);
}

export async function SignUp(
	username: string,
	password: string
): Promise<StatusCode> {
	return fetch(`${USER_URL}/sign-up`, {
		...POST_METHOD,
		credentials: "include",
		body: JSON.stringify({ username, password }),
	}).then((response) => response.status);
}

export async function Login(
	username: string,
	password: string
): Promise<StatusCode> {
	return fetch(`${USER_URL}/login`, {
		...POST_METHOD,
		credentials: "include",
		body: JSON.stringify({ username, password }),
	}).then((response) => response.status);
}

export async function Logout(): Promise<StatusCode> {
	return fetch(`${USER_URL}/logout`, {
		...DELETE_METHOD,
		credentials: "include",
	}).then((response) => response.status);
}

export async function AddCategory(
	name: string,
	icon: string
): Promise<[CategoryExpense, StatusCode]> {
	return fetch(`${CATEGORIES_URL}`, {
		...POST_METHOD,
		credentials: "include",
		body: JSON.stringify({ name, icon }),
	}).then(async (response) => {
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

export async function AddTransaction(
	categoryId: string,
	description: string,
	amount: number
): Promise<[String, StatusCode]> {
	return fetch(`${CATEGORY_URL}/${categoryId}/transactions`, {
		...POST_METHOD,
		credentials: "include",
		body: JSON.stringify({ amount, description }),
	}).then(async (response) => [(await response.json()).id, response.status]);
}

export async function EditCategory(
	id: string,
	name: string,
	icon: string
): Promise<StatusCode> {
	return fetch(`${CATEGORY_URL}/${id}`, {
		...PATCH_METHOD,
		credentials: "include",
		body: JSON.stringify({ name, icon }),
	}).then((response) => response.status);
}

export async function DeleteCategory(id: string): Promise<StatusCode> {
	return fetch(`${CATEGORIES_URL}/${id}`, {
		...DELETE_METHOD,
		credentials: "include",
	}).then((response) => response.status);
}

export async function DeleteTransaction(
	categoryId: string,
	transactionId: string
): Promise<StatusCode> {
	return fetch(`${CATEGORY_URL}/${categoryId}/transactions/${transactionId}`, {
		...DELETE_METHOD,
		credentials: "include",
	}).then((response) => response.status);
}

export async function GetCategories(): Promise<
	[RawCategoryExpense[], StatusCode]
> {
	return fetch(`${CATEGORIES_URL}`, {
		...GET_METHOD,
		credentials: "include",
	}).then(async (response) => [
		camelcaseKeys(await response.json(), {
			deep: true,
		}) as RawCategoryExpense[],
		response.status,
	]);
}

export async function GetCategoryFromId(
	id: string
): Promise<[RawCategoryExpense, StatusCode]> {
	return fetch(`${CATEGORIES_URL}/${id}`, {
		...GET_METHOD,
		credentials: "include",
	}).then(async (response) => [
		camelcaseKeys(await response.json(), {
			deep: true,
		}) as RawCategoryExpense,
		response.status,
	]);
}

export async function GetTransactions(
	categoryId: string
): Promise<[Transactions[], StatusCode]> {
	return fetch(`${CATEGORY_URL}/${categoryId}/transactions`, {
		...GET_METHOD,
		credentials: "include",
	}).then(async (response) => [
		(
			camelcaseKeys(await response.json(), {
				deep: true,
			}) as Transactions[]
		).map((transaction) => ({
			...transaction,
			createdAt: new Date(transaction.createdAt),
		})),
		response.status,
	]);
}
