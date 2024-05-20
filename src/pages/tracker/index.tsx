import {
	RawCategoryExpensesContext,
	SetRawCategoryExpensesContext,
} from "./utilities/raw-category-expenses-context";
import { RawCategoryExpense } from "./utilities/types";
import { StatusCode } from "utilities/status-code";
import { pad02f } from "utilities/stringUtil";
import { useEffect, useState } from "react";
import { LuLineChart, LuLogOut } from "react-icons/lu";
import { GetCategories, Logout } from "utilities/api";
// import { HiMenu } from "react-icons/hi";

import AddCategoryButton from "./components/add-category-button";
import CategoryExpenses from "./components/category-expenses";

function Tracker() {
	const [rawCategoryExpenses, setRawCategoryExpenses] = useState<
		RawCategoryExpense[]
	>([]);
	const [sumAmount, setSumAmount] = useState(0);

	useEffect(() => {
		(async () => {
			try {
				const [rawCategoryExpenses, statusCode] = await GetCategories();

				switch (statusCode) {
					case StatusCode.OK:
						setRawCategoryExpenses(rawCategoryExpenses);
						setSumAmount(
							rawCategoryExpenses.reduce(
								(acc, expense) => acc + expense.amount,
								0
							)
						);
						return;
					case StatusCode.UNAUTHORIZED:
						return window.location.replace("/login");
					default:
						console.error(`Status Code: ${statusCode} :: An error occurred.`);
						return;
				}
			} catch (error) {
				console.error(error);
			}
		})();
	}, []);

	useEffect(() => {
		setSumAmount(
			rawCategoryExpenses.reduce((acc, expense) => acc + expense.amount, 0)
		);
	}, [rawCategoryExpenses]);

	const thisMonth = new Date().toLocaleString("default", {
		month: "short",
		year: "numeric",
	});

	const logout = async () => {
		try {
			const statusCode = await Logout();

			if (statusCode === StatusCode.OK) {
				window.location.replace("/login");
			} else {
				console.error(`Status Code: ${statusCode} :: An error occurred.`);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex flex-col mx-auto h-full max-h-full max-w-[720px]">
			<div className="mb-4 py-4">
				<h1 className="font-bold text-center">EXPENSES</h1>
			</div>
			<SetRawCategoryExpensesContext.Provider value={setRawCategoryExpenses}>
				<RawCategoryExpensesContext.Provider value={rawCategoryExpenses}>
					<div className="flex flex-col gap-10 flex-grow overflow-auto">
						<div className="flex flex-col mx-auto w-min">
							<span className="leading-none tracking-tight font-bold text-gray-400 w-max">
								{thisMonth}
							</span>
							<span className="mb-4 font-extrabold text-4xl w-min">
								&#8369;{pad02f(sumAmount)}
							</span>
						</div>
						<div className="flex-grow overflow-hidden">
							<CategoryExpenses sumAmount={sumAmount} />
						</div>
					</div>
					<div className="px-4 pb-4">
						<div className="flex justify-between border-t border-gray-400 w-full pt-4">
							<button disabled className="disabled:text-gray-300">
								<LuLineChart className="text-3xl" />
							</button>
							<AddCategoryButton />
							{/* <button>
								<HiMenu className="text-3xl" />
							</button> */}
							<button onClick={logout} type="button">
								<LuLogOut className="text-3xl" />
							</button>
						</div>
					</div>
				</RawCategoryExpensesContext.Provider>
			</SetRawCategoryExpensesContext.Provider>
		</div>
	);
}

export default Tracker;
