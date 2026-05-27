require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");

const db = require("./db");

const app = express();

// middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ArchiPlus API is running"
    });
});

app.use('/api/auth', require('./routes/publicRoutes/auth'));
app.use('/api/products', require('./routes/publicRoutes/products'));

app.use('/api/cart', require('./routes/users/cart'));
app.use('/api/orders', require('./routes/users/order'));
app.use('/api/shipping', require('./routes/users/shipping'));
app.use('/api/messages', require('./routes/users/messages'));
app.use('/api/feedback', require('./routes/users/feedback'));
app.use('/api/myuser', require('./routes/users/myuser'));

app.use('/api/admin/products', require('./routes/admin/products'));
app.use('/api/admin/orders', require('./routes/admin/orders'));
app.use('/api/admin/feedback', require('./routes/admin/feedback'));
app.use('/api/admin/shipping', require('./routes/admin/shipping'));
app.use('/api/admin/messages', require('./routes/admin/messages'));
app.use('/api/admin/reports', require('./routes/admin/reports'));
app.use('/api/admin/users', require('./routes/admin/mange_users'));
app.use('/api/admin/category', require('./routes/admin/category'));
app.use('/api/users/conversations', require('./routes/users/conversations'));

// create HTTP server (IMPORTANT)
const server = http.createServer(app);

// attach socket
const initSocket = require("./routes/users/messages");
const io = initSocket(server, db);
app.set("io", io);

// start server
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
    console.log("REQUEST:", req.method, req.url);
    next();
});

server.listen(5000,"0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});