const User = require('../models/User');
const Department = require('../models/Department');
const Subject = require('../models/Subject');
const Course = require('../models/Course');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().populate('department', 'name');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:userId/status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.isActive = req.body.isActive;
        await user.save();

        res.status(200).json({ success: true, data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Manage Departments (Create & Get)
// @route   POST & GET /api/admin/departments
// @access  Private/Admin
exports.createDepartment = async (req, res, next) => {
    try {
        const dept = await Department.create(req.body);
        res.status(201).json({ success: true, data: dept });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
exports.getDepartments = async (req, res, next) => {
    try {
        const depts = await Department.find();
        res.status(200).json({ success: true, data: depts });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteDepartment = async (req, res, next) => {
    try {
        const dept = await Department.findById(req.params.id);
        if (!dept) {
            return res.status(404).json({ success: false, message: 'Department not found' });
        }

        const subjects = await Subject.find({ departmentId: req.params.id });
        if (subjects.length > 0) {
            return res.status(400).json({ success: false, message: 'Cannot delete department with assigned subjects' });
        }

        await Department.deleteOne({ _id: req.params.id });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Manage Subjects (Create & Get)
// @route   POST & GET /api/admin/subjects
// @access  Private/Admin
exports.createSubject = async (req, res, next) => {
    try {
        const subject = await Subject.create(req.body);
        res.status(201).json({ success: true, data: subject });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
exports.getSubjects = async (req, res, next) => {
    try {
        const subjects = await Subject.find().populate('departmentId', 'name').populate('assignedFaculty', 'name');
        res.status(200).json({ success: true, data: subjects });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

exports.deleteSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ success: false, message: 'Subject not found' });
        }

        const courses = await Course.find({ subject: req.params.id });
        if (courses.length > 0) {
            return res.status(400).json({ success: false, message: 'Cannot delete subject with active courses' });
        }

        await Subject.deleteOne({ _id: req.params.id });
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get basic system metrics
// @route   GET /api/admin/metrics
// @access  Private/Admin
exports.getMetrics = async (req, res, next) => {
    try {
        const usersCount = await User.countDocuments();
        const coursesCount = await Course.countDocuments();

        // Get user distribution by role
        const roleDistribution = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // Get course distribution by subject
        const courseDistributionRaw = await Course.aggregate([
            { $group: { _id: '$subject', count: { $sum: 1 } } }
        ]);

        // Populate subject names for the chart
        await Subject.populate(courseDistributionRaw, { path: '_id', select: 'name' });
        const courseDistribution = courseDistributionRaw.map(c => ({
            subject: c._id ? c._id.name : 'Unassigned',
            count: c.count
        }));

        res.status(200).json({
            success: true,
            data: {
                usersCount,
                coursesCount,
                roleDistribution: roleDistribution.map(r => ({ name: r._id, value: r.count })),
                courseDistribution
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get all courses across platform
// @route   GET /api/admin/courses
// @access  Private/Admin
exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find()
            .populate('facultyId', 'name email profilePhoto')
            .populate({
                path: 'subject',
                select: 'name code departmentId',
                populate: { path: 'departmentId', select: 'name code' }
            });
        res.status(200).json({ success: true, data: courses });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
