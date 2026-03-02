"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchBarProps {
  variant?: "hero" | "compact";
}

const EMIRATES = [
  { value: "all", label: "All Emirates" },
  { value: "dubai", label: "Dubai" },
  { value: "abu-dhabi", label: "Abu Dhabi" },
  { value: "sharjah", label: "Sharjah" },
  { value: "ajman", label: "Ajman" },
  { value: "ras-al-khaimah", label: "Ras Al Khaimah" },
  { value: "fujairah", label: "Fujairah" },
  { value: "umm-al-quwain", label: "Umm Al Quwain" },
];

const BOX_SIZES = [
  { value: "any", label: "Any Size" },
  { value: "small", label: "Small (1-3m²)" },
  { value: "medium", label: "Medium (3-6m²)" },
  { value: "large", label: "Large (6-12m²)" },
  { value: "xlarge", label: "XL (12m²+)" },
];

export function SearchBar({ variant = "hero" }: SearchBarProps) {
  const router = useRouter();
  const [emirate, setEmirate] = useState("all");
  const [boxSize, setBoxSize] = useState("any");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (emirate && emirate !== "all") params.set("emirate", emirate);
    if (boxSize && boxSize !== "any") params.set("size", boxSize);
    router.push(`/catalog?${params.toString()}`);
  };

  const isHero = variant === "hero";

  return (
    <div
      className={`${
        isHero
          ? "w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-2"
          : "flex items-center gap-2"
      }`}
    >
      <div
        className={`${
          isHero
            ? "grid grid-cols-1 md:grid-cols-3 gap-3"
            : "flex items-center gap-2 flex-1"
        }`}
      >
        {/* Emirate Select */}
        <div className={isHero ? "" : "flex-1"}>
          <Select value={emirate} onValueChange={setEmirate}>
            <SelectTrigger
              className={`${
                isHero ? "h-12 rounded-xl" : "h-10"
              } border-0 bg-surface focus:ring-2 focus:ring-primary-400/50 transition-shadow`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-text-muted" />
                <SelectValue placeholder="Select Emirate" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {EMIRATES.map((e) => (
                <SelectItem key={e.value} value={e.value}>
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Box Size Select */}
        <div className={isHero ? "" : "flex-1"}>
          <Select value={boxSize} onValueChange={setBoxSize}>
            <SelectTrigger
              className={`${
                isHero ? "h-12 rounded-xl" : "h-10"
              } border-0 bg-surface focus:ring-2 focus:ring-primary-400/50 transition-shadow`}
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-text-muted" />
                <SelectValue placeholder="Box Size" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {BOX_SIZES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className={`${
            isHero ? "h-12 rounded-xl" : "h-10"
          } bg-accent-500 hover:bg-accent-600 hover:shadow-glow-accent active:scale-[0.98] text-white font-semibold transition-all duration-150`}
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
}
