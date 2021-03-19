
const {default:AdminBro} = require("admin-bro");
const AdminBroMongoose=require("admin-bro-mongoose");

AdminBro.registerAdapter(AdminBroMongoose);

const AdminUser=require("./user/user.admin");
const AdminProduct=require("./product/product.admin");

 /** @type {import("admin-bro").AdminBro.AdminBroOptions} */

const options = {
  resources:[AdminUser,AdminProduct],


};
module.exports=options;
