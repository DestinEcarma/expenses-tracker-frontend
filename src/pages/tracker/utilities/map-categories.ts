import { Category } from "./types";
import Colors from "./colors";

export function mapCategories(categories: Category[], sumAmount = 0): Category[] {
	return categories
		.sort((a, b) => {
			if (a.amount < b.amount) return 1;
			if (a.amount > b.amount) return -1;
			return 0;
		})
		.map((expense, index) => {
			return {
				id: expense.id,
				icon: expense.icon,
				color: Colors[index % Colors.length],
				name: expense.name,
				amount: expense.amount,
				precent: (expense.amount / sumAmount) * 100,
				transactions: expense.transactions,
			};
		});
}
