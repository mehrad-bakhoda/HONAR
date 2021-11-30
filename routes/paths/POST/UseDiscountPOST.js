//code

export default (req,res)=>{
    res.redirect(`/cart?discountCode=${req.body.discountCode}`);
};