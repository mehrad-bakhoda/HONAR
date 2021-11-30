//Public modules
var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
require("dotenv").config();

//local modules
const generateOTP = require("../localModules/generateOTP.js");

// Importing GET paths
import BecomeArtist from "./paths/GET/BecomeArtist.js";
import DownloadProduct from "./paths/GET/DownloadProduct.js";
import Home from "./paths/GET/Home.js";
import Tags from "./paths/GET/Tags.js";
import Login from "./paths/GET/Login.js";
import Dashboard from "./paths/GET/Dashboard.js";
import DashboardError from "./paths/GET/DashboardError.js";
import DashboardOrders from "./paths/GET/DashboardOrders.js";
import Orders from "./paths/GET/Orders.js";
import Upload from "./paths/GET/Upload.js";
import CartGET from "./paths/GET/CartGET.js";
import DeleteFromCart from "./paths/GET/DeleteFromCart.js";
import AddToCart from "./paths/GET/AddToCart.js";
import OrderConfirm from "./paths/GET/OrderConfirm.js";
import Edit from "./paths/GET/Edit.js";
import ProductGET from "./paths/GET/ProductGET.js";
import LogOut from "./paths/GET/LogOut.js";
import SearchHome from "./paths/GET/SearchHome.js";
import UserName from "./paths/GET/UserName.js";

// Importing POST paths

import BecomeArtistPOST from "./paths/POST/BecomeArtistPOST.js";
import UseDiscountPOST from "./paths/POST/UseDiscountPOST.js";
import GenerateDPOST from "./paths/POST/GenerateDPOST.js";
import RemoveFundPOST from "./paths/POST/RemoveFundPOST.js";
import AddFundPOST from "./paths/POST/AddFundPOST.js";
import SendMessagePOST from "./paths/POST/SendMessagePOST.js";
import AddCardPOST from "./paths/POST/AddCardPOST.js";
import LogInPOST from "./paths/POST/LogInPOST.js";
import RegisterPOST from "./paths/POST/RegisterPOST.js";
import SignUpDPOST from "./paths/POST/SignUpDPOST.js";
import SignUpUPOST from "./paths/POST/SignUpUPOST.js";
import SignInPOST from "./paths/POST/SignInPOST.js";
import UploadPOST from "./paths/POST/UploadPOST.js";
import EditProductPOST from "./paths/POST/EditProductPOST.js";
import ChangeUserInfoUPOST from "./paths/POST/ChangeUserInfoUPOST.js";
import ChangeUserInfoDPOST from "./paths/POST/ChangeUserInfoDPOST.js";
import SearchAdvancedHomePOST from "./paths/POST/SearchAdvancedHomePOST.js";
import SearchHomePOST from "./paths/POST/SearchHomePOST.js";
import SearchAdvancedHomeItemPOST from "./paths/POST/SearchAdvancedHomeItemPOST.js";

//Admin Paths

//Admin GET paths
import AdminFinance from "./admin/GET/AdminFinance.js";
import AdminHome from "./admin/GET/AdminHome.js";
import AdminLogin from "./admin/GET/AdminLogin.js";
import AdminMessages from "./admin/GET/AdminMessages.js";
import AdminProducts from "./admin/GET/AdminProducts.js";
import AdminUsers from "./admin/GET/AdminUsers.js";
import AdminReqs from "./admin/GET/AdminReqs.js";
import SearchAdminFinance from "./admin/GET/SearchAdminFinance.js";
import SearchAdminMessages from "./admin/GET/SearchAdminMessages.js";
import SearchAdminProducts from "./admin/GET/SearchAdminProducts.js";
import SearchAdminUsers from "./admin/GET/SearchAdminUsers.js";

//Admin POST paths
import AdminLoginPOST from "./admin/POST/AdminLoginPOST.js";
import ConfirmProductPOST from "./admin/POST/ConfirmProductPOST.js";
import DeleteProductPOST from "./admin/POST/DeleteProductPOST.js";
import DeleteUsersPOST from "./admin/POST/DeleteUsersPOST.js";
import SearchAdminFinancePOST from "./admin/POST/SearchAdminFinancePOST.js";
import SearchAdminMessagesPOST from "./admin/POST/SearchAdminMessagesPOST.js";
import SearchAdminProductsPOST from "./admin/POST/SearchAdminProductsPOST.js";
import SearchAdminUsersPOST from "./admin/POST/SearchAdminUsersPOST.js";
import SendMessageAdminPOST from "./admin/POST/SendMessageAdminPOST.js";

//ROUTES

// GET ROUTES
router.get("/become-artist", (req, res) => {
  BecomeArtist(req, res);
});

router.get("/download/:productId/:type", (req, res) => {
  DownloadProduct(req, res);
});

router.get("/", (req, res) => {
  Home(req, res);
});

router.get("/tags/:tag", (req, res) => {
  Tags(req, res);
});

router.get("/login", (req, res) => {
  Login(req, res);
});

router.get("/dashboard", (req, res) => {
  Dashboard(req, res);
});

router.get("/dashboard:error", (req, res) => {
  DashboardError(req, res);
});

router.get("/dashboard/orders/:orderId", (req, res) => {
  DashboardOrders(req, res);
});

router.get("/orders", (req, res) => {
  Orders(req, res);
});
router.get("/user", (req, res) => {
  res.render("user");
});

router.get("/upload", (req, res) => {
  Upload(req, res);
});

