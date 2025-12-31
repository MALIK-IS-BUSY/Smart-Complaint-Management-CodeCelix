import Complaint from '../models/Complaint.js';

export const submitComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    const complaint = await Complaint.create({
      user: req.user._id,
      title,
      description,
      category,
      priority: priority || 'Medium'
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: populatedComplaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    if (complaint.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this complaint'
      });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const complaints = await Complaint.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(query);

    res.json({
      success: true,
      count: complaints.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getComplaintByIdAdmin = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email phone');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateComplaint = async (req, res) => {
  try {
    const { status, assignedTo, adminResponse } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    if (status) {
      complaint.status = status;
      if (status === 'Resolved' || status === 'Closed') {
        complaint.resolvedAt = new Date();
      }
    }

    if (assignedTo) {
      complaint.assignedTo = {
        department: assignedTo.department || complaint.assignedTo?.department,
        staffName: assignedTo.staffName || complaint.assignedTo?.staffName
      };
    }

    if (adminResponse) {
      complaint.adminResponse = adminResponse;
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

export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

