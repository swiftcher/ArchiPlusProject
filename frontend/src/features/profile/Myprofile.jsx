import "../profile/myprofile.css";
import { useEffect } from "react";
import { useProfileViewModel } from "../profile/ProfileViewModel";
import Order_Carousel from "../../components/OrderStackFolder/Order_Carousel";

export default function MyProfile() {
  
  const {
    form,
    activeTab,
    setActiveTab,
    handleChange,
    handleSave,
    loadOrders,
    orders,
  } = useProfileViewModel();

  useEffect(() => {
    if (activeTab === "orders") {
      loadOrders();
    }
  }, [activeTab]);

  return (
    <div className="profile">
      {/* SIDEBAR */}
      <aside className="profile-sidebar">
        <h2 className="profile-logo">ArchiPlus</h2>

        <nav>
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile Info
          </button>

          <button
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            My Orders
          </button>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="profile-content">
        {activeTab === "profile" && (
          <section className="profile-card">
            <h2>Profile Information</h2>

            <form onSubmit={handleSave} className="profile-form">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
              />

              <label>Last name</label>
              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
              />

              <label>Email</label>
              <input
                type="email"
                value={form.email}
                disabled
                className="locked-input"
              />

              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Enter new password"
              />

              <label>Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />

              <button type="submit">Save Changes</button>
            </form>
          </section>
        )}

        {activeTab === "orders" && (
          <section className="profile-card">
            <h2>My Orders</h2>

            {orders.length === 0 ? (
              <p>No orders yet.</p>
            ) : (
              <Order_Carousel orders={orders} />
            )}
          </section>
        )}
      </main>
    </div>
    
  );
}
