import express from 'express';
import {
  registerUser,
  loginUser,
  loginAdmin,
  getCurrentUser,
  getCurrentAdmin
} from '../controllers/authController.js';
import { protect, adminProtect } from '../middleware/auth.js';
import {
  validateUserRegistration,
  validateUserLogin,
  validateAdminLogin
} from '../utils/validators.js';
import { validationResult } from 'express-validator';

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({
      success: false,
      message: firstError.msg || 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

router.post('/register', validateUserRegistration, handleValidationErrors, registerUser);
router.post('/login', validateUserLogin, handleValidationErrors, loginUser);
router.post('/admin/login', validateAdminLogin, handleValidationErrors, loginAdmin);
router.get('/me', protect, getCurrentUser);
router.get('/admin/me', adminProtect, getCurrentAdmin);

export default router;

