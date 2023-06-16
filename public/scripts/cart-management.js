const badge_ele = document.querySelector("nav .badge")
const cart_item_form_eles = document.querySelectorAll(".cart-item-form")
const cart_item_input_eles = document.querySelectorAll(".cart-item-form input")
const cart_item_btn_eles = document.querySelectorAll(".cart-item-form button")
const cart_total_price_ele = document.querySelector("#cart-total-price i")
const cart_submit_btn_ele = document.querySelector("#cart-submit-btn")

for(const cart_item_form_ele of cart_item_form_eles){
    cart_item_form_ele.addEventListener("submit", updateCart)
}

async function updateCart(event){
    event.preventDefault();
    const form_ele = event.target;
    const article_ele = form_ele.parentElement;
    
    console.log(form_ele);
    const id = form_ele.dataset.id;
    const csrf = form_ele.dataset.csrf;
    const input_ele = form_ele.querySelector("input");
    const quantity = +input_ele.value;

    const reqBody = JSON.stringify({
        id: id,
        quantity: quantity,
        _csrf: csrf
    })
    const reqHeader = {
        "Content-Type": "application/json"
    }

    let response;
    try{
        response = await fetch("/cart/item", {
            method: "PATCH",
            body: reqBody,
            headers: reqHeader
        })
    } catch(error){
        alert("failed to fetch request to the server")
        return;
    }
    if(!response.ok){
        alert("server side error")
        return;
    }

    const responseData = await response.json();
    // The client has responded
    const item_price_ele = article_ele.querySelector(".cart-item-price")
    const item_quantity_ele = article_ele.querySelector(".cart-item-quantity")
    const item_sum_ele = article_ele.querySelector(".cart-item-sum")
    
    if(responseData.should_remove){
        article_ele.remove();

    } else{
        item_price_ele.textContent = responseData.item_price;
        item_quantity_ele.textContent = responseData.item_quantity;
        item_sum_ele.textContent = responseData.item_sum;
    }

    cart_total_price_ele.textContent = responseData.cart_totalPrice;
    console.log("now the cart_quantity is: ", responseData.cart_quantity)
    if(responseData.cart_quantity === 0){
        cart_submit_btn_ele.remove();

        const node = document.createElement("p");
        const textnode = document.createTextNode("The cart is empty");
        node.appendChild(textnode);
        document.querySelector("main").appendChild(node);
    }
    badge_ele.textContent = responseData.nav_badge;
}

