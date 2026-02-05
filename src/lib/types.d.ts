export type BattingStats = {
	player: string;
	innings: number;
	runs: number;
	balls: number;
	highest_score: number;
	not_outs: number;
	strike_rate: number;
	average: number;
	fours: number;
	sixes: number;
	ducks: number;
	fifties: number;
	hundreds: number;
};

export type BowlingStats = {
	player: string;
	innings: number;
	runs: number;
	wickets: number;
	balls: number;
	economy: number;
	average: number;
	dots: number;
	wides: number;
	no_balls: number;
	"2fr": number;
	"3fr": number;
};

export type FieldingStats = {
	player: string;
	innings: number;
	catches: number;
	runOuts: number;
};

export type ManOfMatchStats = {
	player: string;
	count: number;
};
