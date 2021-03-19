const AdminBro = require("admin-bro");
const User=require("../../models/user.js");
const {
  after: passwordAfterHook,
  before: passwordBeforeHook,
} = require("./password.hook");
const {
  after: uploadAfterHook,
  before: uploadBeforeHook,
} = require('./upload-image.hook');


/** @type {AdminBro.ResourceOptions} */

const options = {
  properties:{
    password:{
      isVisible:false,
    },
    verifyCode:{
      isVisible:false,
    },
    profilePhotoLocation: {
      isVisible: false,
    },
    newPassword:{
      type:"password",
    },
    uploadImage: {
  components: {
    edit: AdminBro.bundle('./components/upload-image.edit.tsx'),
    list: AdminBro.bundle('./components/upload-image.list.tsx'),
  },
},
  },
  actions: {
    new: {
      after: async (response, request, context) => {
        const modifiedResponse = await passwordAfterHook(response, request, context);
        return uploadAfterHook(modifiedResponse, request, context);
      },
      before: async (request, context) => {
        const modifiedRequest = await passwordBeforeHook(request, context);
        return uploadBeforeHook(modifiedRequest, context);
      },
    },
    edit: {
      after: async (response, request, context) => {
        const modifiedResponse = await passwordAfterHook(response, request, context);
        return uploadAfterHook(modifiedResponse, request, context);
      },
      before: async (request, context) => {
        const modifiedRequest = await passwordBeforeHook(request, context);
        return uploadBeforeHook(modifiedRequest, context);
      },
    },
    show: {
      isVisible: false,
    },
  },

};

module.exports={
  options,
  resource:User,
};
