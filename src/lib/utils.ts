import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDate(date: string[] | null): string | null {
	if (!date || !date.length) return "All Time";
	if (date.length === 1) {
		return new Date(date[0]).toLocaleDateString("en-US", {
			day: "numeric",
			year: "numeric",
			month: "short",
		});
	}
	return null;
}
