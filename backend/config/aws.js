// config/aws.js
const AWS = require("aws-sdk");

AWS.config.update({
  region: "eu-west-3",
});

const s3 = new AWS.S3();
module.exports = s3;