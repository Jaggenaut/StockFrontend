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
    const fetchCompositionData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/sector-allocation`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCompositionData(response.data.data);
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

    const fetchOverlapData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Unauthorized: No token found.");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/overlap`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOverlapData(response.data.data);
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

    fetchCompositionData();
    fetchOverlapData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold mb-4">Portfolio Composition</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid-wrap gap-4">
        {compositionData.map((item) => (
          <div
            key={item.sector}
            className="group h-[200px] min-w-[300px] text-black relative p-4 bg-[#9bb0c7] rounded-xl shadow-md flex flex-col justify-between hover:bg-[#9bb0c7] transition"
          >
            <div className="text-black">
              <h3 className="text-sm text-black">{item.sector}</h3>
              <p className="text-md font-semibold">
                ₹{item.amount.toLocaleString()}
              </p>
            </div>
            <p className="text-2xl font-bold mt-2">{item.percentage}%</p>

            <div
              className="absolute inset-0 bg-black rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 
  grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] 
  grid-rows-2 
  gap-1 overflow-hidden text-sm"
            >
              {item.stocks.map((stock, index) => (
                <div
                  key={index}
                  className="bg-[#718dad] p-4 flex items-center justify-center"
                >
                  {stock.stock}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Overlap Analysis</h2>
      <div className="h-[500px] bg-[#171616] p-4 rounded-lg">
        {overlapData && <SankeyChart data={overlapData} />}
      </div>
    </div>
  );
};

export default PortfolioComposition;
