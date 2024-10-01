const canvas = document.getElementById('imageCanvas');
const memeMakerContainer = document.querySelector('.memeMakerContainer');
const uploadImageContainer = document.querySelector('.uploadImageContainer');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
const toggleButton = document.getElementById('toggleMirror');

let isMirrored = false;  
let inputImage = null; 
let inputImageLoaded = false; 
let images = []; 
let isDragging = false;
let dragIndex = -1; 
let offsetX = 0, offsetY = 0; 

let addImageClicked = []; 

const settingsPanel = document.getElementById('settingsPanel');
const rotateInput = document.getElementById('rotate');
const sizeInput = document.getElementById('size'); 

document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    memeMakerContainer.classList.remove('hidden');
    memeMakerContainer.classList.add('flex');
    uploadImageContainer.classList.add('hidden');
    uploadImageContainer.classList.remove('flex');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                inputImage = {
                    image: img,
                    x: 0,
                    y: 0,
                    width: canvas.width,
                    height: canvas.height,
                    rotation: 0,
                    scale: 1,
                    mirror: false
                };
                inputImageLoaded = true; 
                renderImages();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please upload a valid image file.');
    }
});

document.querySelectorAll('.addImage').forEach((imageDiv) => {
    const img = imageDiv.querySelector('img');
    img.addEventListener('click', function() {
        const newImg = new Image();
        newImg.onload = function() {
            newImg.style.backgroundColor="red";
            const scale = Math.min(canvas.width / newImg.width, canvas.height / newImg.height) * 0.5;
            const x = Math.random() * (canvas.width - newImg.width * scale); 
            const y = Math.random() * (canvas.height - newImg.height * scale);
            images.push({
                image: newImg,
                x: x,
                y: y,
                width: newImg.width * scale,
                height: newImg.height * scale,
                rotation: 0,
                scale: 1,
                mirror: false
            });
            imageDiv.classList.add('active');
            renderImages();
        };
        newImg.src = this.src;
    });
});

function renderImages() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (inputImageLoaded) {
        drawImage(inputImage);
    }
    images.forEach(imgData => {
        drawImage(imgData);
    });
}

function drawImage(imgData) {
    ctx.save();
    ctx.translate(imgData.x + imgData.width / 2, imgData.y + imgData.height / 2);
    ctx.rotate((imgData.rotation * Math.PI) / 180);
    if (imgData.mirror) {
        ctx.scale(-1, 1);
    }
    ctx.drawImage(imgData.image, -imgData.width / 2, -imgData.height / 2, imgData.width, imgData.height);
    ctx.restore();
}

function isMouseOnImage(x, y, imgData) {
    return x > imgData.x && x < imgData.x + imgData.width && y > imgData.y && y < imgData.y + imgData.height;
}

let selectedImageIndex = -1;

function swapArrayElements(arr, index1, index2) {
    if (index1 >= 0 && index2 >= 0 && index1 < arr.length && index2 < arr.length) {
        const temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
    }
}

document.getElementById('bringToFrontButton').addEventListener('click', function() {
    if (selectedImageIndex < images.length - 1) {
        swapArrayElements(images, selectedImageIndex, selectedImageIndex + 1);
        selectedImageIndex++;
        renderImages();
    }
});

document.getElementById('sendToBackButton').addEventListener('click', function() {
    if (selectedImageIndex > 0) {
        swapArrayElements(images, selectedImageIndex, selectedImageIndex - 1);
        selectedImageIndex--;
        renderImages();
    }
});

