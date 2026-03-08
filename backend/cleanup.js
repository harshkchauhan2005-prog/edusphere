const mongoose = require('mongoose');
const User = require('./src/models/User');
const Material = require('./src/models/Material');
const Assignment = require('./src/models/Assignment');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        const matRes = await Material.deleteMany({ fileUrl: /^\/uploads\/edusphere_uploads/ });
        console.log('Deleted materials:', matRes.deletedCount);

        const userRes = await User.updateMany(
            { profilePhoto: /^\/uploads\/edusphere_uploads/ },
            { $set: { profilePhoto: 'no-photo.jpg' } }
        );
        console.log('Reset users:', userRes.modifiedCount);
    } catch (e) { console.error(e); }
    process.exit(0);
});
