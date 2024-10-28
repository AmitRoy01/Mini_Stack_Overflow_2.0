const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  message: { type: String },
  //createdAt: { type: Date, default: Date.now }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields);

module.exports = mongoose.model('Notification', notificationSchema);
