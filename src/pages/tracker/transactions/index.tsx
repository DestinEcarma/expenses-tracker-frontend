import {
	TransactionsContext,
	SetTransactionsContext,
	CategoryIdContext,
} from "./utilities/item-expenses-context";
import { GetCategoryFromId, GetTransactions } from "utilities/api";
import { useSearchParams } from "react-router-dom";
import { Transactions as TransactionsType } from "./utilities/types";
import { pad02f } from "utilities/stringUtil";
import { FaArrowLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";

import Transactions from "./components/transactions";
import { StatusCode } from "utilities/status-code";

const LOCALE = "default";

function CategoryItems() {
	const [transactions, setTransactions] = useState<TransactionsType[]>([]);
	const [categoryId, setCategoryId] = useState("");
	const [sumAmount, setSumAmount] = useState(0);
	const [title, setTitle] = useState("none");
	const [searchParams] = useSearchParams();

	useEffect(() => {
		(async () => {
			const id = searchParams.get("id");

			if (id) {
				setCategoryId(id);

				try {
					const [categoryExpense, statusCode] = await GetCategoryFromId(id);

					switch (statusCode) {
						case StatusCode.OK:
							setTitle(categoryExpense.name);
							break;
						case StatusCode.UNAUTHORIZED:
							return window.location.replace("/login");
						default:
							console.error(`Status Code: ${statusCode} :: An error occurred.`);
							break;
					}
				} catch (error) {
					console.error(error);
				}

				try {
					const [transactions, statusCode] = await GetTransactions(id);

					switch (statusCode) {
						case StatusCode.OK:
							setSumAmount(
								transactions.reduce((acc, item) => acc + item.amount, 0)
							);
							setTransactions(transactions);
							break;
						default:
							console.error(`Status Code: ${statusCode} :: An error occurred.`);
							break;
					}
				} catch (error) {
					console.error(error);
				}
			} else {
				window.location.replace("/tracker");
			}
		})();
	}, []);

	useEffect(() => {
		setSumAmount(transactions.reduce((acc, item) => acc + item.amount, 0));
	}, [transactions]);

	const thisMonth = new Date().toLocaleString(LOCALE, {
		month: "short",
		year: "numeric",
	});

	return (
		<div className="flex flex-col h-full max-h-full max-w-[720px] mx-auto">
			<div className="relative mb-4 py-4">
				<a
					href="/tracker"
					className="absolute top-1/2 -translate-y-1/2 ml-4 text-3xl"
				>
					<FaArrowLeft />
				</a>
				<h1 className="font-bold text-center uppercase">{title}</h1>
			</div>
			<div className="flex flex-col gap-10 flex-grow overflow-auto">
				<div className="flex flex-col mx-auto w-min">
					<span className="leading-none tracking-tight font-bold text-gray-400 w-max">
						{thisMonth}
					</span>
					<span className="mb-4 font-extrabold text-4xl w-min">
						&#8369;{pad02f(sumAmount)}
					</span>
				</div>
				<div className="flex-grow overflow-hidden pb-4 h-full">
					<CategoryIdContext.Provider value={categoryId}>
						<SetTransactionsContext.Provider value={setTransactions}>
							<TransactionsContext.Provider value={transactions}>
								<Transactions />
							</TransactionsContext.Provider>
						</SetTransactionsContext.Provider>
					</CategoryIdContext.Provider>
					<hr className="flex-grow mx-4 border-1 border-gray-500" />
				</div>
			</div>
		</div>
	);
}

export default CategoryItems;
