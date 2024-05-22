import { Category } from "./types";
import Colors from "./colors";

export function mapCategories(categories: Category[], sumAmount = 0): Category[] {
	return categories
		.sort((a, b) => {
			if (a.amount < b.amount) return 1;
			if (a.amount > b.amount) return -1;
			return 0;
		})
		.map((category, index) => {
			return {
				id: category.id,
				icon: category.icon,
				color: Colors[index % Colors.length],
				name: category.name,
				amount: category.amount,
				precent: (category.amount / sumAmount) * 100,
				transactions: category.transactions,
			};
		});
}
