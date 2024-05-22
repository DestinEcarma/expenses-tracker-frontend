import { FormEvent, useContext, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { DeleteTransaction } from "utilities/api";
import { CategoryIdContext, useTransactionsContext } from "../utilities/transactions-context";

interface DeleteButtonProps {
	id: string;
}

function DeleteButton({ id: transactionId }: DeleteButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(0);
	const categoryId = useContext(CategoryIdContext);
	const setTransactions = useTransactionsContext();

	const closeModal = () => {
		setTimeout(() => setIsModalOpen(0), 200);
		setIsModalOpen(-1);
	};

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		try {
			event.preventDefault();

			if ((await DeleteTransaction(categoryId, transactionId)) === 200) {
				setTransactions((prev) => prev.filter((item) => item.id !== transactionId));
			}

			closeModal();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<>
			{isModalOpen !== 0 && (
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
									type="button"
									className="w-1/4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md transition-colors shadow-md"
								>
									No
								</button>
								<button
									type="submit"
									className="w-1/4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors shadow-md"
								>
									Yes
								</button>
							</div>
						</div>
					</form>
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
				className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-full shadow-md transition-colors"
			>
				<FaTrash />
			</button>
		</>
	);
}

export default DeleteButton;
