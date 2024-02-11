import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.DB_URL

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(url);
    console.log(`Conexión exitosa a MongoDB: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error de conexión a MongoDB: ${error.message}`);
    process.exit(1); // Salir del proceso con un error
  }
};

export default connectDB;
