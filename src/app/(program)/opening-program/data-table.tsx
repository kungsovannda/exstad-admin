'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import { ArrowUpDown } from 'lucide-react';
import { openingProgramType } from '@/types/opening-program';

type Props = {
  data: openingProgramType[];
  columns: ColumnDef<openingProgramType>[];
};

export default function OpeningProgramDataTable({ data, columns }: Props) {
  const [search, setSearch] = useState('');
  const [filterGeneration, setFilterGeneration] = useState('all');
  const [filterProgramType, setFilterProgramType] = useState('all');

  const filteredData = useMemo(() => {
    return data.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesGen = filterGeneration === 'all' || p.generation === Number(filterGeneration);
      const matchesProgramType = filterProgramType === 'all' || p.programType === String(filterProgramType);
      return matchesSearch && matchesGen && matchesProgramType;
    });
  }, [data, search, filterGeneration, filterProgramType]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input placeholder="Search program..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-52" />
        <Select onValueChange={setFilterGeneration}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Select generation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {[...new Set(data.map((p) => p.generation))].map((gen) => (
              <SelectItem key={gen} value={String(gen)}>
                {gen}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setFilterProgramType}>
          <SelectTrigger className="w-fit">
            <SelectValue placeholder="Select program type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {[...new Set(data.map((p) => p.programType))].map((type) => (
              <SelectItem key={type} value={String(type)}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <span
                        className="flex items-center cursor-pointer"
                        onClick={() =>
                          header.column.toggleSorting(
                            header.column.getIsSorted() === 'asc'
                          )
                        }
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <ArrowUpDown className="ml-2 h-3 w-3" />
                      </span>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No programs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

        {/* Pagination */}
        <div className="flex flex-col  md:flex-row items-start md:items-center justify-between gap-2 py-2">
          <div className="text-muted-foreground text-sm">
            {table.getFilteredRowModel().rows.length} row(s) found.
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Rows per page</p>
            <Select
              value={String(table.getState().pagination.pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className="w-20 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
    </div>
  );
}
