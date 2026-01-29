import { Link } from "@tanstack/react-router";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PlayerAvatarProps extends React.ComponentProps<typeof Avatar> {
	name: string;
	area?: number;
}

export function PlayerAvatar({ name, area = 32, className, ...props }: PlayerAvatarProps) {
	return (
		<Avatar className={cn("size-8", className)} {...props}>
			<AvatarImage src={`/players/${name.toLowerCase()}.png`} width={area} height={area} alt={name} />
			<AvatarFallback asChild>
				<img src="/players/default.png" width={area} height={area} alt={name} />
			</AvatarFallback>
		</Avatar>
	);
}

export function PlayerAvatarCell({ name, area = 28, className, ...props }: PlayerAvatarProps) {
	return (
		<Link
			to="/players/$playerId"
			params={{ playerId: name.toLowerCase() }}
			className={cn("inline-flex items-center gap-2 text-sm", className)}
		>
			<PlayerAvatar name={name} area={area} className="size-6" {...props} />
			<span className="font-medium">{name}</span>
		</Link>
	);
}
