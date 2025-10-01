"use client";
import React from "react";
import { Table } from "@tanstack/react-table";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  placeholder?: string;
}

export function DataTableToolbar<TData>({ table, placeholder = "Enter title" }: DataTableToolbarProps<TData>) {
  return (
    <div className="p-0 w-64">
      <input
        type="text"
        value={table.getState().globalFilter ?? ""}
        onChange={e => table.setGlobalFilter(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 rounded-md bg-accent border border-muted text-sm focus:outline-none"
      />
    </div>
  );
}