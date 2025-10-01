import type{ Expense } from "../types";

interface Props {
  expenses: Expense[];
}

export default function ExpenseSummary({ expenses }: Props) {
  const total = expenses.reduce((acc, e) => acc + e.amount, 0);
  const monthly = expenses.filter(e => new Date(e.date).getMonth() === new Date().getMonth())
                          .reduce((acc, e) => acc + e.amount, 0);
  const biggest = expenses.reduce((max, e) => (e.amount > max ? e.amount : max), 0);

  return (
    <div className="row mb-4 g-3">
      <div className="col-md-4">
        <div className="card p-3 text-center shadow-sm">
          <h6>{total}</h6>
          <p className="display-6 mb-0">${total.toFixed(2)}</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card p-3 text-center shadow-sm">
          <h6>{monthly}</h6>
          <p className="display-6 mb-0">${monthly.toFixed(2)}</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card p-3 text-center shadow-sm">
          <h6>{biggest}</h6>
          <p className="display-6 mb-0">${biggest.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
