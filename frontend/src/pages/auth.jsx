import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import apiPublic from "../api/apiPublic";
import Button from "../components/ButtonFolder/Button";
import "./auth.css";
import { NotificationContext } from "../context/NotificationContext";

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });

  const { showNotification } = useContext(NotificationContext);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // =====================
    // REGISTER VALIDATION
    // =====================

    if (isRegister) {
      if (form.name.length > 8) {
        showNotification("First name cannot exceed 8 characters","error");

        return;
      }

      if (form.lastName.length > 8) {
        showNotification("Last name cannot exceed 8 characters","error");

        return;
      }

      if (form.password.length < 5) {
        showNotification("Password must be at least 5 characters","error");

        return;
      }

      if (!/\d/.test(form.password)) {
        showNotification("Password must contain at least one number","error");

        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(form.email)) {
        showNotification("Please enter a valid email","error");

        return;
      }
    }

    try {
      if (isRegister) {
        await apiPublic.post("/auth/register", {
          name: form.name,

          lastName: form.lastName,

          email: form.email,

          password: form.password,
        });

        showNotification("Registered successfully!");

        setIsRegister(false);
      } else {
        const res = await apiPublic.post("/auth/login", {
          email: form.email,

          password: form.password,
        });

        const data = res.data;

        if (data.token) {
          login(data);

          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        }
      }
    } catch (error) {
      console.log("AUTH ERROR:", error);

      showNotification("Email or password are incorrect");
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isRegister ? "Register" : "Login"}</h2>

        <form onSubmit={handleSubmit}>
          {/* NAME (only for register) */}
          {isRegister && (
            <>
              <input
                name="name"
                placeholder="First Name"
                value={form.name}
                onChange={handleChange}
              />

              <input
                name="lastName"
                placeholder="Last Name"
                value={form.LastName}
                onChange={handleChange}
              />
            </>
          )}

          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <Button type="submit" text={isRegister ? "Register" : "Login"} />
        </form>

        <div className="auth-toggle">
          <p className="auth-toggle">
            {" "}
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <span onClick={() => setIsRegister(!isRegister)}>
              {" "}
              {isRegister ? " Login" : " Register"}{" "}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
