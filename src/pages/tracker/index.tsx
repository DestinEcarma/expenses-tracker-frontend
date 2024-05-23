import { CategoriesContext, SetCategoriesContext } from "./utilities/categories-context";
import { LuLineChart, LuLogOut } from "react-icons/lu";
import { GetCategories, Logout } from "services/api";
import { StatusCodes } from "utilities/status-code";
import { useNavigate } from "react-router-dom";
import { pad02f } from "utilities/stringUtil";
import { Category } from "./utilities/types";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";

import AddCategoryButton from "./components/add-category-button";
import Categories from "./components/categories";

function Tracker() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [sumAmount, setSumAmount] = useState(0);

	const navigate = useNavigate();

	useEffect(() => {
		GetCategories()
			.then((categories) => {
				setCategories(categories);
				setSumAmount(categories.reduce((acc, category) => acc + category.amount, 0));
			})
			.catch((err: AxiosError) => {
				if (err.response?.status === StatusCodes.UNAUTHORIZED) return navigate("/login");
				alert(`Recieved an unexpected status code :: ${err.response?.status}.`);
			});
	}, [navigate]);

	useEffect(() => {
		setSumAmount(categories.reduce((acc, category) => acc + category.amount, 0));
	}, [categories]);

	const thisMonth = new Date().toLocaleString("default", {
		month: "short",
		year: "numeric",
	});

	const logout = async () => {
		Logout()
			.then(() => navigate("/login"))
			.catch((err: AxiosError) => alert(`Recieved an unexpected status code :: ${err.response?.status}.`));
	};

	return (
		<div className="flex flex-col mx-auto h-full max-h-full max-w-[720px]">
			<div className="mb-4 py-4">
				<h1 className="font-bold text-center">EXPENSES</h1>
			</div>
			<SetCategoriesContext.Provider value={setCategories}>
				<CategoriesContext.Provider value={categories}>
					<div className="flex flex-col gap-10 flex-grow overflow-auto">
						<div className="flex flex-col mx-auto w-min">
							<span className="leading-none tracking-tight font-bold text-gray-400 w-max">{thisMonth}</span>
							<span className="mb-4 font-extrabold text-4xl w-min">&#8369;{pad02f(sumAmount)}</span>
						</div>
						<div className="flex-grow overflow-hidden">
							<Categories sumAmount={sumAmount} />
						</div>
					</div>
					<div className="px-4 pb-4">
						<div className="flex justify-between border-t border-gray-400 w-full pt-4">
							<button disabled className="disabled:text-gray-300">
								<LuLineChart className="text-3xl" />
							</button>
							<AddCategoryButton />
							<button onClick={logout} type="button">
								<LuLogOut className="text-3xl" />
							</button>
						</div>
					</div>
				</CategoriesContext.Provider>
			</SetCategoriesContext.Provider>
		</div>
	);
}

export default Tracker;
