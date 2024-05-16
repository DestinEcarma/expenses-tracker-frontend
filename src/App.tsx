import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// import Home from "pages/home";
// import Login from "pages/login";
// import SignUp from "pages/sign-up";
// import Tracker from "pages/tracker";

const Home = lazy(() => import("pages/home"));
const Login = lazy(() => import("pages/login"));
const SignUp = lazy(() => import("pages/sign-up"));
const Tracker = lazy(() => import("pages/tracker"));
const CategoryItems = lazy(() => import("pages/tracker/item-expenses"));

function App() {
	return (
		<div className="h-dvh font-mono bg-gradient-to-r from-gray-100 via-white to-gray-100 transition-colors">
			<BrowserRouter>
				<Suspense>
					<Routes>
						<Route path="/home" element={<Home />} />
						<Route path="/login" element={<Login />} />
						<Route path="/sign-up" element={<SignUp />} />
						<Route path="/tracker" element={<Tracker />} />
						<Route path="/tracker/category" element={<CategoryItems />} />
					</Routes>
				</Suspense>
			</BrowserRouter>
		</div>
	);
}

export default App;
