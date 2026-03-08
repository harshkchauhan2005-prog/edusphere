const Material = require('../models/Material');
const Course = require('../models/Course');

// @desc    Upload material to a course
// @route   POST /api/courses/:courseId/materials
// @access  Private/Faculty
exports.uploadMaterial = async (req, res, next) => {
    try {
        const { courseId } = req.params;
        const { title } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Verify faculty owns the course
        if (course.facultyId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to upload to this course' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const material = await Material.create({
            courseId,
            title,
            fileUrl: req.file.path, // Cloudinary uses req.file.path for the URL
            uploadedBy: req.user.id
        });

        res.status(201).json({
            success: true,
            data: material
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Get materials for a course
// @route   GET /api/courses/:courseId/materials
// @access  Private
exports.getMaterials = async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check enrollment or ownership
        const isFaculty = course.facultyId.toString() === req.user.id;
        const isEnrolled = course.enrolledStudents.includes(req.user.id);

        if (!isFaculty && !isEnrolled && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to view materials' });
        }

        const materials = await Material.find({ courseId });

        res.status(200).json({
            success: true,
            count: materials.length,
            data: materials
        });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
