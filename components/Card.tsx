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
    <div className="bg-blue-900 p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm text-gray-300">{title}</h2>
        <div
          className={`flex items-center text-sm ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight size={16} />
          ) : (
            <ArrowDownRight size={16} />
          )}
          <span>{percentage}%</span>
        </div>
      </div>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
