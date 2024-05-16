import { ItemExpensesContext, SetItemExpensesContext } from "./utilities/item-expenses-context";
import { GetCategoryById, GetItemExpenses } from "utilities/api";
import { useSearchParams } from "react-router-dom";
import { ItemExpense } from "./utilities/types";
import { pad02f } from "utilities/stringUtil";
import { FaArrowLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";

import ItemExpenses from "./components/item-expenses";

const LOCALE = "default";

function CategoryItems() {
	const [itemExpenses, setItemExpenses] = useState<ItemExpense[]>([]);
	const [sumAmount, setSumAmount] = useState(0);
	const [title, setTitle] = useState("none");
	const [searchParams] = useSearchParams();

	useEffect(() => {
		(async () => {
			const id = searchParams.get("id");

			if (id) {
				const categoryExpense = await GetCategoryById(id);
				if (!categoryExpense) return window.location.replace("/tracker");

				const itemExpenses = await GetItemExpenses(id);

				setSumAmount(itemExpenses.reduce((acc, item) => acc + item.amount, 0));
				setTitle(categoryExpense.name);
				setItemExpenses(itemExpenses);
			} else {
				window.location.replace("/tracker");
			}
		})();
	}, []);

	useEffect(() => {
		setSumAmount(itemExpenses.reduce((acc, item) => acc + item.amount, 0));
	}, [itemExpenses]);

	const thisMonth = new Date().toLocaleString(LOCALE, { month: "short", year: "numeric" });

	return (
		<div className="flex flex-col h-full max-h-full max-w-[720px]">
			<div className="relative mb-4 py-4">
				<a href="/tracker" className="absolute top-1/2 -translate-y-1/2 ml-4 text-3xl">
					<FaArrowLeft />
				</a>
				<h1 className="font-bold text-center uppercase">{title}</h1>
			</div>
			<div className="flex flex-col gap-10 flex-grow overflow-auto">
				<div className="flex flex-col mx-auto w-min">
					<span className="leading-none tracking-tight font-bold text-gray-400 w-max">{thisMonth}</span>
					<span className="mb-4 font-extrabold text-4xl w-min">&#8369;{pad02f(sumAmount)}</span>
				</div>
				<div className="flex-grow overflow-hidden pb-4 h-full">
					<SetItemExpensesContext.Provider value={setItemExpenses}>
						<ItemExpensesContext.Provider value={itemExpenses}>
							<ItemExpenses />
						</ItemExpensesContext.Provider>
					</SetItemExpensesContext.Provider>
					<hr className="flex-grow mx-4 border-1 border-gray-500" />
				</div>
			</div>
		</div>
	);
}

export default CategoryItems;
