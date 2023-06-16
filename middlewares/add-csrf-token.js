function add_csrf_token(req, res, next){
    res.locals.csrfToken = req.csrfToken();
    next();
}

module.exports = add_csrf_token;