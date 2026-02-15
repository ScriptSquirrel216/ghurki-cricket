import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { Outlet } from "@tanstack/react-router";

import { dateSearchSchema } from "@/components/date-filter";
import { statsItems } from "@/components/tabs-layout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_stats")({
	validateSearch: dateSearchSchema,
	component: () => {
		const { pathname } = useLocation();
		const searchParams = Route.useSearch();
		return (
			<main className="flex min-h-dvh flex-col">
				<Outlet />
				<footer className="fixed bottom-0 w-full border-t bg-background">
					<div className="container mx-auto grid grid-cols-5 px-1 py-2 md:py-3">
						{statsItems.map((item) => {
							const isCurrentRoute = pathname === item.url;
							return (
								<Link key={item.name} search={searchParams} to={item.url} className="group flex flex-col items-center px-1">
									<div
										className={cn(
											"flex w-full max-w-15 justify-center rounded-full py-1.5 transition-colors group-hover:bg-muted-foreground/40",
											isCurrentRoute && "bg-blue-700/40 group-hover:bg-blue-700/40",
										)}
									>
										<img src={item.icon} width={20} height={20} alt={item.name} className="aspect-square" />
									</div>
									<p className={cn("", isCurrentRoute && "font-medium")} style={{ fontSize: 13 }}>
										{item.name}
									</p>
								</Link>
							);
						})}
					</div>
				</footer>
			</main>
		);
	},
});
