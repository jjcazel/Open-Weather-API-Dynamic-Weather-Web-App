import { cn } from "@/utils/cn";
import React from "react";
import { IoSearch } from "react-icons/io5";

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function SearchBar({
  className,
  value,
  onChange,
  onSubmit,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(
        "flex relative items-center justify-center h-10",
        className
      )}
    >
      <input
        type="text"
        onChange={onChange}
        value={value}
        placeholder="Search Location..."
        className="px-4 py-2 w-[230px] border border-gray-300 rounded-l-md focus:outline-none 
        focus:border-blue-500 transition-all duration-300 ease-in-out h-full"
      />
      <button
        className="px-4 py-[9px] bg-blue-500 text-white rounded-r-md focus:outline-none 
        hover:bg-blue-600 h-full"
      >
        <IoSearch />
      </button>
    </form>
  );
}
