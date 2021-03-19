const argon2=require("argon2");
const AdminBro=require("admin-bro");

/**@type {AdminBro.After<AdminBro.ActionResponse>} */
const after = async (response) =>{
  if(response.record && response.record.errors.password){
    response.record.errors.newPassword=response.record.errors.password;
  }
  return response;
};

/**@type {AdminBro.Before} */
const before = async (request) =>{
  if(request.method==="post"){
    const {newPassword,...otherParams}=request.payload;

    if(newPassword){
      const password = await argon2.hash(newPassword);

      return{
        ...request,
        payload:{
          ...otherParams,
          password,
        },

      };
    }

  }
  return request;
};
module.exports = {after,before};
