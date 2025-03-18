"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@/components/Card";
import PerformanceMetrics from "@/components/PerformanceMetrics";
import PortfolioComposition from "@/components/PortfolioComposition";

interface Investment {
  id: number;
  user_id: string;
  fund_id: number;
  amount: number;
  purchase_date: string;
  isn: string;
  nav_at_investment: number;
  returns_since_investment: number;
}

export default function Dashboard() {
  const [data, setData] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Performance Metrics");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/investment`, // Use Environment Variable
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(response.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch investment data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <p className="text-gray-400 text-center">Loading investments...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (data.length === 0)
    return <p className="text-gray-400 text-center">No investments found.</p>;

  const totalInvestment = data.reduce((sum, item) => sum + item.amount, 0);
  const totalCurrentValue = data.reduce(
    (sum, item) =>
      sum + item.amount * (1 + item.returns_since_investment / 100),
    0
  );
  const totalReturns = totalCurrentValue - totalInvestment;
  const totalReturnsPercentage = (
    (totalReturns / totalInvestment) *
    100
  ).toFixed(2);

  const bestScheme =
    data.length > 0
      ? data.reduce((prev, current) =>
          prev.returns_since_investment > current.returns_since_investment
            ? prev
            : current
        )
      : null;

  const worstScheme =
    data.length > 0
      ? data.reduce((prev, current) =>
          prev.returns_since_investment < current.returns_since_investment
            ? prev
            : current
        )
      : null;

  return (
    <div className="w-full p-6 bg-[#171616] h-[calc(100vh-60px)] text-white overflow-y-scroll min-h-[calc(100vh-60px)]">
      <h1 className="text-2xl font-bold mb-2">Good morning, Aditya!</h1>
      <p className="mb-6">Evaluate Your Investment Performance</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          title="Current Investment Value"
          value={`₹${totalCurrentValue.toLocaleString()}`}
          percentage={parseFloat(totalReturnsPercentage)}
          isPositive={parseFloat(totalReturnsPercentage) >= 0}
        />

        <Card
          title="Initial Investment Value"
          value={`₹${totalInvestment.toLocaleString()}`}
          percentage={0}
          isPositive={true}
        />

        {bestScheme && (
          <Card
            title="Best Performing Scheme"
            value={bestScheme.isn}
            percentage={bestScheme.returns_since_investment}
            isPositive={bestScheme.returns_since_investment >= 0}
          />
        )}

        {worstScheme && (
          <Card
            title="Worst Performing Scheme"
            value={worstScheme.isn}
            percentage={worstScheme.returns_since_investment}
            isPositive={worstScheme.returns_since_investment >= 0}
          />
        )}
      </div>

      <div className="mt-6">
        <div className="flex border-b border-gray-600">
          {["Performance Metrics", "Portfolio Composition"].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 ${
                activeTab === tab
                  ? "border-b-2 border-blue-500"
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {activeTab === "Performance Metrics" ? (
            <PerformanceMetrics />
          ) : (
            <PortfolioComposition />
          )}
        </div>
      </div>
    </div>
  );
}
