const product_items_control_eles = document.querySelectorAll(".products-item-control");
const add_btn_eles = document.querySelectorAll(".products-item-control .add-to-cart");
console.log(add_btn_eles)
const cart_badge_ele = document.querySelector("nav .badge")

for(const add_btn_ele of add_btn_eles){
    add_btn_ele.addEventListener("click", addToCart);
}


async function addToCart(event){
    const btn = event.target;
    const id = btn.dataset.id;
    const csrf = btn.dataset.csrf;

    const reqBody = JSON.stringify({
        id: id,
        _csrf: csrf
    })
    const reqHeader = {
        "Content-Type": "application/json"
    }

    let response;
    try{
        response = await fetch("/cart/item", {
            method: "POST",
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
    const cart_quantity = responseData.cart_quantity;
    cart_badge_ele.textContent = cart_quantity;
}

