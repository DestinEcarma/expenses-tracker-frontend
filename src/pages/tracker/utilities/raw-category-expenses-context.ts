import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { RawCategoryExpense } from "./types";

export const RawCategoryExpensesContext = createContext<RawCategoryExpense[]>([]);
export const SetRawCategoryExpensesContext = createContext<Dispatch<SetStateAction<RawCategoryExpense[]>> | undefined>(undefined);

export function useSetRawCategoryExpensesContext() {
	const setRawCategoryExpenses = useContext(SetRawCategoryExpensesContext);

	if (setRawCategoryExpenses === undefined) {
		throw new Error("useSetRawCategoryExpensesContext must be used within a SetRawCategoryExpensesContext");
	}

	return setRawCategoryExpenses;
}
