import jwt from 'jsonwebtoken';
import User from '../models/user.model';

// Protect routes - verify JWT token
export async function protect(req: any, res: any, next: any) {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route. Please login.'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; username: string; email: string; iat: number; exp: number };

        // Get user from token
        req.user = await User.findByPk(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // if (!req.user.isActive) {
        //     return res.status(401).json({
        //         success: false,
        //         message: 'User account is deactivated'
        //     });
        // }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route. Invalid token.'
        });
    }
}

// Authorize based on roles
export function authorize(...roles: any) {
    return (req: any, res: any, next: any) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
}