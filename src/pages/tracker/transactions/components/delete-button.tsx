import { CategoryIdContext, useTransactionsContext } from "../utilities/transactions-context";
import { FormEvent, useContext, useState } from "react";
import { StatusCodes } from "utilities/status-code";
import { DeleteTransaction } from "services/api";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa6";

interface DeleteButtonProps {
	id: string;
}

interface ModalProps extends DeleteButtonProps {
	closeModal: () => void;
	isModalOpen: number;
}

function Modal({ closeModal, id, isModalOpen }: ModalProps) {
	const [disabled, setDisabled] = useState(false);

	const setTransactions = useTransactionsContext();
	const categoryId = useContext(CategoryIdContext);
	const navigate = useNavigate();

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setDisabled(true);

		DeleteTransaction(categoryId, id)
			.then((statusCode) => {
				switch (statusCode) {
					case StatusCodes.OK:
						setTransactions((prev) => prev.filter((item) => item.id !== id));
						return;
					case StatusCodes.UNAUTHORIZED:
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
			className="z-50 fixed top-0 left-0 flex justify-center items-center w-full h-dvh bg-gray-500/30 backdrop-blur-sm data-[open='-1']:animate-fade-out data-[open='1']:animate-fade-in"
		>
			<form
				onSubmit={onSubmit}
				data-open={isModalOpen}
				className="absolute w-max data-[open='-1']:animate-fade-out data-[open='1']:animate-fade-in"
			>
				<div className="left-0 flex flex-col gap-4 w-max bg-white p-4 rounded-md drop-shadow-md">
					<h1 className="text-center text-black text-xl font-bold">Are you sure</h1>
					<p className="text-gray-400">This action cannot be undone.</p>
					<div className="flex-grow flex justify-between font-bold text-white">
						<button
							onClick={closeModal}
							disabled={disabled}
							type="button"
							className="w-1/4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors shadow-md disabled:bg-gray-400"
						>
							No
						</button>
						<button
							disabled={disabled}
							type="submit"
							className="w-1/4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors shadow-md disabled:bg-gray-400"
						>
							Yes
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}

function DeleteButton({ id }: DeleteButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(0);

	const closeModal = () => {
		setTimeout(() => setIsModalOpen(0), 200);
		setIsModalOpen(-1);
	};

	return (
		<>
			{isModalOpen !== 0 && <Modal closeModal={closeModal} id={id} isModalOpen={isModalOpen} />}
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
				className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-full shadow-md transition-colors"
			>
				<FaTrash />
			</button>
		</>
	);
}

export default DeleteButton;
