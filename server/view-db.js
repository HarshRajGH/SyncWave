import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/syncwave';

async function viewDatabase() {
  try {
    console.log('\n=========================================');
    console.log(` Connecting to MongoDB: ${MONGO_URI}`);
    console.log('=========================================\n');

    await mongoose.connect(MONGO_URI);
    const db = mongoose.connection.db;

    const collections = await db.listCollections().toArray();
    console.log(`📁 Collections in "${db.databaseName}":\n`);

    const syncwaveCollections = ['users', 'waves', 'histories', 'messages'];

    for (const name of syncwaveCollections) {
      const col = db.collection(name);
      const count = await col.countDocuments();
      console.log(`-----------------------------------------`);
      console.log(`📦 Collection: [ ${name.toUpperCase()} ] (${count} documents)`);
      console.log(`-----------------------------------------`);

      const docs = await col.find({}, { projection: { password: 0 } }).sort({ _id: -1 }).limit(5).toArray();
      if (docs.length === 0) {
        console.log('  (No documents yet)\n');
      } else {
        console.log(JSON.stringify(docs, null, 2));
        console.log('\n');
      }
    }

    console.log('=========================================');
    console.log(' Completed MongoDB Inspection.');
    console.log('=========================================\n');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

viewDatabase();
