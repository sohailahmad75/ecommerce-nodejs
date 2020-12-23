const express = require("express");
const router = express.Router();

const {
  updateBid,
  createProduct,
  myAds,
  listRelated,
  productById,
  readProduct,
  deleteProduct,
  list,
  photo,
  listBySearch,
  allProducts,
  listSearch,
  editProduct,
} = require("../controllers/product");
const { requireSignIn, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require("../controllers/user");

router.get("/product/:productId", readProduct);
router.get("/products", list);
router.get("/products/search", listSearch);
router.get("/product/photo/:productId", photo);
router.get("/product/photoData/:productId", photo);
router.post("/product/create/:userId", requireSignIn, isAuth, createProduct);
router.put("/product/edit/:userId", requireSignIn, isAuth, editProduct);
router.post("/products/by/search", listBySearch);
router.delete(
  "/product/:productId/:userId",
  requireSignIn,
  isAuth,
  deleteProduct
);
router.get("/products/related/:productId", listRelated);
router.put("/updateBid/:userId", requireSignIn, isAuth, updateBid);
router.param("userId", userById);
router.param("productId", productById);
router.delete("/productdelete/:productId", deleteProduct);
router.get("/allproducts", allProducts);

router.get("/myads/:userId", requireSignIn, isAuth, myAds);
module.exports = router;
