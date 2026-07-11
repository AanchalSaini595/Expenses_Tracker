import React, { useState } from "react";
import type { Expense } from "../types";

interface Props {
  addExpense: (expense: Omit<Expense, "id">) => void;
}

const CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Utilities",
  "Entertainment",
  "Health",
  "Shopping",
  "Education",
  "Other",
];

export default function AddExpense({ addExpense }: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !date) return;
    addExpense({ title, amount: Number(amount), date, category });
    setTitle(""); setAmount(""); setDate(""); setCategory(CATEGORIES[0]);
  };

  return (
    <div className="card p-4 mb-5 shadow-sm">
      <h4 className="mb-4">➕ Add New Expense</h4>
      <form onSubmit={handleSubmit}>
        <div className="row g-3 mb-3">
          <div className="col-md-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input id="title" className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label htmlFor="amount" className="form-label">Amount ($)</label>
            <input type="number" id="amount" className="form-control" value={amount} onChange={e => {
              const val = e.target.valueAsNumber;
              setAmount(isNaN(val) ? "" : val);
            }} />
          </div>
          <div className="col-md-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input type="date" id="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label htmlFor="category" className="form-label">Category</label>
            <select id="category" className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-success w-100 mt-3">➕ Add Expense</button>
      </form>
    </div>
  );
}
