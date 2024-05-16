export interface RawCategoryExpense {
	id: string;
	icon: string;
	name: string;
	amount: number;
	transactions: number;
}

export interface CategoryExpense extends RawCategoryExpense {
	color: string;
	precent: number;
}
