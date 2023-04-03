require('dotenv').config();

const express = require('express');

const mongoose = require('mongoose');

const authRouter = require('./routes/auth');

const walletRouter = require('./routes/wallet');

const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@main-database.nag2prh.mongodb.net/?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

connectMongoDB();

const app = express();

app.use(express.json());

app.use('/api/auth', authRouter);

app.use('/api/wallets', walletRouter);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
