import React, { useEffect, useState } from "react";
import axios from "axios";
import SankeyChart from "./Sanky";

interface StockAllocation {
  stock: string;
  amount: number;
  percentage: number;
}

interface SectorAllocation {
  sector: string;
  amount: number;
  percentage: number;
  stocks: StockAllocation[];
}

interface OverlapNode {
  name: string;
}

interface OverlapLink {
  source: number;
  target: number;
  value: number;
}

interface OverlapData {
  nodes: OverlapNode[];
  links: OverlapLink[];
}

const PortfolioComposition = () => {
  const [compositionData, setCompositionData] = useState<SectorAllocation[]>(
    []
  );
  const [overlapData, setOverlapData] = useState<OverlapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compositionRes, overlapRes] = await Promise.all([
          axios.get<SectorAllocation[]>(
            "https://stocks-backend-teal.vercel.app/sector-allocation"
          ),
          axios.get<OverlapData>(
            "https://stocks-backend-teal.vercel.app/overlap"
          ),
        ]);
        setCompositionData(compositionRes.data);
        setOverlapData(overlapRes.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Portfolio Composition</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {compositionData.map((item) => (
          <div
            key={item.sector}
            className="group h-[200px] relative p-4 bg-blue-900 rounded-xl shadow-md flex flex-col justify-between hover:bg-blue-800 transition"
          >
            <div>
              <h3 className="text-sm text-gray-300">{item.sector}</h3>
              <p className="text-md font-semibold">
                ₹{item.amount.toLocaleString()}
              </p>
            </div>
            <p className="text-2xl font-bold mt-2">{item.percentage}%</p>

            <div className="absolute inset-0 bg-blue-950 p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4 grid-auto-flow-dense">
              {item.stocks.map((stock, index) => (
                <div
                  key={index}
                  className="bg-blue-900 p-2 rounded-lg flex items-center justify-center w-full h-full"
                >
                  {stock.stock}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Overlap Analysis</h2>
      <div className="h-[500px] bg-gray-900 p-4 rounded-lg">
        {overlapData && <SankeyChart data={overlapData} />}
      </div>
    </div>
  );
};

export default PortfolioComposition;
