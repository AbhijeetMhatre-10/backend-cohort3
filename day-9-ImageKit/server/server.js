import dotenv from 'dotenv'
import app from './src/app.js'
import connectDB from './src/config/db.config.js'

dotenv.config();

connectDB().then(() => {
  app.listen(process.env.port, () => {
    console.log(`Server is running on port ${process.env.port}`);
  });
});
