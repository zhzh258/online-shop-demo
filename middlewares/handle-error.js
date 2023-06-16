function middleware_handle_error(error, req, res, next){
    console.log(error);
    if(error.code !== 500){
        res.status(error.code).render("default/error", {errorType : error.code});
        next();
    }
    else{
        res.status(500).render("default/error", {errorType : 500});
        next();
    }
    
}

module.exports = middleware_handle_error;