const image_uploaded_ele = document.querySelector(".form-control-image > input")
const image_preview_ele = document.querySelector(".form-control-image > img");


function update_image_preview(){
    const imageFiles = image_uploaded_ele.files;
    if(!imageFiles || imageFiles.length == 0 ){
        image_preview_ele.style.display="hidden";
        return;
    } 
    const imageFile = imageFiles[0];
    // console.log(imageFile)
    const url = URL.createObjectURL(imageFile);
    image_preview_ele.src = url;
}


image_uploaded_ele.addEventListener("change", update_image_preview)