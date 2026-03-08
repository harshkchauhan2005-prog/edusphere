const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const User = require('./src/models/User');
const Department = require('./src/models/Department');
const Subject = require('./src/models/Subject');
require('dotenv').config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('Created uploads directory');
} else {
    console.log('Uploads directory already exists');
}

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/edusphere');
        console.log('MongoDB Connected...');

        // 1. Create Admin User
        const adminExists = await User.findOne({ email: 'admin@edusphere.com' });
        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: 'admin@edusphere.com',
                password: 'password123',
                role: 'admin',
                isEmailVerified: true
            });
            console.log('Admin user created (admin@edusphere.com / password123)');
        } else {
            console.log('Admin user already exists');
        }

        // 2. Create Departments
        const deptNames = [
            { name: 'Computer Science', code: 'CS' },
            { name: 'Mechanical Engineering', code: 'ME' },
            { name: 'Business Administration', code: 'BBA' }
        ];
        const depts = {};
        for (const deptData of deptNames) {
            let dept = await Department.findOne({ name: deptData.name });
            if (!dept) {
                dept = await Department.create(deptData);
                console.log(`Created department: ${deptData.name} (${deptData.code})`);
            }
            depts[deptData.name] = dept;
        }

        // 3. Create Default Subjects
        const subjects = [
            { name: 'Introduction to Programming', code: 'CS101', departmentId: depts['Computer Science']._id },
            { name: 'Data Structures', code: 'CS201', departmentId: depts['Computer Science']._id },
            { name: 'Thermodynamics', code: 'ME101', departmentId: depts['Mechanical Engineering']._id },
            { name: 'Fluid Mechanics', code: 'ME201', departmentId: depts['Mechanical Engineering']._id },
            { name: 'Accounting 101', code: 'BBA101', departmentId: depts['Business Administration']._id },
            { name: 'Microeconomics', code: 'BBA201', departmentId: depts['Business Administration']._id }
        ];

        for (const sub of subjects) {
            const subjectExists = await Subject.findOne({ name: sub.name });
            if (!subjectExists) {
                await Subject.create(sub);
                console.log(`Created subject: ${sub.name}`);
            } else {
                console.log(`Subject ${sub.name} already exists`);
            }
        }

        console.log('Database seeding completed successfully');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedDatabase();
