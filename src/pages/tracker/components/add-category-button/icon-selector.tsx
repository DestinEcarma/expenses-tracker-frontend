import { GetIcon, Icons } from "pages/tracker/utilities/icons";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

interface SelectorProps {
	setIcon: (name: string) => void;
}

interface IconSelectorProps {
	icon: string;
	setIcon: Dispatch<SetStateAction<string>>;
	setOffset?: Dispatch<SetStateAction<boolean>>;
}

function Selector({ setIcon }: SelectorProps) {
	const [showIcons, setShowIcons] = useState(() => Object.fromEntries(Icons.faArray.map(([key]) => [key, false])));
	const [search, setSearch] = useState("");

	const iconsRef = useRef<HTMLButtonElement[]>([]);

	useEffect(() => {
		const handleIntersect = (entries: IntersectionObserverEntry[]) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) setShowIcons((prevState) => ({ ...prevState, [entry.target.id]: true }));
			});
		};

		const observer = new IntersectionObserver(handleIntersect, {
			root: null,
			rootMargin: "0px",
			threshold: 0,
		});

		iconsRef.current.forEach((iconRef) => {
			observer.observe(iconRef);
		});

		return () => observer.disconnect();
	}, [iconsRef]);

	return (
		<>
			<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search..." className="flex-grow p-2 border border-gray-500 rounded-md" />
			<div className="flex-grow grid grid-cols-6 h-[300px] content-start rounded-md border border-gray-500 overflow-y-auto text-2xl items-center no-scrollbar">
				{Icons.faArray.map(([key, Icon]) => (
					<div data-show={search.length < 3 ? true : key.toLocaleLowerCase().includes(search.toLowerCase())} key={key} className="w-full aspect-square flex justify-center items-center p-1 data-[show=false]:hidden">
						<button onClick={() => setIcon(`fa:${key}`)} id={key} ref={(el) => el && iconsRef.current.push(el)} type="button" className="flex justify-center items-center rounded shadow aspect-square w-full hover:bg-gray-200 hover:scale-110 transition-all">
							{showIcons[key] && <Icon />}
						</button>
					</div>
				))}
			</div>
		</>
	);
}

function IconSelector({ setOffset, setIcon, icon }: IconSelectorProps) {
	const [isModalOpen, setIsModalOpen] = useState(0);

	const IconDisplay = GetIcon(icon);

	const modal = (
		<div data-open={isModalOpen} className="absolute left-0 top-0 -translate-y-full w-full data-[open='-1']:animate-fade-out data-[open='1']:animate-fade-in">
			<div className="relative flex flex-col gap-4 w-full bg-white mb-4 rounded-md border border-gray-500 p-4">
				<Selector
					setIcon={(name) => {
						setIcon(name);

						if (isModalOpen === 1) {
							setTimeout(() => setIsModalOpen(0), 200);
							if (setOffset) setOffset(false);
							setIsModalOpen(-1);
						}
					}}
				/>
				<div className="absolute w-[15px] aspect-square rotate-45 -bottom-[1px] left-0 ml-3 translate-y-1/2 bg-white border-b border-r border-b-gray-500 border-r-gray-500"></div>
			</div>
		</div>
	);

	return (
		<>
			{isModalOpen !== 0 && modal}
			<button
				onClick={() => {
					setIsModalOpen((prev) => {
						if (prev === 0) {
							if (setOffset) setOffset(true);
							return 1;
						} else {
							setTimeout(() => setIsModalOpen(0), 200);
							if (setOffset) setOffset(false);
							return prev * -1;
						}
					});
				}}
				type="button"
				className="relative flex items-center justify-center border border-gray-500 hover:bg-gray-200 rounded-md p-2 h-full aspect-square transition-colors"
			>
				<IconDisplay className="text-2xl" />
			</button>
		</>
	);
}

export default IconSelector;
