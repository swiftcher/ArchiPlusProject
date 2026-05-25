
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import "./myprofile.css";


export default function MyProfile() {
    
const { user } = useContext(AuthContext);


const [userchanges, setUserchanges] = useState(() => ({
  name: user?.name || "",
  lastName: user?.lastName || "",
  email: user?.email || "",
  password: "",
  confirmPassword: ""
}));



  const [activeTab, setActiveTab] = useState("profile");

  const handleChange = (e) => {
    setUserchanges({ ...userchanges, [e.target.name]: e.target.value });
  };


  const handleSave = (e) => {
  e.preventDefault();

  if (userchanges.password || userchanges.confirmPassword) {
    if (userchanges.password !== userchanges.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  }

  console.log("Saved:", userchanges);

  // todo call API here
  alert("Profile updated!");
};

  

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

          <button
            className={activeTab === "settings" ? "active" : ""}
            onClick={() => setActiveTab("settings")}
          >
            Settings
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
                value={userchanges?.name}
                onChange={handleChange}
              />

              <label>Last name</label>
              <input
              type="text"
              name="lastName"
              value={userchanges.lastName}
              onChange={handleChange}
              />


              
            <label>Email</label>
              <input
                type="email"
                value={userchanges?.email}
                disabled
                className="locked-input"
                />

              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter new password"
                onChange={handleChange}
              />
              <label> confirm password</label>
              <input
              type="password"
              name="confirmPassword"
              placeholder="confirm password"
              value={userchanges.confirmPassword}
              onChange={handleChange}
              />

              <button type="submit">Save Changes</button>
            </form>
          </section>
        )}

        {activeTab === "orders" && (
          <section className="profile-card">
            <h2>My Orders</h2>
            <p>No orders yet.</p>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="profile-card">
            <h2>Settings</h2>
            <p>More settings coming soon.</p>
          </section>
        )}

      </main>
    </div>
  );
}