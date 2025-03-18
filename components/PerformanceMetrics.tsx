"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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

  // Function to determine tick interval
  const getTickFormatter = () => {
    let interval = 5;
    if (period === "3m") interval = 10;
    else if (period === "6m") interval = 15;
    else if (period === "1y") interval = 20;
    else if (period === "2y") interval = 30;
    else if (period === "max") interval = 40;

    return (value: string, index: number) => {
      return index % interval === 0 ? value : "";
    };
  };

  // Compute min and max values dynamically
  const minY = Math.min(...data.map((d) => d.value));
  const maxY = Math.max(...data.map((d) => d.value));

  return (
    <div className="p-4 px-16 bg-[#1b1a1a] rounded-2xl shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl text-white">Performance Summary</h2>
      </div>
      {summary ? (
        <div className="bg-[#3d3d3d] p-5 w-1/4 rounded-lg mt-2">
          <p className="text-white text-lg">
            ₹{summary.totalValue.toLocaleString()}
          </p>
          <div>
            <span
              className={`${
                summary.totalReturns >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ₹{summary.totalReturns.toLocaleString()}
            </span>{" "}
            |{" "}
            <span
              className={`${
                summary.percentageChange >= 0
                  ? "text-green-500"
                  : "text-red-500"
              } `}
            >
              {summary.percentageChange}%
            </span>
          </div>
        </div>
      ) : null}
      <div className="w-full h-40 min-h-[300px] mb-5">
        {" "}
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis
              dataKey="date"
              tickFormatter={getTickFormatter()}
              tick={{ fill: "#A1A1AA" }}
              axisLine={false} // Hide X-Axis
              tickLine={false} // Hide tick lines
              // padding={{ left: 20 }}
            />
            <YAxis
              domain={[minY, maxY]} // Set Y-Axis range dynamically
              axisLine={false} // Hide X-Axis
              tickLine={false} // Hide tick lines
              padding={{ bottom: 20 }}
              tick={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                borderRadius: "8px",
                border: "none",
              }}
              labelStyle={{ color: "#ffffff" }}
              itemStyle={{ color: "#4f46e5" }}
            />
            {/* <Legend wrapperStyle={{ color: "#A1A1AA" }} /> */}
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

      <div className="flex justify-center gap-2 mt-3">
        {["1m", "3m", "6m", "1y", "2y", "max"].map((p) => (
          <button
            key={p}
            className={`px-4 py-2 rounded-lg transition-all ${
              period === p
                ? "bg-blue-600 text-white font-semibold scale-105"
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
