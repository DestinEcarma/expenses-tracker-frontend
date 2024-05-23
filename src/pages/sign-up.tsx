import { ChangeEvent, useEffect, useRef, useState } from "react";
import { SignUp as ApiSignUp, Auth } from "services/api";
import { StatusCodes } from "utilities/status-code";
import { BsPersonFillDown } from "react-icons/bs";
import { IoPersonSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdLock } from "react-icons/md";
import { AxiosError } from "axios";

import PasswordToggle from "components/password-toggle";

function SignUp() {
	const [{ username, password, passwordConfirm }, setForm] = useState({
		username: "",
		password: "",
		passwordConfirm: "",
	});
	const [disabled, setDisabled] = useState(false);

	const usernameRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	useEffect(() => {
		Auth()
			.then(() => navigate("/tracker"))
			.catch((err: AxiosError) => {
				if (err.response?.status === StatusCodes.UNAUTHORIZED) return;
				alert(`Recieved an unexpected status code :: ${err.response?.status}.`);
			});
	}, [navigate]);

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		usernameRef.current?.setCustomValidity("");

		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setDisabled(true);

		ApiSignUp(username, password)
			.then(() => navigate("/tracker"))
			.catch((err: AxiosError) => {
				switch (err.response?.status) {
					case StatusCodes.BAD_REQUEST:
						usernameRef.current?.setCustomValidity("Invalid username or password.");
						usernameRef.current?.reportValidity();
						return;
					default:
						alert(`Recieved an unexpected status code :: ${err.response?.status}.`);
				}
			})
			.finally(() => setDisabled(false));
	};

	const [passwordType, button] = PasswordToggle("text-2xl text-gray-400 text-2xl text-gray-400");

	return (
		<form onSubmit={onSubmit} className="h-full max-w-[720px] mx-auto px-4 py-20 flex flex-col">
			<h1 className="flex justify-center text-9xl mb-8 text-blue-600 drop-shadow-md">
				<BsPersonFillDown />
			</h1>
			<div className="flex flex-col gap-4 mb-auto">
				<div className="flex bg-gray-200 p-3 px-5 gap-3 rounded-full shadow-md">
					<IoPersonSharp className="text-2xl text-gray-400" />
					<input
						name="username"
						value={username}
						onChange={onChange}
						ref={usernameRef}
						placeholder="Username"
						type="text"
						required
						pattern="^[a-zA-Z0-9_]{3,20}$"
						title="Username must be minimum of 3 and a max of 20 characters long and contain only letters (uppercase or lowercase), digits, or underscores."
						className="bg-transparent w-full outline-none placeholder:text-gray-400"
					/>
				</div>
				<div className="flex bg-gray-200 p-3 px-5 gap-3 rounded-full shadow-md">
					<MdLock className="text-2xl text-gray-400" />
					<input
						name="password"
						value={password}
						onChange={onChange}
						placeholder="Password"
						type={passwordType}
						required
						pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\w]).{8,}$"
						title="Password must contain at least one digit, one lowercase letter, one uppercase letter, one special character, and be at least 8 characters long."
						className="bg-transparent w-full outline-none placeholder:text-gray-400"
					/>
					{button}
				</div>
				<div className="flex bg-gray-200 p-3 px-5 gap-3 rounded-full shadow-md">
					<MdLock className="text-2xl text-gray-400" />
					<input
						name="passwordConfirm"
						value={passwordConfirm}
						placeholder="password Confirm"
						type={passwordType}
						required
						pattern={`^${password}$`}
						title="Password does not match."
						onChange={onChange}
						className="bg-transparent w-full outline-none placeholder:text-gray-400"
					/>
					{button}
				</div>
			</div>
			<div className="flex flex-col gap-4 items-center">
				<button
					disabled={disabled}
					type="submit"
					className="text-white font-bold tracking-wider py-3 w-1/2 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-gray-400"
				>
					Sign Up
				</button>
				<a
					href="/login"
					className="bg-transparent text-blue-500 font-bold tracking-wider text-center py-3 w-1/2 rounded-full hover:text-blue-600 transition-colors"
				>
					Login
				</a>
			</div>
		</form>
	);
}

export default SignUp;
