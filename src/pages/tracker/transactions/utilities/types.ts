import { Category } from "pages/tracker/utilities/types";

export interface Transactions {
	id: string;
	amount: number;
	description: string;
	createdAt: Date;
}

export interface GetTransactionsData {
	category: Category;
	transactions: Transactions[];
}
