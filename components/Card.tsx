"use client";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function Card({
  title,
  value,
  percentage,
  isPositive,
}: {
  title: string;
  value: string;
  percentage: number;
  isPositive: boolean;
}) {
  return (
    <div className="bg-[#12283f] p-6 rounded-xl  flex flex-col justify-between min-w-[250px]">
      <div className="flex flex-row">
        <div className="text-white border-l-2 border-[#88bacc] px-[15px]">
          {title}
        </div>
        <div
          className={`flex flex-col items-center text-sm mt-2 ${
            isPositive ? "text-[#589e63]" : "text-red-500"
          }`}
        >
          <div className="flex flex-row">
            {isPositive ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            <span className="ml-1">{percentage}%</span>
          </div>
          <span className="ml-1 text-xs text-[#589e63]">Inception</span>
        </div>
      </div>
      <p className="text-2xl font-semibold text-white px-[15px] mt-2">
        {value}
      </p>
    </div>
  );
}
