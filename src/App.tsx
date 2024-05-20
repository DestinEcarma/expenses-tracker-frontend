import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// const Home = lazy(() => import("pages/home"));
const Login = lazy(() => import("pages/login"));
const SignUp = lazy(() => import("pages/sign-up"));
const Tracker = lazy(() => import("pages/tracker"));
const Transactions = lazy(() => import("pages/tracker/transactions"));

function Redirect() {
	window.location.replace("/login");

	return <div></div>;
}

function App() {
	return (
		<div className="h-dvh font-mono bg-gradient-to-r from-gray-100 via-white to-gray-100 transition-colors">
			<BrowserRouter>
				<Suspense>
					<Routes>
						{/* <Route path="/home" element={<Home />} /> */}
						<Route path="/" element={<Redirect />} />
						<Route path="/login" element={<Login />} />
						<Route path="/sign-up" element={<SignUp />} />
						<Route path="/tracker" element={<Tracker />} />
						<Route path="/tracker/category" element={<Transactions />} />
					</Routes>
				</Suspense>
			</BrowserRouter>
		</div>
	);
}

export default App;
