import express from 'express';
import {
  getDashboardStats,
  assignComplaint,
  respondToComplaint,
  getAllUsers
} from '../controllers/adminController.js';
import {
  getAllComplaints,
  getComplaintByIdAdmin,
  updateComplaint,
  deleteComplaint
} from '../controllers/complaintController.js';
import { adminProtect } from '../middleware/auth.js';
import { validateComplaintUpdate } from '../utils/validators.js';
import { validationResult } from 'express-validator';

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

router.get('/dashboard', adminProtect, getDashboardStats);
router.get('/complaints', adminProtect, getAllComplaints);
router.get('/complaints/:id', adminProtect, getComplaintByIdAdmin);
router.put('/complaints/:id', adminProtect, validateComplaintUpdate, handleValidationErrors, updateComplaint);
router.delete('/complaints/:id', adminProtect, deleteComplaint);
router.post('/complaints/:id/assign', adminProtect, assignComplaint);
router.post('/complaints/:id/respond', adminProtect, respondToComplaint);
router.get('/users', adminProtect, getAllUsers);

export default router;

