import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: '../.env' });

const app = express();

app.use(express.json())

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
