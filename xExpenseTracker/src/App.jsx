import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaWifi,
  FaGift,
  FaBriefcase,
  FaShoppingBag,
  FaUtensils,
  FaPlane,
  FaFilm,
  FaBook,
  FaFileInvoiceDollar,
  FaEllipsisH,
} from "react-icons/fa";
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

const categoryColors = [
  "#9c27ff",
  "#ff9700",
  "#ffdc00",
  "#4caf50",
  "#2196f3",
  "#e91e63",
  "#795548",
];

const getCategoryIcon = (category) => {
  switch (category) {
    case "Food":
      return <FaUtensils />;

    case "Travel":
      return <FaPlane />;

    case "Entertainment":
      return <FaGift />;

    case "Shopping":
      return <FaShoppingBag />;

    case "Bills":
      return <FaFileInvoiceDollar />;

    case "Education":
      return <FaBook />;

    default:
      return <FaEllipsisH />;
  }
};

const formatDate = (date) => {
  if (!date) return "";

  const parsedDate = new Date(`${date}T00:00:00`);

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

function App() {
  const [balance, setBalance] = useState(() => {
    const savedBalance = localStorage.getItem("walletBalance");

    return savedBalance !== null ? Number(savedBalance) : INITIAL_BALANCE;
  });

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("expenses");

    if (!savedExpenses) {
      return [];
    }

    try {
      return JSON.parse(savedExpenses);
    } catch {
      return [];
    }
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

  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 3;

  /* ---------------- Persistence ---------------- */

  useEffect(() => {
    localStorage.setItem("walletBalance", String(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  /* ---------------- Calculations ---------------- */

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (total, expense) => total + Number(expense.price),
      0,
    );
  }, [expenses]);

  const categoryTotals = useMemo(() => {
    return expenses.reduce((result, expense) => {
      const category = expense.category;

      if (!result[category]) {
        result[category] = 0;
      }

      result[category] += Number(expense.price);

      return result;
    }, {});
  }, [expenses]);

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const barData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  /* ---------------- Pagination ---------------- */

  const totalPages = Math.ceil(expenses.length / ITEMS_PER_PAGE);

  const paginatedExpenses = expenses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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

  /* ---------------- Expense ---------------- */

  const handleExpenseChange = (event) => {
    const { name, value } = event.target;

    setExpenseForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const validateExpense = () => {
    const newErrors = {};

    if (!expenseForm.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (expenseForm.price === "" || Number(expenseForm.price) <= 0) {
      newErrors.price = "Amount is required";
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

    /* Editing existing expense */

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

    /* Adding new expense */

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

    setCurrentPage(1);

    closeExpenseModal();
  };

  /* ---------------- Expense Modal ---------------- */

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

    if (paginatedExpenses.length === 1 && currentPage > 1) {
      setCurrentPage((current) => current - 1);
    }
  };

  return (
    <div className="app">
      <div className="browser-frame">
        <div className="browser-top">
          <div className="browser-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>

          <div className="browser-camera"></div>
        </div>

        <div className="dashboard">
          {/* Header */}

          <header className="page-header">
            <h1>Expense Tracker</h1>
          </header>

          {/* Top Dashboard */}

          <section className="overview">
            {/* Wallet */}

            <div className="overview-card wallet-card">
              <div>
                <span className="card-title">Wallet Balance:</span>

                <span className="wallet-value">₹{balance}</span>
              </div>

              <button
                type="button"
                className="income-button"
                onClick={() => setShowIncomeModal(true)}
              >
                <FaPlus />
                Add Income
              </button>
            </div>

            {/* Expenses */}

            <div className="overview-card expense-card">
              <div>
                <span className="card-title">Expenses:</span>

                <span className="expense-value">₹{totalExpenses}</span>
              </div>

              <button
                type="button"
                className="add-expense-button"
                onClick={openAddExpenseModal}
              >
                <FaPlus />
                Add Expense
              </button>
            </div>

            {/* Pie Chart */}

            <div className="pie-card">
              {pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={105}
                        label={({ percent }) => `${Math.round(percent * 100)}%`}
                        labelLine={false}
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={categoryColors[index % categoryColors.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip formatter={(value) => `₹${value}`} />

                      <Legend verticalAlign="bottom" height={30} />
                    </PieChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <div className="empty-pie">
                  <div className="empty-pie-circle">₹</div>
                  <p>No expenses yet</p>
                </div>
              )}
            </div>
          </section>

          {/* Bottom Dashboard */}

          <section className="bottom-grid">
            {/* Recent Transactions */}

            <div className="transactions-column">
              <h2>Recent Transactions</h2>

              <div className="transactions-card">
                {expenses.length === 0 ? (
                  <div className="empty-transactions">
                    <p>No transactions yet.</p>
                    <button type="button" onClick={openAddExpenseModal}>
                      Add your first expense
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="transaction-list">
                      {paginatedExpenses.map((expense) => (
                        <div className="transaction" key={expense.id}>
                          <div className="transaction-icon">
                            {getCategoryIcon(expense.category)}
                          </div>

                          <div className="transaction-info">
                            <div className="transaction-title">
                              {expense.title}
                            </div>

                            <div className="transaction-date">
                              {formatDate(expense.date)}
                            </div>
                          </div>

                          <div className="transaction-amount">
                            ₹{expense.price}
                          </div>

                          <button
                            type="button"
                            className="delete-button"
                            aria-label="Delete expense"
                            onClick={() => deleteExpense(expense.id)}
                          >
                            <FaTrash />
                          </button>

                          <button
                            type="button"
                            className="edit-button"
                            aria-label="Edit expense"
                            onClick={() => openEditExpenseModal(expense)}
                          >
                            <FaEdit />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}

                    {totalPages > 0 && (
                      <div className="pagination">
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() =>
                            setCurrentPage((current) => current - 1)
                          }
                        >
                          ←
                        </button>

                        <span className="current-page">{currentPage}</span>

                        <button
                          type="button"
                          disabled={currentPage === totalPages}
                          onClick={() =>
                            setCurrentPage((current) => current + 1)
                          }
                        >
                          →
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Top Expenses */}

            <div className="top-expenses-column">
              <h2>Top Expenses</h2>

              <div className="top-expenses-card">
                {barData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={barData}
                      layout="vertical"
                      margin={{
                        top: 10,
                        right: 20,
                        left: 15,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid horizontal={false} strokeDasharray="3 3" />

                      <XAxis type="number" hide />

                      <YAxis
                        type="category"
                        dataKey="category"
                        width={110}
                        tick={{
                          fill: "#222",
                          fontSize: 14,
                        }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip formatter={(value) => `₹${value}`} />

                      <Bar
                        dataKey="amount"
                        fill="#8984d6"
                        radius={[0, 15, 15, 0]}
                        barSize={26}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-top-expenses">
                    <p>No expense data yet</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Add Income Modal */}

      {showIncomeModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowIncomeModal(false)}
        >
          <div
            className="modal income-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <h2>Add Balance</h2>
            </div>

            <form onSubmit={handleIncomeSubmit}>
              <input
                type="number"
                placeholder="Income Amount"
                value={incomeAmount}
                onChange={(event) => setIncomeAmount(event.target.value)}
                min="1"
              />

              <div className="modal-actions">
                <button type="submit" className="modal-submit">
                  Add Balance
                </button>

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => setShowIncomeModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add/Edit Expense Modal */}

      {showExpenseModal && (
        <div className="modal-overlay" onClick={closeExpenseModal}>
          <div
            className="modal expense-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-heading">
              <h2>{editingExpense ? "Edit Expense" : "Add Expense"}</h2>
            </div>

            <form onSubmit={handleExpenseSubmit}>
              <input
                type="text"
                name="title"
                placeholder="Expense Title"
                value={expenseForm.title}
                onChange={handleExpenseChange}
              />

              {errors.title && (
                <span className="form-error">{errors.title}</span>
              )}

              <input
                type="number"
                name="price"
                placeholder="Expense Amount"
                value={expenseForm.price}
                onChange={handleExpenseChange}
                min="1"
              />

              {errors.price && (
                <span className="form-error">{errors.price}</span>
              )}

              <select
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
                <span className="form-error">{errors.category}</span>
              )}

              <input
                type="date"
                name="date"
                value={expenseForm.date}
                onChange={handleExpenseChange}
              />

              {errors.date && <span className="form-error">{errors.date}</span>}

              <div className="modal-actions">
                <button type="submit" className="modal-submit">
                  {editingExpense ? "Update Expense" : "Add Expense"}
                </button>

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={closeExpenseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
