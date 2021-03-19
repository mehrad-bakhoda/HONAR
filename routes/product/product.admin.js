const {default:AdminBro} = require("admin-bro");


const Product=require("../../models/product");
/** @type {AdminBro.ResourceOptions} */

const options = {

};

module.exports={
  options,
  resource:Product,
};
