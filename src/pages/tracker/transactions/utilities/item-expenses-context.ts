import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Transaction } from "./types";

export const CategoryIdContext = createContext<string>("");
export const TransactionsContext = createContext<Transaction[]>([]);
export const SetTransactionsContext = createContext<Dispatch<SetStateAction<Transaction[]>> | undefined>(undefined);

export function useTransactionsContext() {
	const setTransactions = useContext(SetTransactionsContext);

	if (setTransactions === undefined) {
		throw new Error("useTransactionsContext must be used within a SetTransactionsContext");
	}

	return setTransactions;
}
