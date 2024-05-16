import { CategoryExpense, RawCategoryExpense } from "pages/tracker/utilities/types";
import { ItemExpense } from "pages/tracker/item-expenses/utilities/types";

import data from "pages/tracker/utilities/sample-data";

export async function SignUp(username: string, password: string) {
	return true;
}

export async function Login(username: string, password: string) {
	return true;
}

export async function AddCategory(name: string, icon: string): Promise<CategoryExpense> {
	return {
		id: Math.floor(Math.random() * 1_000_000).toString(),
		name,
		icon,
		transactions: 0,
		amount: 0,
		precent: 0,
		color: "#000000",
	};
}

export async function AddItem(categoryId: string, description: string, amount: number) {
	return true;
}

export async function EditCategory(id: string, name: string, icon: string) {
	return true;
}

export async function DeleteCategory(id: string) {
	return true;
}

export async function DeleteItem(id: string) {
	return true;
}

export async function GetCategory(): Promise<RawCategoryExpense[]> {
	return data;
}

export async function GetCategoryById(id: string): Promise<RawCategoryExpense | undefined> {
	return data.find((category) => category.id === id);
}

export async function GetItemExpenses(categoryId: string): Promise<ItemExpense[]> {
	return [
		{
			id: "1",
			amount: 10,
			description: "Sample Itemaaa",
			createdAt: new Date(),
		},
		{
			id: "2",
			amount: 100,
			description: "Sample Item",
			createdAt: new Date(),
		},
		{
			id: "3",
			amount: 1000,
			description: "Sample Item",
			createdAt: new Date(),
		},
		{
			id: "4",
			amount: 1000,
			description: "Sample Item",
			createdAt: new Date(),
		},
		{
			id: "5",
			amount: 1000,
			description: "Sample Item",
			createdAt: new Date(),
		},
		{
			id: "6",
			amount: 1000,
			description: "Sample Item",
			createdAt: new Date(),
		},
	];
}
