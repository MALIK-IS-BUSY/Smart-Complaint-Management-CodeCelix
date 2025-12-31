import express from 'express';
import {
  getCategoryStats,
  getMonthlyTrends,
  getFrequentIssues,
  getPriorityStats,
  getOverallStats,
  getDepartmentStats,
  getUserStats,
  getAssignedUserStats,
  getStatusBreakdown,
  getWeeklyTrends
} from '../controllers/analyticsController.js';
import { adminProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/overall-stats', adminProtect, getOverallStats);
router.get('/category-stats', adminProtect, getCategoryStats);
router.get('/department-stats', adminProtect, getDepartmentStats);
router.get('/user-stats', adminProtect, getUserStats);
router.get('/assigned-user-stats', adminProtect, getAssignedUserStats);
router.get('/status-breakdown', adminProtect, getStatusBreakdown);
router.get('/monthly-trends', adminProtect, getMonthlyTrends);
router.get('/weekly-trends', adminProtect, getWeeklyTrends);
router.get('/frequent-issues', adminProtect, getFrequentIssues);
router.get('/priority-stats', adminProtect, getPriorityStats);

export default router;

