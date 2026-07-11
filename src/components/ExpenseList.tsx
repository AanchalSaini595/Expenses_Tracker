import type { Expense } from "../types";

interface Props {
  expenses: Expense[];
  deleteExpense: (id: number) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: "bg-warning text-dark",
  Transport: "bg-info text-dark",
  Housing: "bg-secondary",
  Utilities: "bg-dark",
  Entertainment: "bg-danger",
  Health: "bg-success",
  Shopping: "bg-primary",
  Education: "bg-purple",
  Other: "bg-light text-dark border",
};

export default function ExpenseList({ expenses, deleteExpense }: Props) {
  if (expenses.length === 0)
    return <p className="text-center text-muted mt-3">No expenses yet.</p>;

  return (
    <div className="card p-4">
      <h4 className="mb-3">📋 Expenses</h4>
      <ul className="list-group list-group-flush">
        {expenses.map(exp => (
          <li key={exp.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{exp.title}</strong>{" "}
              <span className={`badge ${CATEGORY_COLORS[exp.category] ?? "bg-light text-dark border"} ms-2`}>
                {exp.category}
              </span>
              <br />
              <small className="text-muted">{exp.date}</small>
            </div>
            <div>
              <span className="badge bg-primary rounded-pill me-3">${exp.amount.toFixed(2)}</span>
              <button className="btn btn-sm btn-danger" onClick={() => deleteExpense(exp.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
