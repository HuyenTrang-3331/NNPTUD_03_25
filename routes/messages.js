const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messages');
const { CheckLogin } = require('../utils/authHandler');
const { uploadFile } = require('../utils/uploadHandler');

// Router GET "/userID" - ( lấy toàn toàn bộ message from: user hiện tại, to :userID và from: userID và to:user hiện tại )
router.get('/:userID', CheckLogin, messageController.getMessagesByUserId);

// Router POST: post nội dung bao gồm:
// - nếu có chứa file thì type là file, text là path dẫn đến file, nếu là text thì type là text và text là nội dung gửi
// - to: userID sẽ gửi đến
router.post('/', CheckLogin, uploadFile.single('file'), messageController.sendMessage);

// Router GET "/" lấy message cuối cùng của mỗi user mà user hiện tại nhắn tin hoặc user khác nhắn cho user hiện tại
router.get('/', CheckLogin, messageController.getLastMessageByUsers);

module.exports = router;
