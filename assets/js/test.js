const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
let inputImageLoaded = false; // Menandakan bahwa gambar dari input telah dimuat

let images = []; // Array untuk menyimpan gambar tambahan beserta posisi dan ukuran
let isDragging = false;
let dragIndex = -1; // Index gambar yang sedang di-drag
let offsetX = 0, offsetY = 0; // Offset untuk memindahkan gambar

// Event listener untuk input file
document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Menggambar gambar dari input ke canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas
                const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
                const x = (canvas.width / 2) - (img.width / 2) * scale;
                const y = (canvas.height / 2) - (img.height / 2) * scale;

                ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
                inputImageLoaded = true; // Set flag bahwa gambar input sudah dimuat

                // Render ulang gambar tambahan
                renderImages();
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
});

// Event listener untuk gambar dari div addImage
document.querySelectorAll('.addImage img').forEach(image => {
    image.addEventListener('click', function() {
        const img = new Image();
        img.onload = function() {
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.5;
            const x = Math.random() * (canvas.width - img.width * scale); // Posisi acak
            const y = Math.random() * (canvas.height - img.height * scale);

            // Tambahkan data gambar ke array images
            images.push({
                image: img,
                x: x,
                y: y,
                width: img.width * scale,
                height: img.height * scale
            });

            renderImages(); // Render ulang semua gambar
        };

        img.src = this.src;
    });
});

// Fungsi untuk merender ulang gambar di canvas
function renderImages() {
    if (inputImageLoaded) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas
    }

    // Render semua gambar di array images
    images.forEach(imgData => {
        ctx.drawImage(imgData.image, imgData.x, imgData.y, imgData.width, imgData.height);
    });
}

// Fungsi untuk mengecek apakah mouse berada di atas gambar
function isMouseOnImage(x, y, imgData) {
    return x > imgData.x && x < imgData.x + imgData.width && y > imgData.y && y < imgData.y + imgData.height;
}

// Event listener untuk drag and drop
canvas.addEventListener('mousedown', function(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Cek apakah kita mengklik salah satu gambar
    for (let i = 0; i < images.length; i++) {
        if (isMouseOnImage(mouseX, mouseY, images[i])) {
            isDragging = true;
            dragIndex = i;
            offsetX = mouseX - images[i].x;
            offsetY = mouseY - images[i].y;
            break;
        }
    }
});

canvas.addEventListener('mousemove', function(e) {
    if (isDragging) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        // Perbarui posisi gambar yang sedang di-drag
        images[dragIndex].x = mouseX - offsetX;
        images[dragIndex].y = mouseY - offsetY;

        // Render ulang semua gambar
        renderImages();
    }
});

canvas.addEventListener('mouseup', function() {
    isDragging = false; // Selesai dragging
});
