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
  percentage: number | string;
  isPositive: boolean;
}) {
  return (
    <div className="bg-[#12283f] p-4 rounded-xl  flex flex-col justify-between min-w-[250px] gap-2">
      <div className="flex flex-row justify-between items-center">
        <div className="text-white test-l text-wrap border-l-2 border-[#88bacc] px-[15px]">
          {title.split(" ").length > 1 ? (
            <>
              <span>{title.split(" ")[0]}</span>
              <span className="block">
                {title.split(" ").slice(1).join(" ")}
              </span>
            </>
          ) : (
            <span>{title}</span>
          )}
        </div>
        <div
          className={`flex flex-col items-center text-m mt-2 pr-[10px] ${
            isPositive ? "text-[#589e63]" : "text-red-500"
          }`}
        >
          <div className="flex flex-row items-center ">
            {isPositive ? (
              <ArrowUpRight size={20} />
            ) : (
              <ArrowDownRight size={20} />
            )}
            <span className="ml-1">{percentage}%</span>
          </div>
        </div>
      </div>
      <p className="text-l text-white px-[15px] mt-4">{value}</p>
    </div>
  );
}
