import { createFileRoute, Link } from "@tanstack/react-router";

import { Item, ItemContent, ItemTitle, ItemMedia } from "@/components/ui/item";

import { tabItems } from "./_tab";

function HomeRoute() {
	return (
		<main className="container mx-auto flex min-h-dvh flex-col gap-4 p-4">
			<header className="flex items-center justify-between">
				<h1 className="text-xl font-semibold">Ghurki Cricket</h1>
			</header>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{tabItems.map((item) => (
					<Item key={item.name} variant="outline" className="flex-row" asChild>
						<Link to={item.url}>
							<ItemMedia variant="icon">
								<img src={item.icon} width={18} height={18} alt={item.name} className="aspect-square" />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>{item.name}</ItemTitle>
							</ItemContent>
						</Link>
					</Item>
				))}
			</div>
		</main>
	);
}

export const Route = createFileRoute("/")({
	component: HomeRoute,
});
