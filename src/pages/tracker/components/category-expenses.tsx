import { RawCategoryExpensesContext } from "pages/tracker/utilities/raw-category-expenses-context";
import { CategoryExpense as CategoryExpensesType } from "../utilities/types";
import { pad02f } from "utilities/stringUtil";
import { GetIcon } from "../utilities/icons";
import { useContext } from "react";

import CircularProgressBar from "pages/tracker/components/circular-progress-bar";
import AddTransactionButton from "./add-transaction-button";
import Colors from "pages/tracker/utilities/colors";
import EditCategoryButton from "./edit-category-button";

interface CategoryExpenseComponentProps extends CategoryExpensesType {
	showLine: boolean;
}

interface CategoryExpensesProps {
	sumAmount: number;
}

function CategoryExpenseComponent({
	id,
	icon,
	color,
	name,
	precent,
	amount,
	transactions,
	showLine,
}: CategoryExpenseComponentProps) {
	const Icon = GetIcon(icon);

	return (
		<div className="flex gap-4 px-4 last:mb-4">
			<div className="relative h-20 aspect-square text-gray-300">
				<a
					href={`./tracker/category?id=${id}`}
					className="w-full aspect-square outline-none hover:text-gray-500 transition-colors"
				>
					<CircularProgressBar percent={precent} borderColor={color}>
						<Icon className="text-4xl text-shadow drop-shadow-md" />
					</CircularProgressBar>
				</a>
			</div>
			<div className="relative flex justify-between items-center gap-4 w-full font-bold min-w-0">
				<div className="flex flex-col justify-between w-max overflow-auto">
					<span className="capitalize text-black overflow-auto">{name}</span>
					<span className="text-gray-500 text-sm tracking-tight overflow-auto">
						{transactions} {transactions > 1 ? "transactions" : "transaction"}
					</span>
				</div>
				<div className="flex flex-col items-end justify-between w-max">
					<span className="text-red-500 w-max">&#8369;{pad02f(amount)}</span>
					<div className="flex gap-2 mr-[1px] text-white">
						<AddTransactionButton name={name} id={id} />
						<EditCategoryButton id={id} name={name} icon={icon} />
					</div>
				</div>
				{showLine && (
					<hr className="absolute -bottom-2 border-1 border-gray-500 w-full" />
				)}
			</div>
		</div>
	);
}

export default function CategoryExpenses({ sumAmount }: CategoryExpensesProps) {
	const rawCategoryExpenses = useContext(RawCategoryExpensesContext);
	const length = rawCategoryExpenses.length;

	return (
		<div className="flex flex-col gap-4 h-full overflow-y-auto no-scrollbar">
			{rawCategoryExpenses
				.sort((a, b) => {
					if (a.amount < b.amount) return 1;
					if (a.amount > b.amount) return -1;
					return 0;
				})
				.map((category, index) => {
					return (
						<CategoryExpenseComponent
							key={category.id}
							{...category}
							color={Colors[index % Colors.length]}
							precent={
								sumAmount !== 0
									? Math.min((category.amount / sumAmount) * 100, 100)
									: 0
							}
							showLine={index !== length - 1}
						/>
					);
				})}
		</div>
	);
}
