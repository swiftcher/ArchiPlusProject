require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();


app.use(cors());
app.use(express.json());
// to create the url from this user[name]=alex&user[role]=admin to a json format
app.use(express.urlencoded({ extended: true }));

// check route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "ArchiPlus API is running"
    });
});

//public routes 

app.use('/api/auth', require('./routes/publicRoutes/auth'));
app.use('/api/products', require('./routes/publicRoutes/products'));

// logged in users routes 
app.use('/api/cart', require('./routes/users/cart'));
app.use('/api/orders', require('./routes/users/order'));
app.use('/api/shipping', require('./routes/users/shipping'));
app.use('/api/messages', require('./routes/users/messages'));
app.use('/api/feedback', require('./routes/users/feedback'));
app.use('/api/myuser', require('./routes/users/myuser'));


// admin routes
app.use('/api/admin/products', require('./routes/admin/products'));
app.use('/api/admin/orders', require('./routes/admin/orders'));
app.use('/api/admin/feedback', require('./routes/admin/feedback'));
app.use('/api/admin/shipping', require('./routes/admin/shipping'));
app.use('/api/admin/messages', require('./routes/admin/messages'));

app.use('/api/admin/reports', require('./routes/admin/reports'));
app.use('/api/admin/users', require('./routes/admin/mange_users'));
app.use('/api/admin/category', require('./routes/admin/category'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


