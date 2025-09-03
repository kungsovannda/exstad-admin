"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  onSearch: (value: string) => void;
  onFilterType: (value: string) => void;
  onFilterLevel: (value: string) => void;
};

export default function SearchAndFilter({
  onSearch,
  onFilterType,
  onFilterLevel,
}: Props) {
  const [search, setSearch] = useState("");

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Search */}
      <Input
        placeholder="Search program..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onSearch(e.target.value);
        }}
      />

      {/* Filter by program type */}
      <Select onValueChange={onFilterType}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Short Course">Short Course</SelectItem>
          <SelectItem value="Degree">Degree</SelectItem>
          <SelectItem value="Training">Training</SelectItem>
        </SelectContent>
      </Select>

      {/* Filter by program level */}
      <Select onValueChange={onFilterLevel}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Beginner">Beginner</SelectItem>
          <SelectItem value="Intermediate">Intermediate</SelectItem>
          <SelectItem value="Advanced">Advanced</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
