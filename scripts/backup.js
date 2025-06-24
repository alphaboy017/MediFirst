const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const Product = require('../app/models/Product').default;
const Bill = require('../app/models/Bill').default;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://nihal:nihal@cluster0.t1vwq.mongodb.net/medicalstore?retryWrites=true';
const BACKUP_DIR = path.resolve(__dirname, '../backups');

async function main() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR);
  }
  await mongoose.connect(MONGODB_URI);
  const products = await Product.find({}).lean();
  const bills = await Bill.find({}).lean();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.writeFileSync(path.join(BACKUP_DIR, `products-backup-${timestamp}.json`), JSON.stringify(products, null, 2));
  fs.writeFileSync(path.join(BACKUP_DIR, `bills-backup-${timestamp}.json`), JSON.stringify(bills, null, 2));
  console.log('Backup completed:', timestamp);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Backup failed:', err);
  process.exit(1);
}); 