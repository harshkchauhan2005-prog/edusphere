const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a subject name'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Please add a subject code'],
        unique: true,
        trim: true
    },
    departmentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Department',
        required: true
    },
    assignedFaculty: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
});

module.exports = mongoose.model('Subject', SubjectSchema);
