import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Auth, Login as ApiLogin } from "services/api";
import { StatusCodes } from "utilities/status-code";
import { BsPersonFillDown } from "react-icons/bs";
import { IoPersonSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { MdLock } from "react-icons/md";

import PasswordToggle from "components/password-toggle";

function Login() {
	const [{ username, password }, setForm] = useState({
		username: "",
		password: "",
	});
	const [disabled, setDisabled] = useState(false);

	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	useEffect(() => {
		Auth()
			.then((statusCode) => {
				switch (statusCode) {
					case StatusCodes.OK:
						return navigate("/tracker");
					case StatusCodes.UNAUTHORIZED:
						return;
					default:
						throw new Error(`Recieved an unexpected status code :: ${statusCode}.`);
				}
			})
			.catch(alert);
	}, [navigate]);

	const [passwordType, button] = PasswordToggle("text-2xl text-gray-400 text-2xl text-gray-400");

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		usernameRef.current?.setCustomValidity("");
		passwordRef.current?.setCustomValidity("");

		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setDisabled(true);

		ApiLogin(username, password)
			.then((statusCode) => {
				switch (statusCode) {
					case StatusCodes.CREATED:
						return navigate("/tracker");
					case StatusCodes.BAD_REQUEST:
						usernameRef.current?.setCustomValidity("Invalid username or password.");
						passwordRef.current?.setCustomValidity("Invalid username or password.");
						usernameRef.current?.reportValidity();
						passwordRef.current?.reportValidity();
						return;
					default:
						throw new Error(`Recieved an unexpected status code :: ${statusCode}.`);
				}
			})
			.catch(alert)
			.finally(() => setDisabled(false));
	};

	return (
		<form onSubmit={onSubmit} className="h-full max-w-[720px] mx-auto px-4 py-20 flex flex-col">
			<h1 className="flex justify-center text-9xl mb-8 text-blue-600 drop-shadow-md">
				<BsPersonFillDown />
			</h1>
			<div className="flex flex-col gap-4 mb-auto">
				<div className="flex bg-gray-200 p-3 px-5 gap-3 rounded-full shadow-md">
					<IoPersonSharp className="text-2xl text-gray-400" />
					<input
						id="username"
						name="username"
						value={username}
						onChange={onChange}
						ref={usernameRef}
						placeholder="Username"
						type="text"
						className="bg-transparent w-full outline-none placeholder:text-gray-400"
					/>
				</div>
				<div className="flex bg-gray-200 p-3 px-5 gap-3 rounded-full shadow-md">
					<MdLock className="text-2xl text-center text-gray-400" />
					<input
						id="password"
						name="password"
						value={password}
						onChange={onChange}
						ref={passwordRef}
						placeholder="Password"
						type={passwordType}
						className="bg-transparent w-full outline-none placeholder:text-gray-400"
					/>
					{button}
				</div>
				<div className="p-3 px-5 text-center">
					<a href=".." className="text-gray-400">
						forgot password?
					</a>
				</div>
			</div>
			<div className="flex flex-col gap-4 items-center">
				<button
					disabled={disabled}
					type="submit"
					className="text-white font-bold tracking-wider py-3 w-1/2 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 transition-colors disabled:bg-gray-400"
				>
					Login
				</button>
				<a
					href="/sign-up"
					className="bg-transparent text-blue-500 font-bold tracking-wider text-center py-3 w-1/2 rounded-full hover:text-blue-600 transition-colors"
				>
					Sign Up
				</a>
			</div>
		</form>
	);
}

export default Login;
