const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: [true, 'Please add a title for the material'],
        trim: true
    },
    fileUrl: {
        type: String,
        required: [true, 'Please provide the file URL or path']
    },
    uploadedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);
