import { BsPersonFillDown } from "react-icons/bs";
import { Login as ApiLogin, Auth } from "utilities/api";
import { IoPersonSharp } from "react-icons/io5";
import { MdLock } from "react-icons/md";
import { ChangeEvent, useEffect, useRef, useState } from "react";

import PasswordToggle from "components/password-toggle";
import { StatusCode } from "utilities/status-code";

function Login() {
	const [{ username, password }, setForm] = useState({
		username: "",
		password: "",
	});

	const usernameRef = useRef<HTMLInputElement>(null);
	const passwordRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		(async () => {
			try {
				const statusCode = await Auth();

				if (statusCode === StatusCode.OK) {
					return window.location.replace("/tracker");
				}
			} catch (error) {
				console.error(error);
			}
		})();
	}, []);

	const [passwordType, button] = PasswordToggle(
		"text-2xl text-gray-400 text-2xl text-gray-400"
	);

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		if (name === "username") {
			usernameRef.current?.setCustomValidity("");
		} else {
			passwordRef.current?.setCustomValidity("");
		}

		setForm((prev) => ({ ...prev, [name]: value }));
	};

	const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		try {
			let statusCode = await ApiLogin(username, password);

			switch (statusCode) {
				case StatusCode.OK:
				case StatusCode.CREATED:
					return window.location.replace("/tracker");
				case StatusCode.BAD_REQUEST:
					usernameRef.current?.setCustomValidity(
						"Invalid username or password."
					);
					passwordRef.current?.setCustomValidity(
						"Invalid username or password."
					);
					usernameRef.current?.reportValidity();
					passwordRef.current?.reportValidity();
					return;
				default:
					return console.error(
						`Status Code: ${statusCode} :: An error occurred.`
					);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form
			onSubmit={onSubmit}
			className="h-full max-w-[720px] mx-auto px-4 py-20 flex flex-col"
		>
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
					type="submit"
					className=" text-white font-bold tracking-wider py-3 w-1/2 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 transition-colors"
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
