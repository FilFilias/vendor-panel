
import React from "react";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

const data = [
  { name: "Completed", value: 540 },
  { name: "Processing", value: 320 },
  { name: "Pending", value: 180 },
  { name: "Cancelled", value: 60 }
];

const COLORS = ["#4ade80", "#3b82f6", "#f59e0b", "#ef4444"];

export const PieChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            borderRadius: "8px"
          }}
        />
        <Legend />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
