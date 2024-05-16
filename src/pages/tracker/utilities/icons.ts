import { IconType } from "react-icons";
import * as FontAwesome from "react-icons/fa";

export type IconList = Record<string, IconType>;
export type IconArray = [string, IconType][];

interface IconsData {
	faArray: IconArray;
	fa: IconList;
}

export const Icons: IconsData = {
	faArray: Object.entries(FontAwesome),
	fa: {},
};

Icons.faArray.forEach(([key, value]) => (Icons.fa[key] = value));

export function GetIcon(icon: string): IconType {
	const iconSplit = icon.split(":");
	return (Icons[iconSplit[0] as keyof typeof Icons] as IconList)[iconSplit[1] as keyof (typeof Icons)[keyof typeof Icons]] as IconType;
}
