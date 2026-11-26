/*We updated the model in compliance to the target feature. (MAdded the ability to store Tags for searching,
 aswell as boolean values for isActive. We also added a removedAt variable, will represent when the item's been removed for
 Admin features.)

*/

const mongoose = require('mongoose');
const crypto = require('crypto');

//This are like ENUMs(not like, it is ENUM), which are predefined values in an array. so TAGS[1] now refers to the item as casual. Any items 
//with the value of TAGS[1] is now considered a casual clothing.
// Why'd we do this?
const TAGS = ['casual', 'jackets', 'shirts', 'pants', 'outdoor', 'accessories']; //Initial values, will change when needed
const PRODUCT_STATUSES = ['available', 'reserved', 'sold'];
const PAYMENT_METHODS = ['cod', 'transfer'];
const ORDER_STATUSES = ['pending', 'completed'];

const nonEmpty = (message) => ({ validator: (v) => Array.isArray(v) && v.length > 0, message });

//Product Schema area:
const productSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  size: { type: [String], validate: nonEmpty('At least one size is required') },
  description: { type: String, default: '' },
  tags: [{ type: String, enum: { values: TAGS, message: '{VALUE} is not an allowed tag' } }],
  //images field edited to accomodate the Image updload
  images: {
  type: [String],
  validate: [
    nonEmpty('At least one image is required'),
    { validator: (v) => v.length <= 5, message: 'A product can have at most 5 images' },
  ],
},
  price: {
    type: Number,
    required: [true, 'Price is required'],
    validate: { validator: (v) => v > 0, message: 'Price must be greater than 0' },
  },
  status: {
    type: String,
    enum: { values: PRODUCT_STATUSES, message: '{VALUE} is not a valid status' },
    default: 'available',
  },
  isActive: { type: Boolean, default: true },
  removedAt: { type: Date, default: null },
});

//Order part
const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    // snapshot: copied at order time so later product edits don't change old orders
    name: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true },
    items: { type: [orderItemSchema], validate: nonEmpty('An order needs at least one item') },
    customerName: { type: String, required: [true, 'Customer name is required'], trim: true },
    contactNumber: { type: String, required: [true, 'Contact number is required'], trim: true },
    address: { type: String, required: [true, 'Address is required'], trim: true },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
      enum: { values: PAYMENT_METHODS, message: '{VALUE} is not a valid payment method' },
    },
    paymentReference: {
      type: String,
      trim: true,
      required: [
        function () { return this.paymentMethod === 'transfer'; },
        'A transfer payment needs a reference',
      ],
    },
    status: {
      type: String,
      enum: { values: ORDER_STATUSES, message: '{VALUE} is not a valid status' },
      default: 'pending',
    },
  },
  { timestamps: true },
);
//Reference number is created first before validation runs(The job of crypto
orderSchema.pre('validate', function () {
  if (!this.reference) {
    const day = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    this.reference = `DS-${day}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  }
});

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
});

module.exports = {
  TAGS,
  PRODUCT_STATUSES,
  PAYMENT_METHODS,
  Product: mongoose.model('Product', productSchema),
  Order: mongoose.model('Order', orderSchema),
  Admin: mongoose.model('Admin', adminSchema),
};