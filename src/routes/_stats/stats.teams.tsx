import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { Teams } from "zenstack/output/models";
import { z } from "zod";

import { DateFilter, dateSearchSchema, type DateSearchSchema } from "@/components/date-filter";
import { TabsLayout } from "@/components/tabs/tabs-layout";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";
import { db } from "@/lib/db";
import { ballsToOvers } from "@/lib/utils";

const teamStatsQueryOptions = ({ teams, date, rivalry }: { teams: Teams[] } & DateSearchSchema) => {
	const teamIds = teams.map((team) => team.name);
	const teamStats = teamIds.map((teamId) => getTeamStats({ data: { teamId, date, rivalry } }));
	return queryOptions({
		queryKey: ["teams-stats", ...teamIds, date ?? rivalry ?? "all-time"],
		queryFn: async () => await Promise.all(teamStats),
	});
};

const getTeams = createServerFn({ method: "GET" }).handler(async () => {
	const teams = await db.teams.findMany();
	return { teams };
});

const getTeamStats = createServerFn({ method: "GET" })
	.inputValidator(dateSearchSchema.extend({ teamId: z.string() }))
	.handler(async ({ data: { teamId, date, rivalry } }) => {
		const [wonMatches, lowestScore, highestScore, aggregate] = await Promise.all([
			db.matches.count({ where: { winnerId: teamId, date: { date, rivalryId: rivalry } } }),
			db.innings.findFirst({ where: { teamId, match: { date: { date, rivalryId: rivalry } } }, orderBy: { runs: "asc" } }),
			db.innings.findFirst({ where: { teamId, match: { date: { date, rivalryId: rivalry } } }, orderBy: { runs: "desc" } }),
			db.innings.aggregate({
				where: { teamId, match: { date: { date, rivalryId: rivalry } } },
				_sum: { runs: true, balls: true, wickets: true, allOuts: true },
			}),
		]);
		return {
			teamId,
			wonMatches,
			totalRuns: aggregate._sum.runs || 0,
			totalBalls: aggregate._sum.balls || 0,
			totalWickets: aggregate._sum.wickets || 0,
			totalAllOuts: aggregate._sum.allOuts || 0,
			strikeRate: aggregate._sum.balls ? (aggregate._sum.runs / aggregate._sum.balls) * 100 : 0,
			lowestScore: lowestScore
				? `${lowestScore.runs}${!lowestScore.allOuts ? `-${lowestScore.wickets}` : ""} (${ballsToOvers(lowestScore.balls)})`
				: "-",
			highestScore: highestScore
				? `${highestScore.runs}${!highestScore.allOuts ? `-${highestScore.wickets}` : ""} (${ballsToOvers(highestScore.balls)})`
				: "-",
		};
	});

export const Route = createFileRoute("/_stats/stats/teams")({
	head: () => ({ meta: [{ title: "Teams Stats" }] }),
	beforeLoad: () => getTeams(),
	loader: async ({ context }) => await context.queryClient.ensureQueryData(teamStatsQueryOptions(context)),
	component: () => {
		const isMobile = useIsMobile();
		const context = Route.useRouteContext();
		const { data } = useSuspenseQuery(teamStatsQueryOptions(context));
		const totalMatches = data.reduce((acc, { wonMatches }) => acc + wonMatches, 0);
		const teamStats = data
			.map((stat) => ({
				...stat,
				totalMatches,
				winPercent: totalMatches ? Number(((stat.wonMatches / totalMatches) * 100).toFixed()) : 0,
			}))
			.sort((a, b) => b.winPercent - a.winPercent);

		return (
			<TabsLayout title="Teams Stats" secondary={<DateFilter />}>
				<ResizablePanelGroup direction="horizontal">
					<ResizablePanel defaultSize={100} minSize={isMobile ? 100 : 40}>
						<div className="overflow-hidden rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Stats</TableHead>
										{teamStats.map(({ teamId }, index) => (
											<TableHead key={index}>{teamId}</TableHead>
										))}
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell>Matches Played</TableCell>
										{teamStats.map(({ totalMatches }, index) => (
											<TableCell key={index}>{totalMatches}</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell>Matches Won</TableCell>
										{teamStats.map(({ wonMatches }, index) => (
											<TableCell key={index}>{wonMatches}</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell>Win Percentage</TableCell>
										{teamStats.map(({ winPercent }, index) => (
											<TableCell key={index}>{winPercent}%</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell>Team All-Out</TableCell>
										{teamStats.map(({ totalAllOuts }, index) => (
											<TableCell key={index}>{totalAllOuts}</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell>Total Runs Scored</TableCell>
										{teamStats.map(({ totalRuns }, index) => (
											<TableCell key={index}>{totalRuns}</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell>Total Balls Played</TableCell>
										{teamStats.map(({ totalBalls }, index) => (
											<TableCell key={index}>{totalBalls}</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell>Total Wickets Fallen</TableCell>
										{teamStats.map(({ totalWickets }, index) => (
											<TableCell key={index}>{totalWickets}</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell>Strike Rate</TableCell>
										{teamStats.map(({ strikeRate }, index) => (
											<TableCell key={index}>{strikeRate.toFixed(2)}</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell>Highest Score</TableCell>
										{teamStats.map(({ highestScore }, index) => (
											<TableCell key={index}>{highestScore}</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell>Lowest Score</TableCell>
										{teamStats.map(({ lowestScore }, index) => (
											<TableCell key={index}>{lowestScore}</TableCell>
										))}
									</TableRow>
								</TableBody>
							</Table>
						</div>
					</ResizablePanel>
					<ResizableHandle />
					<ResizablePanel defaultSize={0}>
						<div />
					</ResizablePanel>
				</ResizablePanelGroup>
			</TabsLayout>
		);
	},
});
