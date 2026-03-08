const mongoose = require('mongoose');

const SpecialResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the resource'],
        trim: true
    },
    semester: {
        type: Number,
        required: [true, 'Please specify the semester'],
        index: true
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

module.exports = mongoose.model('SpecialResource', SpecialResourceSchema);
