import { useSetRawCategoryExpensesContext } from "pages/tracker/utilities/raw-category-expenses-context";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { AddCategory } from "utilities/api";
import { FaPlus } from "react-icons/fa6";

import IconSelector from "./icon-selector";

interface ModalProps {
	setIsModalOpen: Dispatch<SetStateAction<number>>;
	isModalOpen: number;
}

function Modal({ setIsModalOpen, isModalOpen }: ModalProps) {
	const [icon, setIcon] = useState("fa:FaHamburger");
	const [name, setName] = useState("");
	const setCategoryExpenses = useSetRawCategoryExpensesContext();

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (name.length > 0) {
			const newCategory = await AddCategory(name, icon);

			setCategoryExpenses((prev) => [...prev, newCategory]);
			setIsModalOpen(-1);

			setTimeout(() => {
				setIsModalOpen(0);
				setName("");
				setIcon("FaHamburger");
			}, 200);
		}
	};

	return (
		<form onSubmit={onSubmit} data-open={isModalOpen} className="absolute -translate-y-full -translate-x-1/2 left-1/2 flex w-dvw max-w-[400px] p-4 data-[open='-1']:animate-fade-out data-[open='1']:animate-fade-in">
			<div className="relative bg-white p-4 rounded-lg flex flex-col flex-grow gap-4 drop-shadow-md">
				<h1 className="text-center text-xl font-extrabold">Add Category</h1>
				<div className="relative flex flex-grow gap-4">
					<IconSelector icon={icon} setIcon={setIcon} />
					<input value={name} onChange={(event) => setName(event.target.value)} id="name" placeholder="Name" required className="flex-grow p-2 border border-gray-500 rounded-md" />
				</div>
				<button type="submit" className="w-full text-center p-2 bg-green-500 hover:bg-green-600 rounded-md text-white font-bold transition-colors shadow-md">
					Submit
				</button>
				<div className="absolute w-[15px] aspect-square bottom-[1px] left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 bg-white"></div>
			</div>
		</form>
	);
}

function AddCategoryButton() {
	const [isModalOpen, setIsModalOpen] = useState(0);

	return (
		<>
			{isModalOpen !== 0 && <div data-open={isModalOpen} className="w-full h-dvh fixed top-0 left-0 bg-gray-500/30 backdrop-blur-sm data-[open='-1']:animate-fade-out data-[open='1']:animate-fade-in"></div>}
			<div className="relative">
				{isModalOpen !== 0 && <Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />}
				<button
					onClick={() =>
						setIsModalOpen((prev) => {
							if (prev === 0) return 1;
							else {
								setTimeout(() => setIsModalOpen(0), 200);
								return prev * -1;
							}
						})
					}
					data-open={isModalOpen}
					className="rounded-full shadow-md text-white bg-blue-500 p-2 hover:bg-blue-600 data-[open='1']:rotate-45 data-[open='1']:bg-red-500 data-[open='1']:hover:bg-red-500 transition-all duration-500 ease-out"
				>
					<FaPlus className="text-3xl" />
				</button>
			</div>
		</>
	);
}

export default AddCategoryButton;
