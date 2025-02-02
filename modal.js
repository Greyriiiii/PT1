let selectedFile;
let canvas = document.getElementById("imageCanvas");
let ctx = canvas.getContext("2d");

document.getElementById("mediaInput").addEventListener("change", function (event) {
    selectedFile = event.target.files[0];

    if (selectedFile && selectedFile.type.startsWith("image/")) {
        openModal();
        loadImageForEditing(selectedFile);
    }
});

function openModal() {
    document.getElementById("imageEditModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("imageEditModal").style.display = "none";
}

function loadImageForEditing(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

function resizeImage(scale) {
    const img = new Image();
    img.src = canvas.toDataURL();
    img.onload = function () {
        let newWidth = (img.width * scale) / 100;
        let newHeight = (img.height * scale) / 100;
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
    };
}

function saveEditedImage() {
    const editedImageURL = canvas.toDataURL();
    const newFile = dataURLtoFile(editedImageURL, selectedFile.name);
    document.getElementById("mediaInput").files = createFileList(newFile);
    closeModal();
}

function dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(","), mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}

function createFileList(file) {
    let dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    return dataTransfer.files;
}
