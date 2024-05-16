import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { ItemExpense } from "./types";

export const ItemExpensesContext = createContext<ItemExpense[]>([]);
export const SetItemExpensesContext = createContext<Dispatch<SetStateAction<ItemExpense[]>> | undefined>(undefined);

export function useSetItemExpensesContext() {
	const setItemExpenses = useContext(SetItemExpensesContext);

	if (setItemExpenses === undefined) {
		throw new Error("useSetItemExpensesContext must be used within a SetItemExpensesContext");
	}

	return setItemExpenses;
}
