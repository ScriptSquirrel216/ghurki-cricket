import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";

import { ResizablePanelGroup, ResizableHandle, ResizablePanel } from "@/components/ui/resizable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useIsMobile } from "@/hooks/use-mobile";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	minSize?: number;
}

export function DataTable<TData, TValue>({ columns, data, minSize = 50 }: DataTableProps<TData, TValue>) {
	const isMobile = useIsMobile();
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<ResizablePanelGroup direction="horizontal">
			<ResizablePanel defaultSize={100} minSize={isMobile ? 100 : minSize}>
				<div className="overflow-hidden rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												<button
													type="button"
													className="cursor-pointer"
													onClick={() => header.column.toggleSorting(true)}
													onDoubleClick={() => header.column.toggleSorting(false)}
												>
													{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
												</button>
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-50 text-center text-sm first:text-center hover:bg-background">
										No results found
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</ResizablePanel>
			<ResizableHandle />
			<ResizablePanel defaultSize={0}>
				<div />
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
