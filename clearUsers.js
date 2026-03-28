const mongoose = require('mongoose');
const User = require('./schemas/users');

async function clearTestUsers() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/NNPTUD-C4');
        const result = await User.deleteMany({
            username: { $in: ['nguyenvana', 'tranvanb', 'lethic'] }
        });
        console.log(`Đã xóa ${result.deletedCount} user cũ.`);
        await mongoose.connection.close();
    } catch (error) {
        console.error(error);
    }
}
clearTestUsers();
