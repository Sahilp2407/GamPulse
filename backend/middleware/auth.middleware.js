const jwt = require('jsonwebtoken');

/**
 * AUTH MIDDLEWARE
 * Purpose: Verify JWT token and attach user to request
 * Used for: All protected routes
 */
const authMiddleware = (req, res, next) => {
    try {
        // 1. Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                status: 'error',
                message: 'Access denied. No token provided.'
            });
        }

        // 2. Extract token (format: "Bearer <token>")
        const token = authHeader.split(' ')[1];

        // 3. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach user info to request
        req.user = decoded;

        // 5. Continue to next middleware/controller
        next();

    } catch (error) {
        // Token is invalid or expired
        return res.status(403).json({
            status: 'error',
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authMiddleware;
