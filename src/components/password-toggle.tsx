import { useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";

function PasswordToggle(className: string | undefined): [string, JSX.Element] {
	const [visible, setVisibility] = useState(false);

	const button = (
		<button type="button" className={className} onClick={() => setVisibility((visible) => !visible)}>
			{visible ? <AiFillEyeInvisible /> : <AiFillEye />}
		</button>
	);

	const passwordType = visible ? "text" : "password";

	return [passwordType, button];
}

export default PasswordToggle;
