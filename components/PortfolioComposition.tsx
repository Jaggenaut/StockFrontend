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
  total_investment: number;
  investment_percentage: number;
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

// Define types for stock details
interface StockDetails {
  amount: number;
  percentage: number;
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
        const response = await axios.get<{
          data: Record<
            string,
            {
              total_investment: number;
              investment_percentage: number;
              stocks: Record<string, StockDetails>;
            }
          >;
        }>(`${process.env.NEXT_PUBLIC_API_URL}/sector-allocation`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Format response data
        const formattedData: SectorAllocation[] = Object.entries(
          response.data.data
        ).map(([sector, details]) => ({
          sector,
          total_investment: details.total_investment,
          investment_percentage: details.investment_percentage,
          stocks: Object.entries(details.stocks).map(
            ([stockName, stockDetails]) => ({
              stock: stockName,
              amount: stockDetails.amount,
              percentage: stockDetails.percentage,
            })
          ),
        }));

        setCompositionData(formattedData);
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
        const response = await axios.get<{ data: OverlapData }>(
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
      <h2 className="text-2xl my-5">Sector Allocation</h2>
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[400px]">
        {compositionData.map((item, index) => {
          const numStocks = item.stocks.length;
          const halfIndex = Math.ceil(numStocks / 2);
          const upperStocks = item.stocks.slice(0, halfIndex);
          const lowerStocks = item.stocks.slice(halfIndex);

          let gridClasses = "";
          if (index === 0 || index === 1) {
            gridClasses = "col-span-2 row-span-1";
          } else if (index === 2) {
            gridClasses = "col-span-3 row-span-1";
          } else {
            gridClasses = "col-span-1 row-span-1";
          }

          return (
            <div
              key={item.sector}
              className={`relative ${gridClasses} group overflow-hidden`}
            >
              {/* Sector Box (Becomes Transparent on Hover) */}
              <div
                className="absolute inset-0 p-4 text-black bg-[#9bb0c7] rounded-xl shadow-md flex flex-col justify-between 
                transition-opacity duration-300 opacity-100 group-hover:opacity-0"
              >
                <div>
                  <h3 className="text-sm text-black">{item.sector}</h3>
                  <p className="text-md font-semibold">
                    ₹{item.total_investment.toLocaleString()}
                  </p>
                </div>
                <p className="text-2xl font-bold mt-2">
                  {item.investment_percentage}%
                </p>
              </div>

              {/* Stock List (Becomes Visible on Hover) */}
              {/* Stock List (Becomes Visible on Hover) */}
              <div
                className="absolute inset-0 rounded-xl shadow-md flex flex-col gap-1
  transition-opacity duration-300 opacity-0 group-hover:opacity-100 overflow-hidden "
              >
                {item.stocks.length === 1 ? (
                  <>
                    <div
                      key={item.stocks[0].stock}
                      className="bg-[#c6c4d8] h-full w-full text-sm p-3 flex flex-col justify-between"
                    >
                      <div>
                        <h3 className="text-sm text-black">
                          {item.stocks[0].stock}
                        </h3>
                        <p className="text-md text-black font-semibold">
                          ₹{item.stocks[0].amount.toLocaleString()}
                        </p>
                      </div>
                      <p className="text-xl text-black font-bold mt-2">
                        {item.stocks[0].percentage}%
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-1/2 justify-center gap-1 w-full">
                      {upperStocks.map((stock) => (
                        <div
                          key={stock.stock}
                          className="bg-[#c6c4d8] w-full text-sm p-3 flex flex-col justify-between"
                        >
                          <div>
                            <h3 className="text-sm text-black">
                              {stock.stock}
                            </h3>
                            <p className="text-md text-black font-semibold">
                              ₹{stock.amount.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-xl text-black font-bold mt-2">
                            {stock.percentage}%
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="flex h-1/2 justify-center gap-1 w-full">
                      {lowerStocks.map((stock) => (
                        <div
                          key={stock.stock}
                          className="bg-[#c6c4d8] w-full text-sm p-3 flex flex-col justify-between"
                        >
                          <div>
                            <h3 className="text-sm text-black">
                              {stock.stock}
                            </h3>
                            <p className="text-md text-black font-semibold">
                              ₹{stock.amount.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-xl text-black font-bold mt-2">
                            {stock.percentage}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-[#171616] p-6 rounded-lg">
        <h2 className="text-2xl mb-4">Overlap Analysis</h2>
        <div className="text-start text-sm mt-4">
          <p>
            Comparing:{" "}
            <span className="">
              ICICI Prudential Bluechip Fund, HDFC Top 100 Fund, SBI Bluechip
              Fund, Axis Bluechip Fund, and Mirae Asset Large Cap Fund
            </span>
          </p>

          <ul className="list-none mt-2 space-y-1">
            <li>
              • <span className="">9</span> Stocks Overlap across these funds.
            </li>
            <li>
              • <span className="">23%</span> Average Overlap in holdings.
            </li>
            <li>• Click on a fund to highlight its associated stocks.</li>
          </ul>
        </div>

        <div className="h-[500px] bg-[#171616] p-4 rounded-lg">
          {overlapData && <SankeyChart data={overlapData} />}
        </div>
      </div>
    </div>
  );
};

export default PortfolioComposition;
