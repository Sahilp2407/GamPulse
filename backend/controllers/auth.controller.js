const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide name, email, and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'commentator'
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error registering user'
        });
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }

        // Find user and include password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    assignedGames: user.assignedGames
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({
            status: 'error',
            message: error.message || 'Error logging in'
        });
    }
};

/**
 * ADMIN LOGIN (HARDCODED FOR EXAM/DEMO)
 * POST /api/auth/admin-login
 * 
 * Purpose: Simple admin authentication for exam project
 * Credentials: admin@gamepulse.com / admin123
 * 
 * Why hardcoded?
 * - Exam/demo projects don't need complex user management
 * - Easy to test and demonstrate
 * - Focuses on JWT and authorization concepts
 * - Real projects would use database with hashed passwords
 */
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide email and password'
            });
        }

        // HARDCODED ADMIN CREDENTIALS (For Exam/Demo Only)
        const ADMIN_EMAIL = 'admin@gamepulse.com';
        const ADMIN_PASSWORD = 'admin123';

        // Trim whitespace from inputs
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        console.log('🔐 Admin login attempt:', {
            received: { email: trimmedEmail, password: trimmedPassword },
            expected: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD }
        });

        // Check credentials
        if (trimmedEmail !== ADMIN_EMAIL || trimmedPassword !== ADMIN_PASSWORD) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid admin credentials'
            });
        }

        // Generate JWT token with admin role
        const token = jwt.sign(
            {
                id: 'admin-1',
                role: 'admin',
                email: ADMIN_EMAIL
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.status(200).json({
            status: 'success',
            message: 'Admin login successful',
            data: {
                user: {
                    id: 'admin-1',
                    email: ADMIN_EMAIL,
                    role: 'admin',
                    name: 'Admin User'
                },
                token
            }
        });

    } catch (error) {
        console.error('Admin login error:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Error during admin login'
        });
    }
};

module.exports = {
    register,
    login,
    adminLogin
};
