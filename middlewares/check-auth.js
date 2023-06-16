function middleware_check_auth(req, res, next) {
    const uid = req.session.uid;

    if (!uid) {
      return next();
    }
  
    res.locals.uid = uid;
    res.locals.first_name = req.session.first_name;
    res.locals.isAuth = true;
    res.locals.isAdmin = req.session.isAdmin;
    next();
  }
  
  

  module.exports = middleware_check_auth;