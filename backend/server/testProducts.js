//Test file for F4, to verify the target objective...
const BASE = 'http://localhost:3000/api';
const [, , username, password] = process.argv;
let failures = 0;

function check(label, ok, extra = '') {
  if (!ok) failures++;
  console.log(ok ? 'PASS' : 'FAIL', label, extra);
}

async function call(method, path, body, token) {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* not JSON */ }
  return { status: res.status, data };
}

async function main() {
  const login = await call('POST', '/login', { username, password });
  if (login.status !== 200) {
    console.error('Login failed. Usage: node testProducts.js <user> <pass>');
    process.exit(1);
  }
  const token = login.data.token;
  const good = { name: 'ZZ Test', size: ['M'], price: 100, images: ['https://x/y.jpg'], tags: ['casual'] };

  // Scenario 6: 401 without a valid token
  check('401 admin list, no token', (await call('GET', '/admin/products')).status === 401);
  check('401 add, no token', (await call('POST', '/products', good)).status === 401);
  check('401 bad token', (await call('GET', '/admin/products', null, 'nope')).status === 401);

  // Scenario 5: invalid data lists what is wrong
  const bad = await call('POST', '/products', { ...good, name: '', price: 0, images: [] }, token);
  const d = bad.data?.details ?? {};
  check('400 invalid add lists problems', bad.status === 400 && d.name && d.price && d.images, JSON.stringify(d));

  // Scenario 4: add and update
  const added = await call('POST', '/products', good, token);
  check('add returns 201 and the product', added.status === 201 && !!added.data?._id);
  const id = added.data?._id;
  const upd = await call('PUT', `/products/${id}`, { price: 150 }, token);
  check('update saved and returned', upd.status === 200 && upd.data.price === 150);
  check('400 invalid update', (await call('PUT', `/products/${id}`, { price: -1 }, token)).status === 400);
  check('400 invalid status', (await call('PUT', `/products/${id}`, { status: 'lost' }, token)).status === 400);
  const flags = await call('PUT', `/products/${id}`, { isActive: false, removedAt: new Date() }, token);
  check('update cannot set flags', flags.status === 200 && flags.data.isActive === true && !flags.data.removedAt);

  // Scenarios 1 and 2: public list and detail
  const inList = async () => (await call('GET', '/products')).data.some((p) => p._id === id);
  check('public list includes available product', await inList());
  const list = (await call('GET', '/products')).data;
  check('public list only available, active, not removed', list.every((p) => p.status === 'available' && p.isActive && !p.removedAt));
  const one = await call('GET', `/products/${id}`);
  check('public detail returns product and status', one.status === 200 && one.data.status === 'available');
  check('unknown id 404', (await call('GET', '/products/000000000000000000000000')).status === 404);
  check('malformed id 404', (await call('GET', '/products/abc')).status === 404);

  // Sold: out of the list, still viewable
  await call('PUT', `/products/${id}`, { status: 'sold' }, token);
  check('sold not in public list', !(await inList()));
  const sold = await call('GET', `/products/${id}`);
  check('sold detail still returns, with status', sold.status === 200 && sold.data.status === 'sold');
  await call('PUT', `/products/${id}`, { status: 'available' }, token);

  // Hide, unhide
  const hid = await call('PATCH', `/products/${id}/hide`, null, token);
  check('hide saved and returned', hid.status === 200 && hid.data.isActive === false);
  check('hidden not in public list', !(await inList()));
  check('hidden detail 404', (await call('GET', `/products/${id}`)).status === 404);
  const adm1 = (await call('GET', '/admin/products', null, token)).data.find((p) => p._id === id);
  check('admin list includes hidden, with flag', !!adm1 && adm1.isActive === false);
  const unh = await call('PATCH', `/products/${id}/unhide`, null, token);
  check('unhide saved and returned', unh.status === 200 && unh.data.isActive === true);
  check('unhidden back in public list', await inList());

  // Remove
  const rem = await call('DELETE', `/products/${id}`, null, token);
  check('remove returns product with removedAt', rem.status === 200 && !!rem.data.removedAt);
  check('removed not in public list', !(await inList()));
  check('removed detail 404', (await call('GET', `/products/${id}`)).status === 404);
  const adm2 = (await call('GET', '/admin/products', null, token)).data.find((p) => p._id === id);
  check('admin list includes removed, with flag', !!adm2 && !!adm2.removedAt);

  console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
  process.exitCode = failures === 0 ? 0 : 1;
}

main();