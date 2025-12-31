import express from 'express';
import {
  submitComplaint,
  getUserComplaints,
  getComplaintById
} from '../controllers/complaintController.js';
import { protect } from '../middleware/auth.js';
import { validateComplaint } from '../utils/validators.js';
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

router.post('/', protect, validateComplaint, handleValidationErrors, submitComplaint);
router.get('/', protect, getUserComplaints);
router.get('/:id', protect, getComplaintById);

export default router;

