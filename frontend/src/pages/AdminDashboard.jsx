import { useEffect, useMemo, useState, useContext } from "react";

import "./AdminDashboard.css";

import { useAdminDashboardViewModel } from "./useAdminViewModel";

import AdminItemModal from "../pages/AdminItemModal";
import { NotificationContext } from "../context/NotificationContext";

export default function AdminDashboard() {
  const { showNotification } = useContext(NotificationContext);

  const { stats, details, orders, products, loading, loadDashboard } =
    useAdminDashboardViewModel();

  /*
  ============================================================
  DATE FILTER
  ============================================================
  */

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  /*
  ============================================================
  SEARCH / SORT / MODAL
  ============================================================
  */

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [selectedItem, setSelectedItem] = useState(null);

  /*
  LOW STOCK MODAL
  */

  const [showLowStockModal, setShowLowStockModal] = useState(false);

  const [showSort, setShowSort] = useState(false);

  /*
  ============================================================
  TODAY
  ============================================================
  */

  const today = new Date().toISOString().split("T")[0];

  /*
  ============================================================
  INITIAL LOAD
  ============================================================
  */

  useEffect(() => {
    loadDashboard();
  }, []);

  /*
  ============================================================
  APPLY DATE FILTER
  ============================================================
  */

  const applyDateFilter = () => {
    if (from && from > today) {
      showNotification("Future dates are not allowed", "error");

      return;
    }

    if (to && to > today) {
      showNotification("Future dates are not allowed", "error");

      return;
    }

    if (from && to && from > to) {
      showNotification("From date cannot be after To date", "error");

      return;
    }

    /*
    IMPORTANT:

    loadDashboard(from, to) is ONLY for the table data.

    Stats/cards should remain unchanged.
    */

    loadDashboard(from, to);
  };

  /*
  ============================================================
  CLEAR DATE FILTER
  ============================================================
  */

  const clearDateFilter = () => {
    setFrom("");
    setTo("");

    loadDashboard();
  };

  /*
  ============================================================
  LOW STOCK PRODUCTS
  ============================================================
  */

  const lowStockProducts = useMemo(() => {
    return products.filter((product) => Number(product.P_Stock) < 5);
  }, [products]);

  /*
  ============================================================
  COMBINE ORDERS + PRODUCTS
  ============================================================
  */

  const dashboardItems = useMemo(() => {
    /*
    WHEN DATE FILTER IS ACTIVE:

    SHOW ONLY ORDERS.

    The backend/view-model should return the orders
    matching the selected dates.
    */

    if (from || to) {
      return orders.map((order) => ({
        ...order,
        type: "order",
      }));
    }

    /*
    NO DATE FILTER:

    SHOW ORDERS + PRODUCTS.
    */

    const orderItems = orders.map((order) => ({
      ...order,
      type: "order",
    }));

    const productItems = products.map((product) => ({
      ...product,
      type: "product",
    }));

    return [...orderItems, ...productItems];
  }, [orders, products, from, to]);

  /*
  ============================================================
  SEARCH
  ============================================================
  */

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase();

    let result = dashboardItems.filter((item) => {
      if (!value) {
        return true;
      }

      /*
      ORDER SEARCH
      */

      if (item.type === "order") {
        return (
          String(item.O_ID).toLowerCase().includes(value) ||
          item.customer?.name?.toLowerCase().includes(value) ||
          item.customer?.email?.toLowerCase().includes(value)
        );
      }

      /*
      PRODUCT SEARCH
      */

      if (item.type === "product") {
        return (
          item.P_Name?.toLowerCase().includes(value) ||
          String(item.P_ID).toLowerCase().includes(value)
        );
      }

      return false;
    });

    /*
    ============================================================
    SORT
    ============================================================
    */

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return getDate(a) - getDate(b);

        case "newest":
          return getDate(b) - getDate(a);

        case "name":
          return getName(a).localeCompare(getName(b));

        case "name-desc":
          return getName(b).localeCompare(getName(a));

        case "price-high":
          return getPrice(b) - getPrice(a);

        case "price-low":
          return getPrice(a) - getPrice(b);

        default:
          return 0;
      }
    });

    return result;
  }, [dashboardItems, search, sortBy]);

  /*
  ============================================================
  SORT HELPERS
  ============================================================
  */

  function getDate(item) {
    if (item.type === "order") {
      return new Date(item.O_Date).getTime();
    }

    return 0;
  }

  function getName(item) {
    if (item.type === "order") {
      return item.customer?.name || "";
    }

    return item.P_Name || "";
  }

  function getPrice(item) {
    if (item.type === "order") {
      return Number(item.total) || 0;
    }

    return Number(item.P_Price) || 0;
  }

  /*
  ============================================================
  RETURN
  ============================================================
  */

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <p className="dashboard-welcome">Welcome to ArchiPlus administration</p>

      {/* ==================================================
          SMALL STAT CARDS
      ================================================== */}

      <div className="admin-cards">
        <div className="admin-card">
          <span className="admin-card-label">Users</span>

          <strong>{stats?.users ?? 0}</strong>
        </div>

        <div className="admin-card">
          <span className="admin-card-label">Amount of Products</span>

          <strong>{stats?.products ?? 0}</strong>
        </div>

        <div className="admin-card">
          <span className="admin-card-label">Total Orders</span>

          <strong>{stats?.orders ?? 0}</strong>
        </div>

        <div className="admin-card">
          <span className="admin-card-label">Revenue</span>

          <strong>${Number(stats?.revenue ?? 0).toFixed(2)}</strong>
        </div>

        <div className="admin-card">
          <span className="admin-card-label">Pending orders</span>

          <strong>
            {details?.pendingOrders ?? 0}
            {" / "}
            {stats?.orders ?? 0}
          </strong>
        </div>

        <div className="admin-card">
          <span className="admin-card-label">Completed / pending orders</span>

          <strong>
            {details?.completedOrders ?? 0}
            {" / "}
            {details?.pendingOrders ?? 0}
          </strong>
        </div>

        {/* ==================================================
            LOW STOCK CARD
        ================================================== */}

        <div
          className="admin-card low-stock-card"
          onClick={() => setShowLowStockModal(true)}
        >
          <span className="admin-card-label">Low Physical Stock</span>

          <strong>{details?.lowStockProducts ?? 0}</strong>

          <small className="admin-card-preview">
            Physical stock below 5 units
          </small>
        </div>
      </div>

      {/* ==================================================
          DATE FILTER
      ================================================== */}

      <div className="dashboard-date-filter">
        <div className="dashboard-date-field">
          <label>From</label>

          <input
            type="date"
            max={today}
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
        </div>

        <div className="dashboard-date-field">
          <label>To</label>

          <input
            type="date"
            max={today}
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </div>

        <button className="dashboard-filter-button" onClick={applyDateFilter}>
          Apply Dates
        </button>

        <button className="dashboard-clear-button" onClick={clearDateFilter}>
          Clear
        </button>
      </div>

      {/* ==================================================
          MAIN TABLE
      ================================================== */}

      <div className="admin-items-panel">
        <div className="admin-items-header">
          <div>
            <h2>{from || to ? "Orders" : "Orders & Products"}</h2>

            <p>
              {from || to
                ? "Orders within the selected date range"
                : "Search and manage your store data"}
            </p>
          </div>

          {/* SEARCH + SORT */}

          <div className="admin-tools">
            <input
              type="text"
              placeholder={
                from || to
                  ? "Search order ID..."
                  : "Search product name or order ID..."
              }
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="admin-search"
            />

            <div className="sort-wrapper">
              <button
                className="sort-button"
                onClick={() => setShowSort((previous) => !previous)}
              >
                ☰
              </button>

              {showSort && (
                <div className="sort-menu">
                  <button
                    onClick={() => {
                      setSortBy("newest");
                      setShowSort(false);
                    }}
                  >
                    Newest first
                  </button>

                  <button
                    onClick={() => {
                      setSortBy("oldest");
                      setShowSort(false);
                    }}
                  >
                    Oldest first
                  </button>

                  <button
                    onClick={() => {
                      setSortBy("name");
                      setShowSort(false);
                    }}
                  >
                    Name A-Z
                  </button>

                  <button
                    onClick={() => {
                      setSortBy("name-desc");
                      setShowSort(false);
                    }}
                  >
                    Name Z-A
                  </button>

                  <button
                    onClick={() => {
                      setSortBy("price-high");
                      setShowSort(false);
                    }}
                  >
                    Price high-low
                  </button>

                  <button
                    onClick={() => {
                      setSortBy("price-low");
                      setShowSort(false);
                    }}
                  >
                    Price low-high
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="admin-table">
          <div className="admin-table-head">
            <span>Type</span>

            <span>ID</span>

            <span>Name / Customer</span>

            <span>Status</span>

            <span>Date / Price</span>
          </div>

          <div className="admin-table-body">
            {loading ? (
              <div className="admin-empty">Loading...</div>
            ) : filteredItems.length === 0 ? (
              <div className="admin-empty">No results found.</div>
            ) : (
              filteredItems.map((item) => (
                <div
                  className="admin-table-row"
                  key={`${item.type}-${
                    item.type === "order" ? item.O_ID : item.P_ID
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  {/* TYPE */}

                  <span>
                    <span
                      className={
                        item.type === "order"
                          ? "type-badge order"
                          : "type-badge product"
                      }
                    >
                      {item.type === "order" ? "Order" : "Product"}
                    </span>
                  </span>

                  {/* ID */}

                  <span>#{item.type === "order" ? item.O_ID : item.P_ID}</span>

                  {/* NAME */}

                  <span>
                    {item.type === "order" ? (
                      <div>
                        <strong>{item.customer?.name}</strong>

                        <small>{item.customer?.email}</small>
                      </div>
                    ) : (
                      <div>
                        <strong>{item.P_Name}</strong>

                        <small>{item.Cat_Name}</small>
                      </div>
                    )}
                  </span>

                  {/* STATUS */}

                  <span>
                    {item.type === "order" ? (
                      <span
                        className={`status ${item.O_Status?.toLowerCase().replace(
                          /\s+/g,
                          "-",
                        )}`}
                      >
                        {item.O_Status}
                      </span>
                    ) : (
                      <span
                        className={
                          Number(item.P_Stock) <= 5 ? "stock-low" : "stock-ok"
                        }
                      >
                        {item.P_Stock} in stock
                      </span>
                    )}
                  </span>

                  {/* DATE / PRICE */}

                  <span>
                    {item.type === "order" ? (
                      <div>
                        <strong>${Number(item.total).toFixed(2)}</strong>

                        <small>
                          {new Date(item.O_Date).toLocaleDateString()}
                        </small>
                      </div>
                    ) : (
                      <div>
                        <strong>${Number(item.P_Price).toFixed(2)}</strong>

                        <small>Product</small>
                      </div>
                    )}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ==================================================
          SINGLE ITEM MODAL
      ================================================== */}

      {selectedItem && (
        <AdminItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* ==================================================
          LOW STOCK MODAL
      ================================================== */}

      {showLowStockModal && (
        <AdminItemModal
          lowStockProducts={lowStockProducts}
          onClose={() => setShowLowStockModal(false)}
        />
      )}
    </div>
  );
}
