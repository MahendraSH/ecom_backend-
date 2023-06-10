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
//  product review create and upate 
const createProductReview = CatchAsycErrors(async (req, res, next) => {
    const {id}=req.params;
    const { rating, comment } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product = await productModel.findById(id);
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );
    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        
        success: true,
        product,
        user,
        
    });
    
});
//  get all reviews 

const getAllReviews = CatchAsycErrors(async (req, res, next) => {
    const product = await productModel.findById(req.params.id);
    if (!product) {
        return (next(new ErrorHandler("Product not found", 404)));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});
module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    createProductReview,
    getAllReviews
};