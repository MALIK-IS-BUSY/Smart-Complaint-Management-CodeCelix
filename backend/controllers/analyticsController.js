import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
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

export const getOverallStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const totalUsers = await User.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'In-Progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const closedComplaints = await Complaint.countDocuments({ status: 'Closed' });

    const assignedComplaints = await Complaint.countDocuments({
      'assignedTo.department': { $exists: true, $ne: '' }
    });

    const avgResolutionTime = await Complaint.aggregate([
      {
        $match: {
          resolvedAt: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: {
            $avg: {
              $subtract: ['$resolvedAt', '$createdAt']
            }
          }
        }
      }
    ]);

    const resolutionRate = totalComplaints > 0 
      ? ((resolvedComplaints + closedComplaints) / totalComplaints * 100).toFixed(2)
      : 0;

    res.json({
      success: true,
      data: {
        totalComplaints,
        totalUsers,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        closedComplaints,
        assignedComplaints,
        unassignedComplaints: totalComplaints - assignedComplaints,
        avgResolutionDays: avgResolutionTime[0] 
          ? (avgResolutionTime[0].avgTime / (1000 * 60 * 60 * 24)).toFixed(1)
          : 0,
        resolutionRate: parseFloat(resolutionRate)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getDepartmentStats = async (req, res) => {
  try {
    const departmentStats = await Complaint.aggregate([
      {
        $match: {
          'assignedTo.department': { $exists: true, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$assignedTo.department',
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'In-Progress'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
          },
          closed: {
            $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    res.json({
      success: true,
      data: departmentStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userComplaintStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$user',
          totalComplaints: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          userId: '$_id',
          name: '$userDetails.name',
          email: '$userDetails.email',
          totalComplaints: 1,
          pending: 1,
          resolved: 1
        }
      },
      {
        $sort: { totalComplaints: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      success: true,
      data: userComplaintStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAssignedUserStats = async (req, res) => {
  try {
    const assignedStats = await Complaint.aggregate([
      {
        $match: {
          'assignedTo.staffName': { $exists: true, $ne: '' }
        }
      },
      {
        $group: {
          _id: '$assignedTo.staffName',
          totalAssigned: { $sum: 1 },
          department: { $first: '$assignedTo.department' },
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
        $sort: { totalAssigned: -1 }
      }
    ]);

    res.json({
      success: true,
      data: assignedStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getStatusBreakdown = async (req, res) => {
  try {
    const statusBreakdown = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          percentage: { $sum: 1 }
        }
      },
      {
        $sort: {
          $switch: {
            branches: [
              { case: { $eq: ['$_id', 'Pending'] }, then: 1 },
              { case: { $eq: ['$_id', 'In-Progress'] }, then: 2 },
              { case: { $eq: ['$_id', 'Resolved'] }, then: 3 },
              { case: { $eq: ['$_id', 'Closed'] }, then: 4 }
            ],
            default: 5
          }
        }
      }
    ]);

    const total = statusBreakdown.reduce((sum, item) => sum + item.count, 0);
    const breakdown = statusBreakdown.map(item => ({
      status: item._id,
      count: item.count,
      percentage: total > 0 ? ((item.count / total) * 100).toFixed(2) : 0
    }));

    res.json({
      success: true,
      data: breakdown
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getWeeklyTrends = async (req, res) => {
  try {
    const { weeks = 12 } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (weeks * 7));

    const weeklyTrends = await Complaint.aggregate([
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
            week: { $week: '$createdAt' }
          },
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0] }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.week': 1 }
      }
    ]);

    res.json({
      success: true,
      data: weeklyTrends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

