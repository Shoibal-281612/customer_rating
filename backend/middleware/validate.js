const { body, validationResult, param, query } = require('express-validator');

// Reusable validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// User registration validations
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email address is required'),
  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address cannot exceed 400 characters'),
  body('password')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/)
    .withMessage('Password must be 8-16 characters, include at least one uppercase letter and one special character (!@#$%^&*)'),
  handleValidationErrors
];

// Rating validation
const validateRating = [
  param('storeId').isInt().withMessage('Invalid store ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
  handleValidationErrors
];

// Password change validation (same rules as registration)
const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password required'),
  body('newPassword')
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/)
    .withMessage('New password must be 8-16 chars, one uppercase, one special character'),
  handleValidationErrors
];

// User creation by admin (same as registration but role optional)
const validateUserCreate = [
  body('name').isLength({ min: 20, max: 60 }),
  body('email').isEmail(),
  body('address').isLength({ max: 400 }),
  body('password').matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/),
  body('role').isIn(['admin', 'user', 'store_owner']),
  handleValidationErrors
];

// Store creation validation
const validateStoreCreate = [
  body('name').notEmpty().withMessage('Store name required'),
  body('email').isEmail().withMessage('Valid store email required'),
  body('address').isLength({ max: 400 }),
  body('owner_id').optional().isInt(),
  handleValidationErrors
];

// Query validations for filtering/sorting
const validateQuery = [
  query('sortBy').optional().isIn(['name', 'email', 'address', 'rating', 'createdAt']),
  query('order').optional().isIn(['ASC', 'DESC']),
  handleValidationErrors
];

module.exports = {
  validateRegistration,
  validateRating,
  validatePasswordChange,
  validateUserCreate,
  validateStoreCreate,
  validateQuery
};