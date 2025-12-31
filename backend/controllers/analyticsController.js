import Complaint from '../models/Complaint.js';
import mongoose from 'mongoose';

export const getCategoryStats = async (req, res) => {
  try {
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'In-Progress'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: categoryStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMonthlyTrends = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const monthlyTrends = await Complaint.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'In-Progress'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      data: monthlyTrends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getFrequentIssues = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const frequentIssues = await Complaint.aggregate([
      {
        $group: {
          _id: {
            category: '$category',
            title: '$title'
          },
          count: { $sum: 1 },
          avgResolutionTime: {
            $avg: {
              $cond: [
                { $ne: ['$resolvedAt', null] },
                {
                  $subtract: ['$resolvedAt', '$createdAt']
                },
                null
              ]
            }
          }
        }
      },
      {
        $match: {
          count: { $gte: 2 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          category: '$_id.category',
          title: '$_id.title',
          count: 1,
          avgResolutionTime: {
            $divide: ['$avgResolutionTime', 1000 * 60 * 60 * 24]
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: frequentIssues
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getPriorityStats = async (req, res) => {
  try {
    const priorityStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'In-Progress'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
          }
        }
      },
      {
        $sort: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 'High'] }, then: 1 },
              { case: { $eq: ['$_id', 'Medium'] }, then: 2 },
              { case: { $eq: ['$_id', 'Low'] }, then: 3 }
            ],
            default: 4
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: priorityStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

