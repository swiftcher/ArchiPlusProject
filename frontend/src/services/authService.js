export async function loginUser(form) {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify(form)
    });

  return res.json();
}