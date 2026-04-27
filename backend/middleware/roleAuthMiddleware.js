const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.U_Role !== 'admin') {
        return res.status(403).json({ message: "Admin only" });
    }

    next();
};

module.exports = isAdmin;