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
import { Classes } from '@/types/opening-program';
import { classColumns } from './classColumn';

type Props = {
  data: Classes[];
  columns: ColumnDef<Classes>[];
};


export default function ClassDataTable1({ data }: Props) {
  const [search, setSearch] = useState('');
  const [filterShift, setFilterShift] = useState('all');
  const [filterInstructor, setFilterInstructor] = useState('all');
  const [filterRoom, setFilterRoom] = useState('all');

  const filteredData = useMemo(() => {
    return data.filter((cls) => {
      const matchesSearch = cls.title.toLowerCase().includes(search.toLowerCase());
      const matchesShift = filterShift === 'all' || cls.shift === filterShift;
      const matchesInstructor = filterInstructor === 'all' || cls.instructor === filterInstructor;
      const matchesRoom = filterRoom === 'all' || cls.room === filterRoom;
      return matchesSearch && matchesShift && matchesInstructor && matchesRoom;
    });
  }, [data, search, filterShift, filterInstructor,filterRoom]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: filteredData,
    columns: classColumns,
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
      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <Input
          placeholder="Search course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-52"
        />

        <Select onValueChange={setFilterShift}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {[...new Set(data.map((cls) => cls.shift))].map((shift) => (
              <SelectItem key={shift} value={shift}>
                {shift}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setFilterInstructor}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select instructor" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {[...new Set(data.map((cls) => cls.instructor))].map((instructor) => (
              <SelectItem key={instructor} value={instructor}>
                {instructor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={setFilterRoom}>
            <SelectTrigger className="w-40">
                <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {[...new Set(data.map((cls) => cls.room))].map((room) => (
              <SelectItem key={room} value={room}>
                {room}
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
                <TableCell colSpan={classColumns.length} className="text-center">
                  No classes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 py-2">
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
