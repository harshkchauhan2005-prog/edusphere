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
        const deptNames = ['Computer Science', 'Mechanical Engineering', 'Business Administration'];
        const depts = {};
        for (const name of deptNames) {
            let dept = await Department.findOne({ name });
            if (!dept) {
                dept = await Department.create({ name });
                console.log(`Created department: ${name}`);
            }
            depts[name] = dept;
        }

        // 3. Create Default Subjects
        const subjects = [
            { name: 'Introduction to Programming', departmentId: depts['Computer Science']._id },
            { name: 'Data Structures', departmentId: depts['Computer Science']._id },
            { name: 'Thermodynamics', departmentId: depts['Mechanical Engineering']._id },
            { name: 'Fluid Mechanics', departmentId: depts['Mechanical Engineering']._id },
            { name: 'Accounting 101', departmentId: depts['Business Administration']._id },
            { name: 'Microeconomics', departmentId: depts['Business Administration']._id }
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
