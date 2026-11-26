const { Product, Order } = require('./model');

let failures = 0;

async function check(label, doc, expectBad) {
  let err = null;
  try {
    await doc.validate();
  } catch (e) {
    err = e;
  }
  const ok = expectBad ? !!err : !err;
  if (!ok) failures++;
  console.log(ok ? 'PASS' : 'FAIL', label, err?.errors ? '-> ' + Object.keys(err.errors).join(', ') : '');
}

async function main() {
  const good = { name: 'Tee', size: ['M'], price: 100, images: ['https://x/y.jpg'], tags: ['casual'] };

  // Scenario 1
  await check('no name', new Product({ ...good, name: '' }), true);
  await check('no size', new Product({ ...good, size: [] }), true);
  await check('price 0', new Product({ ...good, price: 0 }), true);
  await check('price -5', new Product({ ...good, price: -5 }), true);
  await check('no images', new Product({ ...good, images: [] }), true);
  await check('valid product', new Product(good), false);
  //Product check added for ImageTesting : F3
  await check('6 images', new Product({ ...good, images: ['a', 'b', 'c', 'd', 'e', 'f'] }), true);
  await check('5 images', new Product({ ...good, images: ['a', 'b', 'c', 'd', 'e'] }), false);

  // Scenario 2
  const p = new Product(good);
  const defaultsOk = p.status === 'available' && p.isActive === true && p.removedAt === null;
  if (!defaultsOk) failures++;
  console.log(defaultsOk ? 'PASS' : 'FAIL', 'defaults');

  // Scenario 3
  await check('bad status', new Product({ ...good, status: 'lost' }), true);
  await check('bad tag', new Product({ ...good, tags: ['weird'] }), true);

  // Scenario 4
  const item = { product: p._id, name: 'Tee', size: 'M', price: 100, image: 'https://x/y.jpg' };
  const ord = { items: [item], customerName: 'A', contactNumber: '0917', address: 'Here', paymentMethod: 'cod' };
  await check('no customer name', new Order({ ...ord, customerName: '' }), true);
  await check('no contact', new Order({ ...ord, contactNumber: '' }), true);
  await check('no address', new Order({ ...ord, address: '' }), true);
  await check('no payment method', new Order({ ...ord, paymentMethod: undefined }), true);
  await check('transfer without reference', new Order({ ...ord, paymentMethod: 'transfer' }), true);
  await check('transfer with reference', new Order({ ...ord, paymentMethod: 'transfer', paymentReference: 'TX123' }), false);

  // Scenario 5: validate() runs the hook that creates the reference
  const o = new Order(ord);
  await o.validate();
  const ok =
    /^DS-\d{8}-[A-F0-9]{6}$/.test(o.reference) &&
    o.status === 'pending' &&
    o.items[0].name === 'Tee' &&
    o.items[0].size === 'M' &&
    o.items[0].price === 100 &&
    o.items[0].image === 'https://x/y.jpg';
  if (!ok) failures++;
  console.log(ok ? 'PASS' : 'FAIL', 'reference, status, snapshot ->', o.reference);

  console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
  process.exitCode = failures === 0 ? 0 : 1;
}

main();