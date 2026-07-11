import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import type { Summary } from "../types";

interface Props {
  summary: Summary | null;
}

const COLORS = ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2", "#59a14f", "#edc948", "#b07aa1", "#ff9da7", "#9c755f"];

export default function ExpenseCharts({ summary }: Props) {
  if (!summary || summary.by_category.length === 0) {
    return null;
  }

  return (
    <div className="row mb-5 g-3">
      <div className="col-md-6">
        <div className="card p-3 shadow-sm">
          <h5 className="mb-3">🥧 Spending by Category</h5>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={summary.by_category}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry: { category?: string; total?: number }) =>
                  `${entry.category}: $${(entry.total ?? 0).toFixed(0)}`
                }
              >
                {summary.by_category.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${Number(value ?? 0).toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card p-3 shadow-sm">
          <h5 className="mb-3">📈 Monthly Spending Trend</h5>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={summary.by_month}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value ?? 0).toFixed(2)}`} />
              <Line type="monotone" dataKey="total" stroke="#4e79a7" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