router.get("/contact-us", (req, res) => {
  res.render("contactUs");
});

router.get("/cart", (req, res) => {
  CartGET(req, res);
});

router.get("/delete-from-cart/:id", (req, res) => {
  DeleteFromCart(req, res);
});

router.get("/add-to-cart/:id/:type", (req, res) => {
  AddToCart(req, res);
});

router.get("/orderConfirm", (req, res) => {
  OrderConfirm(req, res);
});

router.get("/about-us", (req, res) => {
  res.render("aboutUs");
});

router.get("/edit/:uniqueId/:itemID/:itemName", (req, res) => {
  Edit(req, res);
});

router.get("/Product/:itemID/:itemName", (req, res) => {
  ProductGET(req, res);
});

router.get("/logout", function (req, res, next) {
  LogOut(req, res);
});

router.get("/:userName", (req, res) => {
  UserName(req, res);
});

router.get("/search/home/:searchedItem", (req, res) => {
  SearchHome(req, res);
});

//POST ROUTES
router.post("/becomeArtist", (req, res, next) => {
  BecomeArtistPOST(req, res, next);
});

router.post("/useDiscount", (req, res) => {
  UseDiscountPOST(req, res);
});

router.post("/generateD", (req, res) => {
  GenerateDPOST(req, res);
});

router.post("/removeFund", (req, res) => {
  RemoveFundPOST(req, res);
});

router.post("/addFund", (req, res) => {
  AddFundPOST(req, res);
});

router.post("/getFund", (req, res) => {
  res.redirect("dashboard");
});
router.post("/sendMessage", (req, res) => {
  SendMessagePOST(req, res);
});

router.post("/addCard", (req, res) => {
  AddCardPOST(req, res);
});

router.post("/sendAgain", (req, res) => {
  generateOTP.newOtp(req.body.phone);
});

router.post(
  "/login",
  [
    check("loginInput", "phoneNumber")
      .isMobilePhone()
      .isLength({ min: 11, max: 11 })
      .not()
      .isEmpty(),
  ],
  (req, res, next) => {
    LogInPOST(req, res, next);
  }
);

router.post("/register", (req, res) => {
  RegisterPOST(req, res);
});

router.post("/signUpD", (req, res) => {
  SignUpDPOST(req, res);
});

router.post("/signUpU", (req, res) => {
  SignUpUPOST(req, res);
});

router.post("/signIn", (req, res) => {
  SignInPOST(req, res);
});

router.post("/upload", (req, res) => {
  UploadPOST(req, res);
});

router.post("/editProduct/:productId", (req, res, next) => {
  EditProductPOST(req, res, next);
});

router.post("/changeUserInfoU", (req, res, next) => {
  ChangeUserInfoUPOST(req, res, next);
});

router.post("/changeUserInfoD", (req, res, next) => {
  ChangeUserInfoDPOST(req, res, next);
});

router.post("/search/advanced/home", (req, res) => {
  SearchAdvancedHomePOST(req, res);
});

router.post("/search/home", (req, res) => {
  SearchHomePOST(req, res);
});

router.post("/search/advanced/home/:searchedItem", (req, res) => {
  SearchAdvancedHomeItemPOST(req, res);
});

///////////////////////// ADMIN ROUTES ////////////////////////

router.post("/search/admin/finance", (req, res) => {
  SearchAdminFinancePOST(req, res);
});

router.get("/search/admin/finance/:searchedItem", (req, res) => {
  SearchAdminFinance(req, res);
});

router.post("/search/admin/users", (req, res) => {
  SearchAdminUsersPOST(req, res);
});

router.get("/search/admin/users/:searchedItem", (req, res) => {
  SearchAdminUsers(req, res);
});

router.post("/search/admin/products", (req, res) => {
  SearchAdminProductsPOST(req, res);
});

router.get("/search/admin/products/:searchedItem", (req, res) => {
  SearchAdminProducts(req, res);
});

router.post("/search/admin/messages", (req, res) => {
  SearchAdminMessagesPOST(req, res);
});

router.get("/search/admin/messages/:searchedItem", (req, res) => {
  SearchAdminMessages(req, res);
});

router.get("/admin/home", (req, res) => {
  AdminHome(req, res);
});

router.get("/admin/login", (req, res) => {
  AdminLogin(req, res);
});

router.post("/admin/login", (req, res) => {
  AdminLoginPOST(req, res);
});

router.get("/admin/finance", (req, res) => {
  AdminFinance(req, res);
});

router.get("/admin/users", (req, res) => {
  AdminUsers(req, res);
});
router.post("/delete/user/:unique_id", (req, res) => {
  DeleteUsersPOST(req, res);
});

router.get("/admin/messages", (req, res) => {
  AdminMessages(req, res);
});
router.post("/send/message/:messageId/:userId", (req, res) => {
  SendMessageAdminPOST(req, res);
});

router.get("/admin/reqs", (req, res) => {
  AdminReqs(req, res);
});

router.get("/admin/products", (req, res) => {
  AdminProducts(req, res);
});

router.post("/confirm/product/:productId", (req, res) => {
  ConfirmProductPOST(req, res);
});
router.post("/delete/product/:productId", (req, res) => {
  DeleteProductPOST(req, res);
});

// Get all the request the have not been declared
router.get("*", (req, res) => {
  res.render("notFound");
});

module.exports = router;
