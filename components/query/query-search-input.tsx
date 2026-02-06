import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useQueryState } from "nuqs";
import React, { useState } from "react";

interface SearchInputProps {
  queryParamName: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  width?: string;
}

export const QuerySearchInput: React.FC<SearchInputProps> = ({
  queryParamName = "",
  placeholder = "Search...",
  className = "",
  inputClassName = "",
  width = "w-[300px]",
}) => {
  const [urlState, setUrlState] = useQueryState(queryParamName);
  const [inputValue, setInputValue] = useState(urlState || "");

  const handleSearch = () => {
    setUrlState(inputValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleReset = () => {
    setInputValue("");
    setUrlState(null);
  };

  React.useEffect(() => {
    if (!inputValue) {
      setUrlState(null);
    }
  }, [inputValue, setUrlState]);

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        `flex ${width} items-center focus-within:ring-2 focus-within:ring-gray-600  h-10 rounded-lg border bg-white border-neutral-200 p-[0.5px]  ${className}`
      )}
    >
      <Button
        type="submit"
        size="icon"
        className="shrink-0   bg-transparent pointer-events-none  "
      >
        <Search className="shrink-0 text-gray-500" />
      </Button>
      <div className="relative w-full">
        <Input
          placeholder={placeholder}
          required
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={cn(
            `w-full border-none bg-transparent px-0 outline-none placeholder:text-gray-500 font-medium placeholder:font-medium focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ${inputClassName}`
          )}
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute h-8 w-8 right-0 top-1/2  -translate-y-1/2 rounded-full bg-accent text-red-500 hover:text-red-500"
            onClick={handleReset}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};
