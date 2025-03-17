"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
      try {
        const response = await axios.get(
          `https://stocks-backend-teal.vercel.app/performance-summary?period=${period}`
        );
        setData(response.data.data);
        setSummary({
          totalValue: response.data.total_value,
          totalReturns: response.data.total_returns,
          percentageChange: response.data.percentage_change,
        });
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };
    fetchData();
  }, [period]);

  return (
    <div className="p-4 bg-gray-900 rounded-2xl shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl text-white">Performance Summary</h2>
        {summary && (
          <div className="bg-gray-800 p-4 rounded-lg mt-2">
            <p className="text-white text-lg">
              ₹{summary.totalValue.toLocaleString()} (
              <span className="text-green-500">
                ₹{summary.totalReturns.toLocaleString()}
              </span>{" "}
              |{" "}
              <span className="text-green-500">
                {summary.percentageChange}%
              </span>
              )
            </p>
          </div>
        )}
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="date" stroke="#8884d8" />
            <YAxis stroke="#8884d8" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-2 mt-4">
        {["1m", "3m", "6m", "1y", "2y", "max"].map((p) => (
          <div
            key={p}
            variant={period === p ? "default" : "outline"}
            onClick={() => setPeriod(p)}
          >
            {p.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}
