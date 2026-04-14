// DynamoDB Cart Structure (NOT Mongoose)

const CartModel = {
  userId: "",      // partition key
  productId: "",   // sort key (recommended)
  name: "",
  price: 0,
  image: "",
  quantity: 1
};

module.exports = CartModel;