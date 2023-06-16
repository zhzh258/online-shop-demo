const User = require("../model/model.user");

function is_valid_post(req){
    const user = new User();
    user.init_with_req(req);
    const password_confirm = req.body["password-confirm"]
    const password = user.password;

    return (
        user.first_name.trim() !== "" &&
        user.last_name.trim() !== "" &&
        user.shipping_address.trim() !== "" &&
        user.password === password_confirm
    );
}

async function cache_signup_error(req, action){
    const user = new User();
    user.init_with_req(req);
    const password_confirm = req.body["password-confirm"]
    const password = user.password;
    const is_occupied = await User.is_occupied(user.email);

    
    user.password = undefined; // drop the password

    req.session.signup_cache = {
        has_error: true,
        data: user,
        message: "Please check your data",
        hint:{
            email: (is_occupied) ? true: false,
            password: password !== password_confirm,
            first_name: user.first_name.trim() === "",
            last_name: user.last_name.trim() === "",
            phone_number: false,
            shipping_address: user.shipping_address.trim() === "",
        }
    }
    if(is_occupied){
        req.session.signup_cache.message = "Try another email address";
        req.session.signup_cache.hint.password = null;
    }

    req.session.save(action)
    return;
}

function init_cache_signup(){
    return {
        has_error: false,
        data: new User(),
        message: null,
        hint:{}        
    }
}

async function cache_login_error(req, action){
    const user = new User();
    user.init_with_req(req);
    // no such user
    if(!await User.is_occupied(user.email)){ 
        req.session.login_cache = {
            has_error: true,
            data: {
                email: user.email
            },
            message: "No such user",
            hint:{
                email: true,
                password: false,
            }
        }
        req.session.save(action)
        return;
    } 
    // incorrect password
    else if(!await user.is_password_correct()){ 
        req.session.login_cache = {
            has_error: true,
            data: {
                email: user.email
            },
            message: "Incorrect password",
            hint:{
                email: false,
                password: true
            }
        }
        req.session.save(action)
        return;
    }
}

function init_cache_login(){
    return {
        has_error: false,
        data: new User(),
        message: null,
        hint:{}
    }
}

// stored in session: uid, isAuth, isAdmin 
// see middleware.auth
function create_session_user(req, user, action){
    req.session.uid = user._id.toString();
    req.session.first_name = user.first_name;
    req.session.isAdmin = user.isAdmin;
    req.session.save(action);
}

function delete_session_user(req){
    req.session.uid = null;
    req.session.isAdmin = undefined;
}

module.exports = {
    is_valid: is_valid_post,
    cache_signup_error: cache_signup_error,
    cache_login_error: cache_login_error,
    init_cache_signup: init_cache_signup,
    init_cache_login: init_cache_login,
    create_session_user: create_session_user,
    delete_session_user: delete_session_user
}

