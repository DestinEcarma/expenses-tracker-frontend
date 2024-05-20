import { TransactionsContext } from "../utilities/item-expenses-context";
import { pad02f } from "utilities/stringUtil";
import { useContext } from "react";

import DeleteButton from "./delete-button";

const LOCALE = "default";
const DAY: { day: "numeric" } = { day: "numeric" };
const WEEKDAY: { weekday: "short" } = { weekday: "short" };
const TIME: { hour12: true; hour: "2-digit"; minute: "2-digit" } = {
	hour12: true,
	hour: "2-digit",
	minute: "2-digit",
};

function Transactions() {
	const transactions = useContext(TransactionsContext);

	return (
		<div className="flex flex-col gap-4 h-full overflow-y-auto no-scrollbar">
			{transactions
				.sort((a, b) => {
					const dateA = new Date(a.createdAt);
					const dateB = new Date(b.createdAt);

					return dateB.getTime() - dateA.getTime();
				})
				.map((item, index) => (
					<div className="flex gap-4 px-4 last:mb-4">
						<div className="flex flex-col justify-center items-center aspect-square h-20 text-gray-300 font-bold rounded-full border-8 border-gray-300 drop-shadow-md hover:text-gray-400 transition-colors">
							<h1 className="text-xl leading-[0.8]">
								{item.createdAt.toLocaleDateString(LOCALE, WEEKDAY)}
							</h1>
							<h2 className="text-4xl leading-[0.8]">
								{item.createdAt.toLocaleDateString(LOCALE, DAY)}
							</h2>
						</div>
						<div className="relative flex-grow flex justify-between gap-4">
							<div className="flex-grow flex flex-col justify-center">
								<span className="font-bold">
									{item.createdAt.toLocaleTimeString(LOCALE, TIME)}
								</span>
								{
									// item.description.length > 15
								}
								<span className="text-gray-400">{item.description}</span>
							</div>
							<div className="flex-grow flex flex-col items-end justify-center">
								<span className="text-right text-red-500 font-bold">
									&#8369;{pad02f(item.amount)}
								</span>
								<DeleteButton id={item.id} />
							</div>
							{index !== transactions.length - 1 && (
								<hr className="absolute -bottom-2 border-1 border-gray-500 w-full" />
							)}
						</div>
					</div>
				))}
		</div>
	);
}

export default Transactions;
