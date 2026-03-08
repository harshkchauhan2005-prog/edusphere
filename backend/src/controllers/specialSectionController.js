const SpecialResource = require('../models/SpecialResource');

// @desc    Upload resource
// @route   POST /api/special-section
// @access  Private/Student
exports.uploadResource = async (req, res, next) => {
    try {
        const { title } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const resource = await SpecialResource.create({
            title,
            semester: req.user.semester,
            fileUrl: `/uploads/${req.file.filename}`,
            uploadedBy: req.user.id
        });

        res.status(201).json({ success: true, data: resource });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get resources for student's semester
// @route   GET /api/special-section
// @access  Private/Student
exports.getResources = async (req, res, next) => {
    try {
        let query = { semester: req.user.semester };

        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }

        const resources = await SpecialResource.find(query).populate('uploadedBy', 'name');

        res.status(200).json({ success: true, count: resources.length, data: resources });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
