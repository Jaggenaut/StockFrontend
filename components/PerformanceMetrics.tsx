"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import axios from "axios";

// TypeScript Interfaces
interface PerformanceData {
  date: string;
  value: number;
}

interface Summary {
  totalValue: number;
  totalReturns: number;
  percentageChange: number;
}

export default function PerformanceMetrics() {
  const [data, setData] = useState<PerformanceData[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [period, setPeriod] = useState<string>("1m");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/performance-summary?period=${period}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data.data);
        setSummary({
          totalValue: response.data.total_value,
          totalReturns: response.data.total_returns,
          percentageChange: response.data.percentage_change,
        });
      } catch (err) {
        console.error("Error fetching performance data:", err);
      }
    };

    fetchData();
  }, [period]);

  // Compute min and max values dynamically
  const minY = Math.min(...data.map((d) => d.value));
  const maxY = Math.max(...data.map((d) => d.value));

  const avgYValue = data.reduce((sum, d) => sum + d.value, 0) / data.length;

  const getTickFormatter = (period: string) => {
    let interval = 5; // Default for 1 month
    if (period === "3m") interval = 15;
    else if (period === "6m") interval = 30;
    else if (period === "1y") interval = 35;
    else if (period === "2y") interval = 40;
    else if (period === "max") interval = 45;

    return (value: string, index: number) => {
      if (index % interval === 0) {
        const date = new Date(value);
        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "short" });
        return `${day} ${month}`; // Example: "12 Jan"
      }
      return ""; // Skip this label
    };
  };

  return (
    <div className="p-8 bg-[#1b1a1a] rounded-2xl">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl text-white">Performance Overview</h2>
      </div>

      {/* Summary Card */}
      {summary && (
        <div className="bg-[#2a2a2a] p-6 w-max rounded-lg mt-2">
          {/* Main Investment Value */}
          <p className="text-white text-xl font-bold tracking-wide">
            ₹{summary.totalValue.toLocaleString()}
          </p>

          {/* Subtext for Returns and Percentage */}
          <div className="flex items-center mt-2 gap-2 w-max">
            {/* Icon for Up or Down */}
            {summary.totalReturns >= 0 ? (
              <Image
                src="/arrow.png"
                alt="Logo"
                width={25}
                height={25}
                className="cursor-pointer"
              />
            ) : (
              <span className="text-red-400 text-m">⬇</span>
            )}

            {/* Return Value */}
            <span
              className={`${
                summary.totalReturns >= 0 ? "text-green-400" : "text-red-400"
              } text-s`}
            >
              ₹{summary.totalReturns.toLocaleString()}
            </span>

            {/* Separator */}
            <span className="text-gray-500">|</span>

            {/* Percentage Change */}
            <span
              className={`${
                summary.percentageChange >= 0
                  ? "text-green-400"
                  : "text-red-400"
              } text-s`}
            >
              {summary.percentageChange}%
            </span>
          </div>
        </div>
      )}

      {/* Line Chart */}
      <div className="w-full h-[300px] mt-6">
        <ResponsiveContainer>
          <LineChart data={data}>
            {/* X-Axis */}
            <XAxis
              dataKey="date"
              tickFormatter={getTickFormatter(period)}
              tick={{ fill: "#A1A1AA", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />

            {/* Y-Axis */}
            <YAxis
              domain={[minY, maxY]}
              axisLine={false}
              tickLine={false}
              tick={false}
            />

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#181818",
                borderRadius: "8px",
                border: "1px solid #444",
              }}
              labelStyle={{ color: "#ffffff", fontSize: "14px" }}
              itemStyle={{ color: "#4f46e5", fontSize: "14px" }}
            />
            <ReferenceLine
              y={minY}
              stroke="#333333"
              strokeDasharray="3 3"
              strokeWidth={2}
              strokeOpacity={0.5}
            />
            <ReferenceLine
              y={(avgYValue + minY) / 2}
              stroke="#333333"
              strokeDasharray="3 3"
              strokeWidth={2}
              strokeOpacity={0.5}
            />
            <ReferenceLine
              y={avgYValue}
              stroke="#333333"
              strokeDasharray="3 3"
              strokeWidth={2}
              strokeOpacity={0.5}
            />
            <ReferenceLine
              y={(avgYValue + maxY) / 2}
              stroke="#333333"
              strokeDasharray="3 3"
              strokeWidth={2}
              strokeOpacity={0.5}
            />
            <ReferenceLine
              y={maxY}
              stroke="#333333"
              strokeDasharray="3 3"
              strokeWidth={2}
              strokeOpacity={0.5}
            />

            {/* Line Graph */}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4f46e5"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Period Selector */}
      <div className="flex justify-center gap-3 mt-4">
        {["1m", "3m", "6m", "1y", "2y", "max"].map((p) => (
          <button
            key={p}
            className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
              period === p
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "bg-[#1b1a1a] text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setPeriod(p)}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
