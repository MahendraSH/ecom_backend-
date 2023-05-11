const CatchAsycErrors = require("../middlewares/catchAsyncError");
const productModel = require("../models/productModel");
const ErrorHandler = require("../utils/ErrorHandler");
const ApiFeatures = require("../utils/features");

const createProduct = CatchAsycErrors(async (req, res, next) => {

    const product = await productModel.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
}

);

const getAllProducts = CatchAsycErrors(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(productModel.find(), req.query).search().filter().pagination(10);
    const products = await apiFeatures.query;
    res.status(200).json({
        success: true,
        products
    })
}

);

const getProductById = CatchAsycErrors(async (req, res, next) => {
    const product = await productModel.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }
    res.status(200).json({
        success: true,
        product
    })
});

const updateProduct = CatchAsycErrors(async (req, res, next) => {
    let product = await productModel.findById(req.params.id);
    if (!product) {

        return (next(new ErrorHandler("Product not found", 404)));
    }
    product = await productModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    product = await productModel.findById(req.params.id);
    res.status(200).json({
        success: true,
        product,
    })
});

const deleteProduct = CatchAsycErrors(async (req, res, next) => {
    let product = await productModel.findById(req.params.id);
    if (!product) {
        return (next(new ErrorHandler("Product not found", 404)));
    }
    await product.deleteOne();
    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
});

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};