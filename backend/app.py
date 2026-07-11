import sqlite3
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, methods=["GET", "POST", "DELETE", "OPTIONS"], allow_headers=["Content-Type"])

DEFAULT_CATEGORY = "Other"


def get_db():
    conn = sqlite3.connect("expenses.db")
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            amount REAL NOT NULL,
            date TEXT NOT NULL,
            category TEXT NOT NULL DEFAULT 'Other'
        )
    """)
    # Migration-safe: add category column if an older DB already exists without it
    existing_cols = [row["name"] for row in conn.execute("PRAGMA table_info(expenses)")]
    if "category" not in existing_cols:
        conn.execute("ALTER TABLE expenses ADD COLUMN category TEXT NOT NULL DEFAULT 'Other'")
    conn.commit()
    conn.close()


init_db()


@app.route("/expenses", methods=["GET"])
def get_expenses():
    conn = get_db()
    rows = conn.execute("SELECT * FROM expenses ORDER BY date DESC").fetchall()
    conn.close()
    return jsonify([dict(r) for r in rows])


@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.get_json(silent=True) or {}

    title = data.get("title")
    amount = data.get("amount")
    date = data.get("date")
    category = data.get("category") or DEFAULT_CATEGORY

    if not title or not str(title).strip():
        return jsonify({"error": "title is required"}), 400
    if amount is None:
        return jsonify({"error": "amount is required"}), 400
    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return jsonify({"error": "amount must be a number"}), 400
    if amount <= 0:
        return jsonify({"error": "amount must be positive"}), 400
    if not date:
        return jsonify({"error": "date is required"}), 400

    conn = get_db()
    conn.execute(
        "INSERT INTO expenses (title, amount, date, category) VALUES (?, ?, ?, ?)",
        (title.strip(), amount, date, category)
    )
    conn.commit()
    conn.close()
    return jsonify({"message": "Expense added"}), 201


@app.route("/expenses/<int:expense_id>", methods=["OPTIONS"])
def options_expense(expense_id):
    return jsonify({}), 200


@app.route("/expenses/<int:expense_id>", methods=["DELETE"])
def delete_expense(expense_id):
    conn = get_db()
    cur = conn.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    conn.commit()
    conn.close()
    if cur.rowcount == 0:
        return jsonify({"error": "Expense not found"}), 404
    return jsonify({"message": "Deleted"}), 200


@app.route("/summary", methods=["GET"])
def get_summary():
    """Pre-aggregated data for charts: by category and by month."""
    conn = get_db()

    by_category = conn.execute("""
        SELECT category, SUM(amount) as total, COUNT(*) as count
        FROM expenses
        GROUP BY category
        ORDER BY total DESC
    """).fetchall()

    by_month = conn.execute("""
        SELECT strftime('%Y-%m', date) as month, SUM(amount) as total
        FROM expenses
        GROUP BY month
        ORDER BY month ASC
    """).fetchall()

    total_spent = conn.execute("SELECT COALESCE(SUM(amount), 0) as total FROM expenses").fetchone()["total"]

    conn.close()

    return jsonify({
        "by_category": [dict(r) for r in by_category],
        "by_month": [dict(r) for r in by_month],
        "total_spent": total_spent
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
