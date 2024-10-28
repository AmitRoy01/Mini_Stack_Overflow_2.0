// const express = require('express');
// const router = express.Router();
// const Notification = require('../models/Notification');
// const authMiddleware = require('../middleware/authMiddleware');

// router.get('/notification', authMiddleware, async (req, res) => {
//   try {
//     // Find notifications specific to the logged-in user
//     const notifications = await Notification.find({ userId: req.user._id });
    
//     if (notifications.length) {
//       res.status(200).json(notifications);
//       console.log(notifications);
//     } else {
//       res.status(404).json({ message: 'No notifications found' });
//     }
//   } catch (error) {
//     console.error('Error fetching notifications:', error);
//     res.status(500).json({ message: 'Error fetching notifications' });
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

// GET notifications for the logged-in user
router.get('/notification', authMiddleware, async (req, res) => {
  try {
    // Find notifications where the email of the notifier is not the logged-in user's email
    const notifications = await Notification.find({
      email: { $ne: req.user.email }, // Exclude notifications for the logged-in user's own posts
    });

    // Always return notifications, even if empty
    res.status(200).json(notifications); // This will return an empty array if no notifications are found
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

module.exports = router;

