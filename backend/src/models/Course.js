const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    courseName: {
        type: String,
        required: [true, 'Please add a course name'],
        trim: true
    },
    subject: {
        type: mongoose.Schema.ObjectId,
        ref: 'Subject',
        required: true
    },
    semester: {
        type: Number,
        required: [true, 'Please specify the semester']
    },
    facultyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    enrolledStudents: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
    announcements: [{
        title: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

// Auto-generate courseId before saving if not present
CourseSchema.pre('validate', function () {
    if (!this.courseId) {
        // Simple generation: e.g., SUBJ-123456
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.courseId = `CRS-${randomString}`;
    }
});

module.exports = mongoose.model('Course', CourseSchema);
