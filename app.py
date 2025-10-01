import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Create database and table if not exists
conn = sqlite3.connect("expenses.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL
)
""")
conn.commit()

@app.route("/expenses", methods=["GET"])
def get_expenses():
    cursor.execute("SELECT * FROM expenses")
    rows = cursor.fetchall()
    # Convert to list of dicts
    result = [{"id": r[0], "title": r[1], "amount": r[2], "date": r[3]} for r in rows]
    return jsonify(result)

@app.route("/expenses", methods=["POST"])
def add_expense():
    data = request.get_json()
    cursor.execute(
        "INSERT INTO expenses (title, amount, date) VALUES (?, ?, ?)",
        (data["title"], data["amount"], data["date"])
    )
    conn.commit()
    return jsonify({"message": "Expense added"}), 201

@app.route("/expenses/<int:expense_id>", methods=["DELETE"])
def delete_expense(expense_id):
    cursor.execute("DELETE FROM expenses WHERE id = ?", (expense_id,))
    conn.commit()
    return jsonify({"message": "Deleted"}), 200

if __name__ == "__main__":
    app.run(debug=True)

