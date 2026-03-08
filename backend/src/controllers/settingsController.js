const PlatformSettings = require('../models/PlatformSettings');

// @desc    Get global platform settings
// @route   GET /api/settings
// @access  Public
exports.getSettings = async (req, res, next) => {
    try {
        let settings = await PlatformSettings.findOne();
        if (!settings) {
            settings = await PlatformSettings.create({});
        }
        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// @desc    Update global platform settings
// @route   PUT /api/settings
// @access  Private/Admin
exports.updateSettings = async (req, res, next) => {
    try {
        let settings = await PlatformSettings.findOne();
        if (!settings) {
            settings = await PlatformSettings.create({});
        }

        settings.isThemeLocked = req.body.isThemeLocked !== undefined ? req.body.isThemeLocked : settings.isThemeLocked;
        settings.forcedTheme = req.body.forcedTheme || settings.forcedTheme;

        await settings.save();

        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};