canvas.addEventListener('mousedown', function(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    let isOverImage = false;

    for (let i = 0; i < images.length; i++) {
        const imgData = images[i];
        const centerX = imgData.x + imgData.width / 2;
        const centerY = imgData.y + imgData.height / 2;
        const marginRight = imgData.width * .8; 
        const marginY = imgData.height * 0.2; 

        if (mouseX > imgData.x && mouseX < imgData.x + imgData.width + marginRight &&
            mouseY > imgData.y - marginY && mouseY < imgData.y + imgData.height + marginY) {
            isDragging = true;
            dragIndex = i;
            offsetX = mouseX - images[i].x;
            offsetY = mouseY - images[i].y;
            const panelX = images[i].x; 
            const panelY = images[i].y + 100;
            const settingsPanel = document.getElementById('settingsPanel');
            settingsPanel.style.left = `${panelX}px`;
            settingsPanel.style.top = `${panelY}px `;
            settingsPanel.style.display = 'flex'; 
            break;
        }
        canvas.style.cursor = isOverImage ? 'grabbing' : 'grab';    
    }
});

canvas.addEventListener('mousemove', function(e) {
    if (isDragging) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        images[dragIndex].x = mouseX - offsetX;
        images[dragIndex].y = mouseY - offsetY;
        let isOverImage = false;
        for (let i = 0; i < images.length; i++) {
            if (isMouseOnImage(mouseX, mouseY, images[i])) {
                isOverImage = true; 
                const panelX = images[i].x; 
                const panelY = images[i].y + 100;
                const settingsPanel = document.getElementById('settingsPanel');
                settingsPanel.style.left = `${panelX}px`;
                settingsPanel.style.top = `${panelY}px `;
                settingsPanel.style.display = 'flex'; 
                break;
            }
        }
        canvas.style.cursor = isOverImage ? 'grabbing' : 'grab'; 
        renderImages();
    }
});

canvas.addEventListener('mouseup', function() {
    isDragging = false; 
    canvas.style.cursor = 'grab'; 
});

rotateInput.addEventListener('input', function() {
    if (dragIndex >= 0) {
        images[dragIndex].rotation = parseFloat(this.value);
        renderImages(); 
    }
});

sizeInput.addEventListener('input', function() {
    if (dragIndex >= 0) {
        const scale = parseFloat(this.value);
        images[dragIndex].scale = scale;
        images[dragIndex].width = images[dragIndex].image.width * scale;
        images[dragIndex].height = images[dragIndex].image.height * scale;
        renderImages(); 
    }
});

toggleButton.addEventListener('click', function() {
    isMirrored = !isMirrored; 
    if (dragIndex >= 0) {
        images[dragIndex].mirror = isMirrored;
        renderImages(); 
    } 
});

document.getElementById('downloadButton').addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'meme_maker.png'; 
    link.href = canvas.toDataURL('image/png'); 
    link.click(); 
});

document.getElementById('deleteButton').addEventListener('click', function() { 
    if (selectedImageIndex !== -1) {
        images.splice(selectedImageIndex, 1);
        selectedImageIndex = -1;
        renderImages();
        document.getElementById('settingsPanel').style.display = 'none';
        if (images.length === 0) {
            document.querySelectorAll('.addImage').forEach(imageDiv => {
                imageDiv.classList.remove('active');
            });
        }
    }
});

canvas.addEventListener('mousedown', function(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    for (let i = 0; i < images.length; i++) {
        if (isMouseOnImage(mouseX, mouseY, images[i])) {
            isDragging = true;
            selectedImageIndex = i;  
            offsetX = mouseX - images[i].x;
            offsetY = mouseY - images[i].y;
            const settingsPanel = document.getElementById('settingsPanel');
            settingsPanel.style.display = 'flex';
            settingsPanel.style.left = `${images[i].x}px`;
            settingsPanel.style.top = `${images[i].y + 100}px`;
            break;
        }
    }
});

canvas.addEventListener('mouseup', function() {
    isDragging = false;
});

canvas.addEventListener('mousemove', function(e) {
    if (isDragging && selectedImageIndex !== -1) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;
        images[selectedImageIndex].x = mouseX - offsetX;
        images[selectedImageIndex].y = mouseY - offsetY;
        renderImages();
    }
});

