function middleware_check_admin(req, res, next) {
    // console.log(res.locals)
    const isAuth = res.locals.isAuth;
    const isAdmin = res.locals.isAdmin;

    if(!isAuth){
        res.render("default/error", {errorType: 401})
    }
    if(!isAdmin && req.path.startsWith("/admin")){
        res.render("default/error", {errorType: 403})
    }
    next();
  }
  
  

  module.exports = middleware_check_admin;