import { useState, useEffect } from "react";
import axios from "axios";
import AddExpense from "./components/AddExpense.tsx";
import ExpenseList from "./components/ExpenseList.tsx";
import ExpenseSummary from "./components/ExpenseSummary.tsx";
import ExpenseCharts from "./components/ExpenseCharts.tsx";
import type { Expense, Summary } from "./types";

const API_BASE = "https://expenses-tracker-backend-2i08.onrender.com";




export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API_BASE}/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`${API_BASE}/summary`);
      setSummary(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshAll = () => {
    fetchExpenses();
    fetchSummary();
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const addExpense = async (expense: Omit<Expense, "id">) => {
    try {
      await axios.post(`${API_BASE}/expenses`, expense);
      refreshAll();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteExpense = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/expenses/${id}`);
      setExpenses(prev => prev.filter(exp => exp.id !== id));
      fetchSummary();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center text-primary mb-5"> Expense Control</h1>
      <AddExpense addExpense={addExpense} />
      <ExpenseSummary expenses={expenses} />
      <ExpenseCharts summary={summary} />
      <ExpenseList expenses={expenses} deleteExpense={deleteExpense} />
    </div>
  );
}
