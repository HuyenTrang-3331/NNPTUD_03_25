const mongoose = require('mongoose');
const User = require('./schemas/users');
const Role = require('./schemas/roles');
const { sendPasswordMail } = require('./utils/mailHandler');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Replace these with actual Mailtrap credentials if you have them
// Or the user can fill them in utils/mailHandler.js

async function importUsers(csvPath) {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/NNPTUD-C4');
        console.log('Connected to MongoDB');

        // 1. Get the 'user' role
        let userRole = await Role.findOne({ name: 'user' });
        if (!userRole) {
            console.log('Role "user" not found. Creating it...');
            userRole = await Role.create({ name: 'user', description: 'Regular user' });
        }

        // 2. Read the CSV file
        // Expected format: username,email
        const csvData = fs.readFileSync(csvPath, 'utf8');
        const lines = csvData.split('\n');
        const header = lines[0].split(',');
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const [username, email] = line.split(',');
            if (!username || !email) continue;

            // 3. Generate random 16-char password
            const password = crypto.randomBytes(8).toString('hex');
            
            // 4. Create user
            try {
                const newUser = new User({
                    username,
                    email,
                    password, // This will be hashed automatically by userSchema.pre('save')
                    role: userRole._id
                });
                await newUser.save();
                console.log(`User ${username} created successfully.`);

                // 5. Send email
                await sendPasswordMail(email, username, password);
                console.log(`Email sent to ${email} with password: ${password}`);
            } catch (err) {
                if (err.code === 11000) {
                    console.error(`User ${username} or email ${email} already exists.`);
                } else {
                    console.error(`Error creating user ${username}:`, err.message);
                }
            }
        }

        console.log('Import finished.');
        await mongoose.connection.close();
    } catch (error) {
        console.error('Import error:', error);
        process.exit(1);
    }
}

const csvFile = process.argv[2] || 'users.csv';
if (!fs.existsSync(csvFile)) {
    console.error(`File ${csvFile} not found.`);
    process.exit(1);
}

importUsers(csvFile);
