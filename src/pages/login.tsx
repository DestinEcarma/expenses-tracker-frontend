import { MdLock } from "react-icons/md";
import { IoPersonSharp } from "react-icons/io5";
import { BsPersonFillDown } from "react-icons/bs";

import PassowrdToggle from "components/password-toggle";

function Login() {
	const [passowrdType, button] = PassowrdToggle("text-2xl text-gray-400 text-2xl text-gray-400");

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		console.log(e);
	};

	return (
		<form onSubmit={onSubmit} className="h-full max-w-[720px] mx-auto px-4 py-20 flex flex-col">
			<h1 className="flex justify-center text-9xl mb-8 text-blue-600 drop-shadow-md">
				<BsPersonFillDown />
			</h1>
			<div className="flex flex-col gap-4 mb-auto">
				<div className="flex bg-gray-200 p-3 px-5 gap-3 rounded-full shadow-md">
					<IoPersonSharp className="text-2xl text-gray-400" />
					<input id="username" name="username" placeholder="Username" type="text" className="bg-transparent w-full outline-none placeholder:text-gray-400" />
				</div>
				<div className="flex bg-gray-200 p-3 px-5 gap-3 rounded-full shadow-md">
					<MdLock className="text-2xl text-center text-gray-400" />
					<input id="password" name="password" placeholder="Passowrd" type={passowrdType} className="bg-transparent w-full outline-none placeholder:text-gray-400" />
					{button}
				</div>
				<div className="p-3 px-5 text-center">
					<a href=".." className="text-gray-400">
						forgot password?
					</a>
				</div>
			</div>
			<div className="flex flex-col gap-4 items-center">
				<button type="submit" className=" text-white font-bold tracking-wider py-3 w-1/2 rounded-full shadow-md bg-blue-500 hover:bg-blue-600 transition-colors">
					Login
				</button>
				<a href="/sign-up" className="bg-transparent text-blue-500 font-bold tracking-wider text-center py-3 w-1/2 rounded-full hover:text-blue-600 transition-colors">
					Sign Up
				</a>
			</div>
		</form>
	);
}

export default Login;
