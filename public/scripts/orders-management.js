const form_eles = document.querySelectorAll(".order-item-form-control")

for(form_ele of form_eles){
    const btn_ele = form_ele.querySelector("button");
    btn_ele.addEventListener("click", updateStatus)
}

async function updateStatus(event){
    event.preventDefault();
    const btn_ele = event.target;
    const form_ele = btn_ele.parentElement.parentElement;
    const formData = new FormData(form_ele);

    const csrf = formData.get("_csrf")
    const id = formData.get("id")
    const status = formData.get("status")

    const reqBody = JSON.stringify({
        id: id,
        status: status,
        _csrf: csrf
    })
    const reqHeader = {
        "Content-Type": "application/json"
    }

    let response;
    try{
        response = await fetch("/admin/orders", {
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
    console.log(responseData);

    const current_status_ele = form_ele.querySelector(".order-item-status");
    current_status_ele.textContent = "Current status: " + responseData.new_status;

}