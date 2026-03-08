const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: [true, 'Please add a quiz title'],
        trim: true
    },
    isTimed: {
        type: Boolean,
        default: false
    },
    durationInMinutes: {
        type: Number,
        required: function () { return this.isTimed; }
    },
    questions: [{
        questionText: { type: String, required: true },
        questionType: {
            type: String,
            enum: ['mcq', 'descriptive'],
            default: 'mcq'
        },
        options: [{
            type: String,
            required: function () { return this.questionType === 'mcq'; }
        }],
        correctOptionIndex: {
            type: Number,
            required: function () { return this.questionType === 'mcq'; }
        }
    }],
    results: [{
        studentId: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        score: { type: Number, default: 0 },
        answers: [{
            questionId: mongoose.Schema.ObjectId,
            selectedOptionIndex: Number, // For MCQ
            descriptiveText: String, // For descriptive
            marksAwarded: { type: Number, default: 0 } // For faculty manual grading
        }],
        isGraded: { type: Boolean, default: true }, // False if contains descriptive that needs manual review
        submittedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
