const User = require("../model/model.user");
const util = require("../util/util.auth")

function get_signup(req, res){
    let temp = req.session.signup_cache;
    if(!temp){
        temp = util.init_cache_signup();
    }
    req.session.signup_cache = null;
    // console.log("The temp to be rendered: ====== ",temp);
    res.render("customer/auth/signup", {cache: temp});
}

async function post_signup(req, res){
    const user = new User();
    user.init_with_req(req);
    if(!util.is_valid(req) || await User.is_occupied(user.email)){
        util.cache_signup_error(req, function(){
            res.redirect("/signup")
        });
        return;
    }
    // else: authenticated
    await user.encrypt();
    user.store_in_DB();
    res.redirect("/login")
}

async function get_login(req, res){
    let temp = req.session.login_cache;
    if(!temp){
        temp = util.init_cache_login();
    }
    req.session.login_cache = null;
    // console.log("The temp to be rendered: ====== ",temp);
    res.render("customer/auth/login", {cache: temp});
}

async function post_login(req, res){
    let user = new User();
    user.init_with_req(req);
    // if:  not existing || incorrect password
    if(!await User.is_occupied(user.email) || !await user.is_password_correct()){
        util.cache_login_error(req, function(){
            res.redirect("/login")
        });
        return;
    } 
    
    // else: authenticated
    user = await User.get_user_by_email(user.email);
    console.log(user);
    // the uid stored in session/locals will eventually be a string
    util.create_session_user(req, user, function(){
        res.redirect('/')
    })
}



function post_logout(req, res){
    // drop req.session.uid
    req.session.uid = null;
    res.redirect("/");
}

module.exports = {
    get_signup: get_signup,
    post_signup: post_signup,
    get_login: get_login,
    post_login: post_login,
    post_logout: post_logout
}