const mongoose = require('mongoose');

const PlatformSettingsSchema = new mongoose.Schema({
    isThemeLocked: {
        type: Boolean,
        default: false
    },
    forcedTheme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light'
    }
}, { timestamps: true });

module.exports = mongoose.model('PlatformSettings', PlatformSettingsSchema);
