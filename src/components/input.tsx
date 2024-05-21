import { useState } from "react";

interface InputProps {
	id?: string;
	min?: number;
	max?: number;
	type?: string;
	pattern?: string;
	className?: string;
	required?: boolean;
	value?: string | number | readonly string[];
	defaultValue?: string | number | readonly string[];
}

function Input({
	min = 0,
	max = 0,
	value = "",
	pattern = "",
	type = "text",
	className = "",
	required = false,
	defaultValue = "",
}: InputProps) {
	const [holder, setHolder] = useState(value);

	return [
		holder,
		<input
			min={min}
			max={max}
			type={type}
			value={holder}
			pattern={pattern}
			required={required}
			className={className}
			defaultValue={defaultValue}
			onChange={(event) => setHolder(event.target.value)}
		/>,
	];
}

export default Input;
