import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Adjust the path to your User model

export const protect = async (req, res, next) => {
    try{
        //extract jwt
        const token = req.cookies.token || req.body.token
                     || req.header("Authorization").replace("Bearer ", ""); 
        //if token missing
        if(!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            })
        }
        
        //verify token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decode);
            req.user = decode;
        }catch(err){
            //verification issue
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            });
        }
        next(); // User is authenticated, proceed to the next middleware or controller
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
};

/*
 * @desc    Middleware to authorize users based on their role
 * @param   {...string} roles - A list of roles that are allowed to access the route
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user is available from the 'protect' middleware which should run first
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next(); // User has the correct role, proceed
    };
};
