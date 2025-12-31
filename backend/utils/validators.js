import { body } from 'express-validator';

export const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      if (!value || value === '') {
        return true;
      }
      return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/.test(value);
    })
    .withMessage('Please provide a valid phone number')
];

export const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateAdminLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export const validateComplaint = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5 })
    .withMessage('Title must be at least 5 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),
  body('category')
    .isIn(['Service', 'Technical', 'Staff', 'Delivery', 'Billing', 'Other'])
    .withMessage('Invalid category'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Invalid priority level')
];

export const validateComplaintUpdate = [
  body('status')
    .optional()
    .isIn(['Pending', 'In-Progress', 'Resolved', 'Closed'])
    .withMessage('Invalid status'),
  body('assignedTo.department')
    .optional()
    .trim(),
  body('assignedTo.staffName')
    .optional()
    .trim(),
  body('adminResponse')
    .optional()
    .trim()
];

