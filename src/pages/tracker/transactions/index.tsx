import { TransactionsContext, SetTransactionsContext, CategoryIdContext } from "./utilities/transactions-context";
import { Transaction as TransactionsType } from "./utilities/types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StatusCodes } from "utilities/status-code";
import { GetTransactions } from "services/api";
import { pad02f } from "utilities/stringUtil";
import { FaArrowLeft } from "react-icons/fa6";
import { useEffect, useState } from "react";

import Transactions from "./components/transactions";

const LOCALE = "default";

function CategoryItems() {
	const [transactions, setTransactions] = useState<TransactionsType[]>([]);
	const [categoryId, setCategoryId] = useState("");
	const [sumAmount, setSumAmount] = useState(0);
	const [title, setTitle] = useState("none");
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	useEffect(() => {
		const id = searchParams.get("id");

		console.log(id);

		if (id) {
			setCategoryId(id);
		} else {
			navigate("/tracker");
		}
	}, [searchParams, navigate]);

	useEffect(() => {
		if (!categoryId) return;

		GetTransactions(categoryId)
			.then(([{ category, transactions }, statusCode]) => {
				switch (statusCode) {
					case StatusCodes.OK:
						setTitle(category.name);
						setTransactions(transactions);
						setSumAmount(transactions.reduce((acc, item) => acc + item.amount, 0));
						return;
					case StatusCodes.UNAUTHORIZED:
						return navigate("/login");
					default:
						throw new Error(`Recieved an unexpected status code :: ${statusCode}.`);
				}
			})
			.catch(alert);
	}, [categoryId, navigate]);

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
