import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./App.css";

const INITIAL_BALANCE = 5000;

const categories = [
  "Food",
  "Travel",
  "Entertainment",
  "Shopping",
  "Bills",
  "Education",
  "Other",
];

function App() {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem("walletBalance");

    return saved !== null ? Number(saved) : INITIAL_BALANCE;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");

    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [incomeAmount, setIncomeAmount] = useState("");

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    price: "",
    category: "",
    date: "",
  });

  const [editingExpense, setEditingExpense] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    localStorage.setItem("walletBalance", String(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.price),
    0,
  );

  const categoryTotals = expenses.reduce((result, expense) => {
    const category = expense.category;

    if (!result[category]) {
      result[category] = 0;
    }

    result[category] += Number(expense.price);

    return result;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const barData = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }));

  /* ---------------- Income ---------------- */

  const handleIncomeSubmit = (event) => {
    event.preventDefault();

    const amount = Number(incomeAmount);

    if (!amount || amount <= 0) {
      alert("Please enter a valid income amount.");
      return;
    }

    setBalance((current) => current + amount);

    setIncomeAmount("");
    setShowIncomeModal(false);
  };

  /* ---------------- Expense Form ---------------- */

  const handleExpenseChange = (event) => {
    const { name, value } = event.target;

    setExpenseForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const validateExpense = () => {
    const newErrors = {};

    if (!expenseForm.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (expenseForm.price === "" || Number(expenseForm.price) <= 0) {
      newErrors.price = "Enter a valid amount";
    }

    if (!expenseForm.category) {
      newErrors.category = "Category is required";
    }

    if (!expenseForm.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleExpenseSubmit = (event) => {
    event.preventDefault();

    if (!validateExpense()) {
      return;
    }

    const amount = Number(expenseForm.price);

    /* ---------- EDIT ---------- */

    if (editingExpense) {
      const oldAmount = Number(editingExpense.price);
      const difference = amount - oldAmount;

      if (difference > balance) {
        alert("You cannot spend more than your available wallet balance.");
        return;
      }

      setBalance((current) => current - difference);

      setExpenses((current) =>
        current.map((expense) =>
          expense.id === editingExpense.id
            ? {
                ...expense,
                title: expenseForm.title.trim(),
                price: amount,
                category: expenseForm.category,
                date: expenseForm.date,
              }
            : expense,
        ),
      );

      closeExpenseModal();
      return;
    }

    /* ---------- ADD ---------- */

    if (amount > balance) {
      alert("You cannot spend more than your available wallet balance.");
      return;
    }

    const newExpense = {
      id: Date.now(),
      title: expenseForm.title.trim(),
      price: amount,
      category: expenseForm.category,
      date: expenseForm.date,
    };

    setExpenses((current) => [...current, newExpense]);

    setBalance((current) => current - amount);

    closeExpenseModal();
  };

  /* ---------------- Modals ---------------- */

  const openAddExpenseModal = () => {
    setEditingExpense(null);

    setExpenseForm({
      title: "",
      price: "",
      category: "",
      date: "",
    });

    setErrors({});
    setShowExpenseModal(true);
  };

  const openEditExpenseModal = (expense) => {
    setEditingExpense(expense);

    setExpenseForm({
      title: expense.title,
      price: String(expense.price),
      category: expense.category,
      date: expense.date,
    });

    setErrors({});
    setShowExpenseModal(true);
  };

  const closeExpenseModal = () => {
    setShowExpenseModal(false);
    setEditingExpense(null);

    setExpenseForm({
      title: "",
      price: "",
      category: "",
      date: "",
    });

    setErrors({});
  };

  /* ---------------- Delete ---------------- */

  const deleteExpense = (id) => {
    const expense = expenses.find((item) => item.id === id);

    if (!expense) {
      return;
    }

    setBalance((current) => current + Number(expense.price));

    setExpenses((current) => current.filter((item) => item.id !== id));
  };

  return (
    <div className="app">
      {/* Header */}

      <header className="header">
        <h1>Expense Tracker</h1>

        <div className="header-actions">
          <button
            type="button"
            className="income-btn"
            onClick={() => setShowIncomeModal(true)}
          >
            + Add Income
          </button>

          <button
            type="button"
            className="expense-btn"
            onClick={openAddExpenseModal}
          >
            + Add Expense
          </button>
        </div>
      </header>

      <main className="container">
        {/* Balance Cards */}

        <section className="top-section">
          <div className="balance-card">
            <p>Wallet Balance</p>

            <h2>Wallet Balance: ${balance.toFixed(2)}</h2>
          </div>

          <div className="summary-card">
            <p>Expenses</p>

            <h2>${totalExpenses.toFixed(2)}</h2>
          </div>
        </section>

        {/* Charts */}

        <section className="dashboard">
          <div className="chart-card">
            <h2>Expense Summary</h2>

            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  />

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">No expenses yet</div>
            )}
          </div>

          <div className="chart-card">
            <h2>Expense Trends</h2>

            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="category" />

                  <YAxis />

                  <Tooltip />

                  <Bar dataKey="amount" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-chart">No expenses yet</div>
            )}
          </div>
        </section>

        {/* Transactions */}

        <section className="expenses-section">
          <div className="section-header">
            <h2>Transactions</h2>

            <button
              type="button"
              className="add-small-btn"
              onClick={openAddExpenseModal}
            >
              + Add Expense
            </button>
          </div>

          {expenses.length === 0 ? (
            <div className="empty-expenses">No transactions yet.</div>
          ) : (
            <div className="expense-list">
              {expenses.map((expense) => (
                <div className="expense-item" key={expense.id}>
                  <div className="expense-info">
                    <h3>{expense.title}</h3>

                    <div className="expense-meta">
                      <span>{expense.category}</span>

                      <span>{expense.date}</span>
                    </div>
                  </div>

                  <div className="expense-right">
                    <strong>
                      -$
                      {Number(expense.price).toFixed(2)}
                    </strong>

                    <div className="expense-actions">
                      <button
                        type="button"
                        onClick={() => openEditExpenseModal(expense)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Income Modal */}

      {showIncomeModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowIncomeModal(false)}
        >
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Balance</h2>

              <button
                type="button"
                className="close-btn"
                onClick={() => setShowIncomeModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleIncomeSubmit}>
              <label htmlFor="income">Income Amount</label>

              <input
                id="income"
                type="number"
                placeholder="Income Amount"
                value={incomeAmount}
                onChange={(event) => setIncomeAmount(event.target.value)}
              />

              <button type="submit" className="submit-btn">
                Add Balance
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}

      {showExpenseModal && (
        <div className="modal-overlay" onClick={closeExpenseModal}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>

              <button
                type="button"
                className="close-btn"
                onClick={closeExpenseModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit}>
              <label htmlFor="title">Expense Title</label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="Expense Title"
                value={expenseForm.title}
                onChange={handleExpenseChange}
              />

              {errors.title && <span className="error">{errors.title}</span>}

              <label htmlFor="price">Expense Amount</label>

              <input
                id="price"
                name="price"
                type="number"
                placeholder="Expense Amount"
                value={expenseForm.price}
                onChange={handleExpenseChange}
              />

              {errors.price && <span className="error">{errors.price}</span>}

              <label htmlFor="category">Category</label>

              <select
                id="category"
                name="category"
                value={expenseForm.category}
                onChange={handleExpenseChange}
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option value={category} key={category}>
                    {category}
                  </option>
                ))}
              </select>

              {errors.category && (
                <span className="error">{errors.category}</span>
              )}

              <label htmlFor="date">Date</label>

              <input
                id="date"
                name="date"
                type="date"
                value={expenseForm.date}
                onChange={handleExpenseChange}
              />

              {errors.date && <span className="error">{errors.date}</span>}

              <button type="submit" className="submit-btn">
                {editingExpense ? "Update Expense" : "Add Expense"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
