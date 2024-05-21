import { CSSProperties, ReactNode, useEffect, useState } from "react";
import Style from "./style.module.css";

interface CircularProgressBarProps {
	percent?: number;
	borderColor?: string;
	borderWidth?: string;
	children?: ReactNode;
}

function CircularProgressBar({
	percent = 0,
	borderColor = "#ff8000",
	borderWidth = "8px",
	children,
}: CircularProgressBarProps) {
	const [before, setBefore] = useState(0);
	const [after, setAfter] = useState(percent);

	useEffect(() => {
		if (after !== percent) {
			setBefore(after);
			setAfter(percent);
		}
	}, [percent]);

	const styling = {
		"--percent": percent + "%",
		"--border-color": borderColor,
		"--border-width": borderWidth,
	} as CSSProperties;

	const strokeDashArray = `calc(2 * ${Math.PI} * 45%)`;
	const strokeDashOffset = `calc(var(--stroke-dasharray) - var(--stroke-dasharray) * ${percent} / 100)`;

	const progress = {
		"--stroke-dasharray": strokeDashArray,
		"--stroke-dashoffset": strokeDashOffset,
		"--stroke-before": `calc(var(--stroke-dasharray) - var(--stroke-dasharray) * ${before} / 100)`,
		"--stroke-after": `calc(var(--stroke-dasharray) - var(--stroke-dasharray) * ${after} / 100)`,
	} as CSSProperties;

	return (
		<div style={styling} className={Style.parent}>
			<div className={Style["outer-border"]}>
				<div className={Style["inner-border"]}>
					<div>{children}</div>
				</div>
			</div>

			<svg xmlns="http://www.w3.org/2000/svg" version="1.1" className={Style.progress}>
				<circle cx="50%" cy="50%" r="45%" className={Style.progress} style={progress} transform={"rotate(-90 40 40)"} />
			</svg>
		</div>
	);
}

export default CircularProgressBar;
