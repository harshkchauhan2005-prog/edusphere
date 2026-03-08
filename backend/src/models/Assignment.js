const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String
    },
    facultyAttachment: {
        type: String
    },
    deadline: {
        type: Date,
        required: [true, 'Please set a deadline']
    },
    submissions: [{
        studentId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        submissionFile: {
            type: String,
            required: true
        },
        submittedAt: {
            type: Date,
            default: Date.now
        },
        grade: {
            type: Number
        },
        feedback: {
            type: String
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema);
