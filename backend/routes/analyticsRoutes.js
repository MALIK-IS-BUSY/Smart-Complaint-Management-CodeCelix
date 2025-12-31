import express from 'express';
import {
  getCategoryStats,
  getMonthlyTrends,
  getFrequentIssues,
  getPriorityStats
} from '../controllers/analyticsController.js';
import { adminProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/category-stats', adminProtect, getCategoryStats);
router.get('/monthly-trends', adminProtect, getMonthlyTrends);
router.get('/frequent-issues', adminProtect, getFrequentIssues);
router.get('/priority-stats', adminProtect, getPriorityStats);

export default router;

