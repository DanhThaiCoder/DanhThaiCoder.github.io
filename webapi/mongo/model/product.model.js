//kết nối collection product
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const productSchema = new Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  discount: { type: String, required: false },
  price: { type: String, required: true },
  pricedown: { type: String, required: false },
  hot: { type: Number, required: false, default: 0 },
  category: {
    categoryId: { type: ObjectId, require: true },
    categoryName: { type: String, require: true },
  },
});

module.exports =
  mongoose.models.product || mongoose.model("product", productSchema);
