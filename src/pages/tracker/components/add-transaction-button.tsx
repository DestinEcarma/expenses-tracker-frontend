import { useSetCategoriesContext } from "pages/tracker/utilities/categories-context";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { StatusCode } from "utilities/status-code";
import { useNavigate } from "react-router-dom";
import { AddTransaction } from "utilities/api";
import { FaPlus } from "react-icons/fa";

interface AddTransactionButtonProps {
	name: string;
	id: string;
}

interface ModalProps {
	closeModal: () => void;
	isModalOpen: number;
	name: string;
	id: string;
}

function Modal({ closeModal, isModalOpen, name, id }: ModalProps) {
	const [description, setDescription] = useState("");
	const [amount, setAmount] = useState("0");
	const [disabled, setDisabled] = useState(false);

	const amountInputRef = useRef<HTMLInputElement>(null);
	const setCategories = useSetCategoriesContext();
	const navigate = useNavigate();

	const numberRegex = /^(^\.\d*$)?(^\d*\.\d$)?(^\d*\.)?(\d*)*$/;

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (parseFloat(amount) <= 0) {
			amountInputRef.current?.setCustomValidity("Amount must be greater than 0.");
			amountInputRef.current?.reportValidity();
			return;
		}

		setDisabled(true);

		AddTransaction(id, description, parseFloat(amount))
			.then((statusCode) => {
				switch (statusCode) {
					case StatusCode.CREATED:
						setCategories((prev) => {
							return prev.map((category) => {
								if (category.id === id) {
									category.amount += parseFloat(amount);
									category.transactions++;
								}

								return category;
							});
						});
						return;
					case StatusCode.UNAUTHORIZED:
						return navigate("/login");
					case StatusCode.BAD_REQUEST:
						amountInputRef.current?.setCustomValidity("An error occurred. Please try again.");
						amountInputRef.current?.reportValidity();
						return;
					default:
						throw new Error(`Recieved an unexpected status code :: ${statusCode}.`);
				}
			})
			.catch(alert)
			.finally(closeModal);
	};

	const amountHanlder = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;

		if (value === "") return setAmount("0");
		if (numberRegex.test(value) === false) {
			return;
		}

		setAmount(amount === "0" ? parseFloat(value).toString() : value);
		amountInputRef.current?.setCustomValidity("");
	};

	return (
		<div
			data-open={isModalOpen}
			className="fixed flex items-center justify-center w-full h-dvh top-0 left-0 z-10 bg-gray-500/30 backdrop-blur-sm data-[open='-1']:animate-fade-out data-[open='1']:animate-fade-in"
		>
			<div className="max-w-[400px] w-full p-4">
				<form onSubmit={onSubmit} className="flex flex-col gap-4 w-full p-4 rounded-md bg-white text-black font-medium">
					<h1 className="text-center text-xl font-extrabold capitalize">{name}</h1>
					<input
						value={description}
						onChange={(event) => setDescription(event.target.value)}
						type="text"
						placeholder="Description"
						className="flex-grow p-2 border border-gray-500 rounded-md"
					/>
					<input
						value={amount}
						onChange={amountHanlder}
						type="text"
						ref={amountInputRef}
						className="p-2 border border-gray-500 rounded-md"
						required
					/>
					<div className="flex justify-between text-white font-bold">
						<button
							onClick={closeModal}
							disabled={disabled}
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

function AddTransactionButton({ name, id }: AddTransactionButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(0);

	const closeModal = () => {
		setTimeout(() => setIsModalOpen(0), 200);
		setIsModalOpen(-1);
	};

	return (
		<>
			{isModalOpen !== 0 && <Modal closeModal={closeModal} isModalOpen={isModalOpen} name={name} id={id} />}
			<button
				onClick={() => setIsModalOpen(1)}
				className="p-2 bg-green-500 hover:bg-green-600 rounded-full shadow-md transition-colors"
			>
				<FaPlus />
			</button>
		</>
	);
}

export default AddTransactionButton;
