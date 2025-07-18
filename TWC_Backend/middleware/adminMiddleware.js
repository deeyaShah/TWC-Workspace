import jwt from 'jsonwebtoken';

const adminMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from headers

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Check if the user role is admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
        req.userId = decoded.id; // Attach user ID to request
        next();
    });
};

// module.exports = adminMiddleware;
export default adminMiddleware;