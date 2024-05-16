export function pad02f(num: number): string {
	return num.toLocaleString("en-US", { minimumFractionDigits: 2 });
}
