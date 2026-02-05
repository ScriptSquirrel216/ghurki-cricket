import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Scripts } from "@tanstack/react-router";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { z } from "zod";

import { datesQueryOptions } from "@/components/date-filter";
import { playerQueryOptions } from "@/components/players/query";
import { Toaster } from "@/components/ui/sonner";
import { MenuProvider } from "@/context/menu-context";

import appCss from "../styles.css?url";

const rootSearchSchema = z.object({
	date: z.string().optional(),
	rivalry: z.string().optional(),
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ title: "Ghurki Cricket Scorer" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
	}),
	shellComponent: RootDocument,
	validateSearch: (search) => rootSearchSchema.parse(search),
	beforeLoad: ({ search }) => ({ date: search.date, rivalry: search.rivalry }),
	loader: async ({ context }) =>
		await Promise.all([
			context.queryClient.ensureQueryData(playerQueryOptions()),
			context.queryClient.ensureQueryData(datesQueryOptions()),
		]),
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const { queryClient } = Route.useRouteContext();
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<NuqsAdapter>
						<MenuProvider>{children}</MenuProvider>
					</NuqsAdapter>
					<Toaster />
					<ReactQueryDevtools client={queryClient} initialIsOpen={true} />
				</QueryClientProvider>
				<Scripts />
			</body>
		</html>
	);
}
