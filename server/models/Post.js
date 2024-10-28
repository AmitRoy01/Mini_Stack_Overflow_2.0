const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  email: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String },
  codeSnippetUrl: { type: String }, // URL to the file or code snippet stored in MinIO
  fileType: { type: String }, // 'file' or 'snippet'
  language: { type: String }, // Language of the code snippet, if any
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
