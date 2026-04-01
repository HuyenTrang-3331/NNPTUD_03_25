const messageModel = require('../schemas/messages');

module.exports = {
    getMessagesByUserId: async function (req, res, next) {
        try {
            const currentUserId = req.user._id;
            const targetUserId = req.params.userID;

            const messages = await messageModel.find({
                $or: [
                    { from: currentUserId, to: targetUserId },
                    { from: targetUserId, to: currentUserId }
                ]
            }).sort({ createdAt: 1 });

            res.send(messages);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    sendMessage: async function (req, res, next) {
        try {
            const currentUserId = req.user._id;
            const { to, text } = req.body;
            let messageContent = {};

            if (req.file) {
                messageContent = {
                    type: 'file',
                    text: req.file.path
                };
            } else {
                messageContent = {
                    type: 'text',
                    text: text
                };
            }

            const newMessage = new messageModel({
                from: currentUserId,
                to: to,
                messageContent: messageContent
            });

            await newMessage.save();
            res.send(newMessage);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    getLastMessageByUsers: async function (req, res, next) {
        try {
            const currentUserId = req.user._id;

            const lastMessages = await messageModel.aggregate([
                {
                    $match: {
                        $or: [
                            { from: currentUserId },
                            { to: currentUserId }
                        ]
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: {
                            $cond: [
                                { $eq: ['$from', currentUserId] },
                                '$to',
                                '$from'
                            ]
                        },
                        lastMessage: { $first: '$$ROOT' }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                {
                    $unwind: '$userInfo'
                }
            ]);

            res.send(lastMessages);
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
};
