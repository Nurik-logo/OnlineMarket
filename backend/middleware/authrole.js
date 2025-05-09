const jwt = require('jsonwebtoken');
const JWT_SECRET = 'secret_code';

exports.checkRole = (requiredRole) => {
    return (req, res, next) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: "Token not found" });
        }
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            console.log('User Role:', req.user.role);
            if (req.user.role !== requiredRole) {
                return res.status(403).json({ error: "Forbidden: You do not have the required role" });
            }
            next();
        } catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
    };
};
