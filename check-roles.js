const mongoose = require('mongoose');
const Role = require('./schemas/roles');

async function checkRoles() {
    try {
        await mongoose.connect('mongodb://localhost:27017/NNPTUD-C4');
        const roles = await Role.find();
        console.log(JSON.stringify(roles, null, 2));
        await mongoose.connection.close();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkRoles();
