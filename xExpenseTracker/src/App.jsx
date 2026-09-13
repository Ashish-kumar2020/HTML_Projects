import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
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
    const savedBalance = localStorage.getItem("walletBalance");

    return savedBalance !== null ? Number(savedBalance) : INITIAL_BALANCE;
  });

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");

    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });

  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  const [incomeAmount, setIncomeAmount] = useState("");

  const [editingExpense, setEditingExpense] = useState(null);

  const [expenseForm, setExpenseForm] = useState({
    title: "",
    price: "",
    category: "",
    date: "",
  });

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

  const handleIncomeSubmit = (event) => {
    event.preventDefault();

    const amount = Number(incomeAmount);

    if (!amount || amount <= 0) {
      alert("Please enter a valid income amount.");
      return;
    }

    setBalance((prevBalance) => prevBalance + amount);

    setIncomeAmount("");
    setShowIncomeModal(false);
  };

  const handleExpenseChange = (event) => {
    const { name, value } = event.target;

    setExpenseForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExpenseSubmit = (event) => {
    event.preventDefault();

    if (!validateExpense()) {
      return;
    }

    const amount = Number(expenseForm.price);

    /*
      When editing:
      Current balance already excludes the old expense.

      Example:
      balance = 4000
      old expense = 100
      new expense = 200

      New balance = 4000 - (200 - 100)
                   = 3900
    */

    if (editingExpense) {
      const difference = amount - Number(editingExpense.price);

      if (difference > balance) {
        alert("You cannot spend more than your available wallet balance.");
        return;
      }

      setBalance((prevBalance) => prevBalance - difference);

      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
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

    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);

    setBalance((prevBalance) => prevBalance - amount);

    closeExpenseModal();
  };

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

  const deleteExpense = (id) => {
    const expenseToDelete = expenses.find((expense) => expense.id === id);

    if (!expenseToDelete) {
      return;
    }

    setBalance((prevBalance) => prevBalance + Number(expenseToDelete.price));

    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id),
    );
  };

  /*
    Data for Pie Chart
  */
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category;

    if (!acc[category]) {
      acc[category] = 0;
    }

    acc[category] += Number(expense.price);

    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  /*
    Data for Bar Chart
  */
  const barData = Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount,
  }));

  return (
    <div className="app">
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
        <section className="top-section">
          <div className="balance-card">
            <p>Wallet Balance</p>

            <h2>Wallet Balance: ${balance.toFixed(2)}</h2>
          </div>

          <div className="summary-card">
            <p>Total Expenses</p>

            <h2>${totalExpenses.toFixed(2)}</h2>
          </div>
        </section>

        <section className="dashboard">
          <div className="chart-card">
            <h2>Expense Summary</h2>

            {pieData.length > 0 ? (
              <div className="chart-container">
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
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="empty-chart">No expenses yet</div>
            )}
          </div>

          <div className="chart-card">
            <h2>Expense Trends</h2>

            {barData.length > 0 ? (
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="category" />

                    <YAxis />

                    <Tooltip />

                    <Bar dataKey="amount" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="empty-chart">No expenses yet</div>
            )}
          </div>
        </section>

        <section className="expenses-section">
          <div className="section-header">
            <h2>Expense History</h2>

            <button
              type="button"
              className="add-small-btn"
              onClick={openAddExpenseModal}
            >
              + Add Expense
            </button>
          </div>

          {expenses.length === 0 ? (
            <div className="empty-expenses">
              <p>No expenses added yet.</p>
            </div>
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
                    <strong>-${Number(expense.price).toFixed(2)}</strong>

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
                min="0"
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
                min="0"
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
                  <option key={category} value={category}>
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
