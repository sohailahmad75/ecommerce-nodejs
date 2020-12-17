const Product = require("../models/product");
const formidable = require("formidable");
const fs = require("fs");
const mongoose = require("mongoose");
//const _ = require("lodash")
const { errorHandler } = require("../helper/dbErrorHandler");

exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        err: "Product Not Found!!",
      });
    }
    req.product = product;
    next();
  });
};
exports.myAds = (req, res, next) => {
  console.log("run");
  console.log(req.profile._id);
  Product.find({ userId: req.profile._id }).exec((err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Products not found",
      });
    }
    //   products.map(product.photo = undefined)
    res.json(products);
  });
};
exports.listSearch = (req, res) => {
  // create query object to hold search value and category value
  const query = {};
  // assign search value to query.name
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: "i" };
    // assigne category value to query.category
    if (req.query.category && req.query.category != "All") {
      query.category = req.query.category;
    }
    // find the product based on query object with 2 properties
    // search and category
    Product.find(query, (err, products) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(products);
    }).select("-photo");
  }
};

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json(products);
    });
};

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  Product.find()
    .select()
    .populate("category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json(products);
    });
};
exports.editProduct = (req, res) => {
  try {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(400).json({
          err: "Image Could not be uploaded!!!!!",
        });
      }
      let photoData = null;
      let contentType = null;
      if (files.photo) {
        photoData = fs.readFileSync(files.photo.path);
        contentType = files.photo.type;
      }

      console.log("fields", fields);
      console.log("files", files);
      let photo = photoData ? { photo: { data: photoData, contentType } } : {};
      Product.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(fields.productId) },
        { ...fields, ...photo },
        { new: true }
      ).then((response) => {
        res.json({ response });
      });
    });
  } catch (e) {
    console.log(e.message);
  }
};
exports.readProduct = (req, res) => {
  const product = req.product;
  // product.photo = undefined;
  return res.json({
    product,
  });
};
exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(400).json({
        err: "Image Could not be uploaded!!!!!",
      });
    }
    console.log("fields", fields);

    const {
      name,
      description,
      price,
      category,
      location,
      userId,
      sDate,
      eDate,
      userName,
    } = fields;
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !location ||
      !userId ||
      !sDate ||
      !eDate ||
      !userName
    ) {
      return res.status(402).json({
        error: "All fields are required!!!!!!",
      });
    }
    if (category === "Please Select Category") {
      return res.status(402).json({
        error: "Category is required!!",
      });
    }
    if (!userName) {
      return res.status(402).json({
        error: "userName is not defined!!!!!!!!",
      });
    }
    if (!userId) {
      return res.status(402).json({
        error: "UserId is not defined!!!!!!!!",
      });
    }
    const product = new Product(fields);
    if (files.photo) {
      // Image is greater than 1Mb validation
      if (files.photo.size > 5000000) {
        return res.status(401).json({
          error: "Image size sholud be less than 5Mb",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    product.save((err, result) => {
      console.log("error", err);
      console.log("result", result);
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};
exports.updateBid = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields) => {
    if (err) {
      res.status(400).json({
        err: "Something went worng",
      });
    }
    console.log("fields", fields);
    const { price, productId, userId, bidUserName, bidUserNumber } = fields;
    if (!price) {
      return res.status(400).json({
        error: "Price is required",
      });
    }
    if (!userId || !bidUserName || !bidUserNumber) {
      return res.status(400).json({
        error: "Error with user data",
      });
    }
    // Product.findOne({'_id' : productId})
    // .then(function(doc) {
    //     if(!doc)
    //         throw new Error('No record found.');
    //   console.log(doc);//else case
    // })
    const newData = {
      bidPrice: price,
      bidUserID: userId,
      bidUserName: bidUserName,
      bidUserNumber: bidUserNumber,
    };
    console.log("newdata", newData);

    Product.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(productId) },
      newData,
      { new: true }
    )
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(400).json({
          error: errorHandler(err),
        });
      });
  });
};
exports.deleteProduct = (req, res) => {
  console.log(
    "dsafsdjhfhksdfjsajfkjsdakjfdsajfkljasklfjkasjkdfjklassssssssssssssssssssssssssssssssssssss"
  );
  const product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.status(200).json({
      message: "Product Deleted Successfully!!",
    });
  });
};

exports.allProducts = (req, res) => {
  Product.find().exec((err, products) => {
    if (err) {
      return res.status(400).json({
        error: "No Product found",
      });
    }
    getAllProductsFromDB();
    async function getAllProductsFromDB() {
      await products.map((product) => {
        product.photo = undefined;
        // user.hashed_password = undefined;
        // user.salt = undefined;
        // user.history = undefined;
      });
      res.json(products);
    }
  });
};
