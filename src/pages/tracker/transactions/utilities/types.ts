import { Category } from "pages/tracker/utilities/types";

export interface Transaction {
	id: string;
	amount: number;
	description: string;
	createdAt: Date;
}

export interface GetTransactionsData {
	category: Category;
	transactions: Transaction[];
}
