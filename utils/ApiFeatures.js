class ApiFeatures{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    filter()
    {
        let queryString = JSON.stringify(this.queryStr);
        queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g,(match)=>`$${match}`);
        let queryObj = JSON.parse(queryString);
        delete queryObj.sort
        delete queryObj.fields
        delete queryObj.limit
        delete queryObj.page
        this.query = this.query.find(queryObj);
        return this;
    }
    sort(){
        if (this.queryStr.sort){
            const sortBy = this.queryStr.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        }else{
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    limitFields(){
        if (this.queryStr.fields){
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query=this.query.select(fields) 
        }else{
            this.query=this.query.select('-__v');
        }
        return this;
    }
    paginate(){
        const page = this.queryStr.page*1||1;
        const limit = this.queryStr.limit*1||10;
        const skip = (page-1)*limit;
        this.query = this.query.skip(skip).limit(limit);
        // if (this.queryStr.page){
        //     const moviesCount = await Movie.countDocuments()
        //     if (skip>=moviesCount){
        //         throw new Error('This page is not found')
        //     }
        // }
        return this;
    }
}
module.exports = ApiFeatures