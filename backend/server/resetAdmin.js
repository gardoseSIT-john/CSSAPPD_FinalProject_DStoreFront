const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Admin } = require('./model');

const [, , username, password] = process.argv;
if (!username || !password) {
  console.error('Usage: node resetAdmin.js <username> <password>');
  process.exit(1);
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

  const removed = await Admin.deleteMany({});
  console.log('Removed old admins:', removed.deletedCount);

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ username, passwordHash });

  console.log('Admins in database:', await Admin.countDocuments());
  console.log('Password check:', (await bcrypt.compare(password, passwordHash)) ? 'OK' : 'FAILED');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());