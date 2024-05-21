import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { Category } from "./types";

export const CategoriesContext = createContext<Category[]>([]);
export const SetCategoriesContext = createContext<Dispatch<SetStateAction<Category[]>> | undefined>(undefined);

export function useSetCategoriesContext() {
	const setCategories = useContext(SetCategoriesContext);

	if (setCategories === undefined) {
		throw new Error("useSetCategoriesContext must be used within a SetCategoriesContext");
	}

	return setCategories;
}
