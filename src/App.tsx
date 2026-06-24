import { useState, useEffect } from "react";
import axios from "axios";
import AddExpense from "./components/AddExpenses.tsx";
import ExpenseList from "./components/ExpenseList.tsx";
import ExpenseSummary from "./components/ExpenseSummary.tsx";
import type{ Expense } from "./types";


export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("https://expenses-tracker-backend-2i08.onrender.com/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const addExpense = async (expense: Omit<Expense, "id">) => {
    try {
      await axios.post("https://expenses-tracker-backend-2i08.onrender.com/expenses", expense);
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

const deleteExpense = async (id: number) => {
  console.log("Deleting expense with id:", id); // 👈 debug
  try {
    await axios.delete(`https://expenses-tracker-backend-2i08.onrender.com/expenses${id}`);
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  } catch (error) {
    console.error("Error deleting expense:", error);
  }
};


  return (
    <div className="container my-5">
      <h1 className="text-center text-primary mb-5">💰 Expense Control</h1>
      <AddExpense addExpense={addExpense} />
      <ExpenseSummary expenses={expenses} />
      <ExpenseList expenses={expenses} deleteExpense={deleteExpense} />
    </div>
  );
}
