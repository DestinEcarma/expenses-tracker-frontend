import { FormEvent, useState } from "react";
import { FaPencilAlt } from "react-icons/fa";
import IconSelector from "./add-category-button/icon-selector";
import { DeleteCategory, EditCategory } from "utilities/api";
import { useSetRawCategoryExpensesContext } from "../utilities/raw-category-expenses-context";
import { FaTrash } from "react-icons/fa6";
import { StatusCode } from "utilities/status-code";

interface EditCategoryButtonProps {
	id: string;
	name: string;
	icon: string;
}

function EditCategoryButton({ id, name, icon }: EditCategoryButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(0);
	const [offset, setOffset] = useState(false);
	const [newName, setNewName] = useState("");
	const [newIcon, setNewIcon] = useState(icon);
	const setCategoryExpenses = useSetRawCategoryExpensesContext();

	const closeModal = () => {
		setTimeout(() => setIsModalOpen(0), 200);
		setIsModalOpen(-1);
	};

	const deleteButton = async () => {
		try {
			const statusCode = await DeleteCategory(id);

			switch (statusCode) {
				case StatusCode.OK:
					setCategoryExpenses((prev) =>
						prev.filter((category) => category.id !== id)
					);
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

		closeModal();
	};

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (await EditCategory(id, newName, newIcon)) {
			setCategoryExpenses((prev) =>
				prev.map((category) =>
					category.id === id
						? { ...category, name: newName, icon: newIcon }
						: category
				)
			);
		}

		closeModal();
	};

	return (
		<>
			{isModalOpen !== 0 && (
				<div
					data-open={isModalOpen}
					className="fixed flex justify-center items-center w-full h-dvh top-0 left-0 z-10 bg-gray-500/30 backdrop-blur-sm data-[open='-1']:animate-fade-out data-[open='1']:animate-fade-in"
				>
					<div
						data-offset={offset}
						className="max-w-[400px] w-full p-4 data-[offset='true']:pt-52 transition-all"
					>
						<form
							onSubmit={onSubmit}
							className="flex flex-col gap-4 w-full p-4 rounded-md bg-white text-black font-medium"
						>
							<div className="relative">
								<h1 className="text-center text-xl font-extrabold capitalize">
									{name}
								</h1>
								<button
									onClick={deleteButton}
									type="button"
									className="absolute top-1/2 right-0 -translate-y-1/2 text-white p-2 bg-red-500 rounded-full"
								>
									<FaTrash />
								</button>
							</div>
							<div className="relative flex flex-grow gap-4">
								<IconSelector
									icon={newIcon}
									setIcon={setNewIcon}
									setOffset={setOffset}
								/>
								<input
									value={newName}
									onChange={(event) => setNewName(event.target.value)}
									id="name"
									placeholder="Name"
									required
									className="flex-grow p-2 border border-gray-500 rounded-md"
								/>
							</div>
							<div className="flex justify-between text-white font-bold">
								<button
									onClick={closeModal}
									type="button"
									className="w-1/4 rounded-md p-2 bg-red-500 hover:bg-red-600 transition-colors shadow-md"
								>
									Close
								</button>
								<button
									type="submit"
									className="w-1/4 rounded-md p-2 bg-green-500 hover:bg-green-600 transition-colors shadow-md"
								>
									Submit
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
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
				className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full shadow-md transition-colors"
			>
				<FaPencilAlt />
			</button>
		</>
	);
}

export default EditCategoryButton;
