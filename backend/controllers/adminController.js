import Complaint from '../models/Complaint.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In-Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const closed = await Complaint.countDocuments({ status: 'Closed' });

    const recentComplaints = await Complaint.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        resolved,
        closed,
        recentComplaints
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const assignComplaint = async (req, res) => {
  try {
    const { department, userId } = req.body;

    if (!department) {
      return res.status(400).json({
        success: false,
        message: 'Department is required'
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    let staffName = null;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        staffName = user.name;
      } else {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
    }

    complaint.assignedTo = {
      department: department,
      staffName: staffName || complaint.assignedTo?.staffName
    };

    if (complaint.status === 'Pending') {
      complaint.status = 'In-Progress';
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('user', 'name email phone');

    res.json({
      success: true,
      data: updatedComplaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email phone').sort({ name: 1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const respondToComplaint = async (req, res) => {
  try {
    const { adminResponse } = req.body;

    if (!adminResponse) {
      return res.status(400).json({
        success: false,
        message: 'Admin response is required'
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.adminResponse = adminResponse;

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('user', 'name email phone');

    res.json({
      success: true,
      data: updatedComplaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

