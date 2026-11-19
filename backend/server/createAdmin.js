const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Admin } = require('./model');

const [, , username, password] = process.argv;
if (!username || !password) {
  console.error('Usage: node createAdmin.js <username> <password>');
  process.exit(1);
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  await Admin.init(); // wait until the unique index on username exists

  if (await Admin.findOne({ username })) {
    console.log(`Admin "${username}" already exists. Nothing changed.`);
    return;
  }

  await Admin.create({ username, passwordHash: await bcrypt.hash(password, 10) });
  console.log('Admin created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());