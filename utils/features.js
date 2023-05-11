//  add search 
//  fulter 
//  price range 
//  paggnation

class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // search feature 
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i",
            },
        } : {};
   
        // console.log(keyword);
        this.query = this.query.find({ ...keyword });
        return this;
    };

    filter() {
        const queryCopy = { ...this.queryStr };

        // removing some fields for category
        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach((key) => delete queryCopy[key]);

        // filter for price and rating

        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        // console.log(queryStr);
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }
    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;

        const skip = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
    // price range
    // priceRange() {
    //     if (this.queryStr.price) {
    //         const price = this.queryStr.price.split(",");
    //         this.query = this.query.find({
    //             price: {
    //                 $gte: price[0],
    //                 $lte: price[1],
    //             },
    //         });
    //     }
    //     return this;
    // };
}

module.exports = ApiFeatures;