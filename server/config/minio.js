const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

minioClient.bucketExists(BUCKET_NAME, async (err, exists) => {
  if (err) {
    console.log('Error checking bucket existence:', err);
    return;
  }
  if (!exists) {
    try {
      await minioClient.makeBucket(BUCKET_NAME, 'us-east-1'); // Specify the region if needed
      console.log(`Bucket "${BUCKET_NAME}" created successfully.`);
    } catch (error) {
      console.error('Error creating bucket:', error);
      return;
    }
  } else {
    console.log(`Bucket "${BUCKET_NAME}" already exists.`);
  }
});

module.exports = { minioClient, BUCKET_NAME };
