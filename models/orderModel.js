const mongoose = require("mongoose");

var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        count: Number,
        color: String,
      },
    ],
    payment: {},
    orderStatus: {
      type: String,
      default: "Not Proccessed",
      enum: [
        "Not proccessed",
        "cash on delivery",
        "processing",
        "Dispatched",
        "Cancelled",
        "Delivered",
      ],
    },
    cartTotal:Number,
    totalafterDiscount:Number,
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);