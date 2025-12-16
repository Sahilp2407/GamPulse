/**
 * ADMIN AUTHORIZATION MIDDLEWARE
 * Purpose: Ensure only admin users can access certain routes
 * Used after: authMiddleware (requires req.user to be set)
 */
const adminMiddleware = (req, res, next) => {
    try {
        // Check if user exists (should be set by authMiddleware)
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'Authentication required'
            });
        }

        // Check if user has admin role
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied. Admin privileges required.'
            });
        }

        // User is admin, proceed
        next();

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Authorization error'
        });
    }
};

module.exports = adminMiddleware;
