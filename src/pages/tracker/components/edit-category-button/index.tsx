import { useSetCategoriesContext } from "../../utilities/categories-context";
import { DeleteCategory, EditCategory } from "services/api";
import { StatusCode } from "utilities/status-code";
import { useNavigate } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { FormEvent, useState } from "react";
import { FaTrash } from "react-icons/fa6";

import IconSelector from "../add-category-button/icon-selector";

interface EditCategoryButtonProps {
	id: string;
	name: string;
	icon: string;
}

interface ModalProps extends EditCategoryButtonProps {
	closeModal: () => void;
	isModalOpen: number;
}

function Modal({ closeModal, id, name, icon, isModalOpen }: ModalProps) {
	const [disabled, setDisabled] = useState(false);
	const [offset, setOffset] = useState(false);
	const [newName, setNewName] = useState("");
	const [newIcon, setNewIcon] = useState(icon);

	const setCategories = useSetCategoriesContext();
	const navigate = useNavigate();

	const deleteButton = () => {
		setDisabled(true);

		DeleteCategory(id)
			.then((statusCode) => {
				switch (statusCode) {
					case StatusCode.OK:
						setCategories((prev) => prev.filter((category) => category.id !== id));
						return;
					case StatusCode.UNAUTHORIZED:
						return navigate("/login");
					default:
						throw new Error(`Recieved an unexpected status code :: ${statusCode}.`);
				}
			})
			.catch(alert)
			.finally(closeModal);
	};

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setDisabled(true);

		EditCategory(id, newName, newIcon)
			.then((statusCode) => {
				switch (statusCode) {
					case StatusCode.OK:
						setCategories((prev) => {
							return prev.map((category) => {
								return category.id === id ? { ...category, name: newName, icon: newIcon } : category;
							});
						});
						return;
					case StatusCode.UNAUTHORIZED:
						return navigate("/login");
					default:
						throw new Error(`Recieved an unexpected status code :: ${statusCode}.`);
				}
			})
			.catch(alert)
			.finally(closeModal);
	};

	return (
		<div
			data-open={isModalOpen}
			className="fixed flex justify-center items-center w-full h-dvh top-0 left-0 z-10 bg-gray-500/30 backdrop-blur-sm data-[open='-1']:animate-fade-out data-[open='1']:animate-fade-in"
		>
			<div data-offset={offset} className="max-w-[400px] w-full p-4 data-[offset='true']:pt-52 transition-all">
				<form onSubmit={onSubmit} className="flex flex-col gap-4 w-full p-4 rounded-md bg-white text-black font-medium">
					<div className="relative">
						<h1 className="text-center text-xl font-extrabold capitalize">{name}</h1>
						<button
							onClick={deleteButton}
							disabled={disabled}
							type="button"
							className="absolute top-1/2 right-0 -translate-y-1/2 text-white p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors shadow-md disabled:bg-gray-400"
						>
							<FaTrash />
						</button>
					</div>
					<div className="relative flex flex-grow gap-4">
						<IconSelector icon={newIcon} setIcon={setNewIcon} setOffset={setOffset} />
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
							disabled={disabled}
							onClick={closeModal}
							type="button"
							className="w-1/4 rounded-md p-2 bg-red-500 hover:bg-red-600 transition-colors shadow-md disabled:bg-gray-400"
						>
							Close
						</button>
						<button
							disabled={disabled}
							type="submit"
							className="w-1/4 rounded-md p-2 bg-green-500 hover:bg-green-600 transition-colors shadow-md disabled:bg-gray-400"
						>
							Submit
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

function EditCategoryButton(props: EditCategoryButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(0);

	const closeModal = () => {
		setTimeout(() => setIsModalOpen(0), 200);
		setIsModalOpen(-1);
	};

	return (
		<>
			{isModalOpen !== 0 && <Modal closeModal={closeModal} {...props} isModalOpen={isModalOpen} />}
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
