
import React from "react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const productData = [
  { name: "Espresso Machine", sales: 12400 },
  { name: "Coffee Grinder", sales: 9800 },
  { name: "Milk Frother", sales: 7800 },
  { name: "Coffee Beans", sales: 6800 },
  { name: "Cups & Mugs", sales: 5500 }
];

const customerData = [
  { name: "Cafes", sales: 18400 },
  { name: "Restaurants", sales: 12800 },
  { name: "Hotels", sales: 9800 },
  { name: "Offices", sales: 6500 },
  { name: "Retail", sales: 4500 }
];

interface BarChartProps {
  dataType?: "products" | "customers";
}

export const BarChart: React.FC<BarChartProps> = ({ dataType = "products" }) => {
  const chartData = dataType === "products" ? productData : customerData;
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" vertical={false} />
        <XAxis dataKey="name" stroke="#888" />
        <YAxis stroke="#888" />
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px"
          }}
        />
        <Legend />
        <Bar dataKey="sales" fill="hsl(27, 84%, 66%)" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
