const Category = require ("../models/category")
const {errorHandler} = require("../helper/dbErrorHandler")
exports.create = (req, res) =>{
    const category = new Category(req.body);
    category.save((err,data)=>{
        if (err) {
           return res.status(400).json({
                err : errorHandler(err)
            })
        }
        res.status(200).json({
            data
        })
    })

}
exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};