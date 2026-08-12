import { useState ,useContext} from "react";
import { useAdminReportsViewModel } from "./useAdminReportViewModel";
import "./AdminReports.css";
import { NotificationContext } from "../context/NotificationContext";

export default function AdminReports() {
  const { showNotification } = useContext(NotificationContext);
  const [reportType, setReportType] = useState("orders");

  const [from, setFrom] = useState("");

  const [to, setTo] = useState("");

  const {
    orders,
    products,
    feedback,

    loadOrdersReport,
    loadProductsReport,
    loadFeedbackReport,
  } = useAdminReportsViewModel();

  const today = new Date().toISOString().split("T")[0];

  const generateReport = async () => {
    if (reportType === "orders") {
      if (from && to && from > to) {
        showNotification("From date cannot be after To date","error");

        return;
      }
    }

    switch (reportType) {
      case "orders":
        await loadOrdersReport(from, to);
        break;

      case "products":
        await loadProductsReport();
        break;

      case "feedback":
        await loadFeedbackReport();
        break;

      default:
        break;
    }
  };

  const downloadCSV = () => {
    let csv = "";

    if (reportType === "orders") {
      csv = "Order ID,Customer,Email,Date,Status,Items,Total\n";

      orders.forEach((order) => {
        csv += `${order.O_ID},
${order.U_Name} ${order.U_LastName},
${order.U_Email},
${new Date(order.O_Date).toLocaleDateString()},
${order.O_Status},
${order.Items},
${order.Total}\n`;
      });
    }

    if (reportType === "products") {
      csv = "Product,Category,Price,Sold\n";

      products.forEach((p) => {
        csv += `${p.P_Name},${p.Cat_Name},${p.P_Price},${p.total_sold}\n`;
      });
    }

    if (reportType === "feedback") {
      csv = "Rating,Total\n";

      feedback.forEach((f) => {
        csv += `${f.Rating},${f.total}\n`;
      });
    }

    const blob = new Blob([csv], { type: "text/csv" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = reportType + ".csv";

    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <>
      
      <div className="admin-reports"></div>
      <div className="admin-reports">
        <h1>Reports Center</h1>

        <div className="report-filter">
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="orders">Orders Report</option>

            <option value="products">Products Report</option>
          </select>

          {reportType === "orders" && (
            <>
              <input
                type="date"
                max={today}
                value={from}
                onChange={(e) => {
                  if (e.target.value > today) {
                    showNotification("Future dates are not allowed","error");

                    return;
                  }

                  setFrom(e.target.value);
                }}
              />

              <input
                type="date"
                max={today}
                value={to}
                onChange={(e) => {
                  if (e.target.value > today) {
                    showNotification("Future dates are not allowed","error");

                    return;
                  }

                  setTo(e.target.value);
                }}
              />
            </>
          )}

          <button onClick={generateReport}>Generate Report</button>
        </div>

        {reportType === "orders" && (
          <table>
            <thead>
              <tr>
                <th>Order</th>

                <th>Customer</th>

                <th>Email</th>

                <th>Status</th>

                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.O_ID}>
                  <td>{order.O_ID}</td>

                  <td>
                    {order.U_Name} {order.U_LastName}
                  </td>

                  <td>{order.U_Email}</td>

                  <td>{order.O_Status}</td>

                  <td>${order.Total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === "products" && (
          <table>
            <thead>
              <tr>
                <th>Product</th>

                <th>Category</th>

                <th>Price</th>

                <th>Sold</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.P_ID}>
                  <td>{p.P_Name}</td>

                  <td>{p.Cat_Name}</td>

                  <td>${p.P_Price}</td>

                  <td>{p.total_sold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === "shipping" && (
          <table>
            <thead>
              <tr>
                <th>Status</th>

                <th>Total</th>
              </tr>
            </thead>
          </table>
        )}

        {reportType === "feedback" && (
          <table>
            <thead>
              <tr>
                <th>Rating</th>

                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {feedback.map((f) => (
                <tr key={f.Rating}>
                  <td>{f.Rating}</td>

                  <td>{f.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button className="download-btn" onClick={downloadCSV}>
          Download CSV
        </button>
      </div>
    </>
  );
}
