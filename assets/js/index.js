const canvas = document.getElementById('imageCanvas');
const memeMakerContainer = document.querySelector('.memeMakerContainer');
const uploadImageContainer = document.querySelector('.uploadImageContainer');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');

const toggleButton = document.getElementById('toggleMirror');

let isMirrored = false;  
let inputImage = null; // Variabel untuk menyimpan gambar dari input
let inputImageLoaded = false; // Flag untuk memastikan gambar input sudah dimuat
let images = []; // Array untuk menyimpan gambar tambahan
let isDragging = false;
let dragIndex = -1; // Index gambar yang sedang di-drag
let offsetX = 0, offsetY = 0; // Offset untuk memindahkan gambar

let addImageClicked = []; // Array untuk menyimpan status klik

// Panel pengaturan elemen
const settingsPanel = document.getElementById('settingsPanel');
const rotateInput = document.getElementById('rotate');
const sizeInput = document.getElementById('size'); 

// Event listener untuk input file
document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];

    // container
    memeMakerContainer.classList.remove('hidden');
    memeMakerContainer.classList.add('flex');
    
    uploadImageContainer.classList.add('hidden')
    uploadImageContainer.classList.remove('flex')

    // file image 
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

                // Render ulang canvas setelah gambar input dimuat
                renderImages();
    
            };

            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        
    }  else {
        alert('Please upload a valid image file.');
    }
});




// Event listener untuk gambar dari div addImage
// Event listener untuk gambar dari div addImage
document.querySelectorAll('.addImage').forEach((imageDiv) => {
    const img = imageDiv.querySelector('img');

    img.addEventListener('click', function() {
        const newImg = new Image(); // Buat objek gambar baru
        newImg.onload = function() {
            
            newImg.style.backgroundColor="red";
            const scale = Math.min(canvas.width / newImg.width, canvas.height / newImg.height) * 0.5;
            const x = Math.random() * (canvas.width - newImg.width * scale); // Posisi acak
            const y = Math.random() * (canvas.height - newImg.height * scale);

            // Tambahkan data gambar ke array images
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

            imageDiv.classList.add('active'); // Tambahkan class active ke elemen addImage

            renderImages(); // Render ulang semua gambar
        };

        newImg.src = this.src; // Set sumber gambar baru
    });
});


// Fungsi untuk merender ulang gambar di canvas
function renderImages() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Bersihkan canvas

    // Render gambar dari input
    if (inputImageLoaded) {
        drawImage(inputImage);
    }

    // Render semua gambar tambahan di array images
    images.forEach(imgData => {
        drawImage(imgData);
    });
}


// Fungsi untuk menggambar gambar dengan pengaturan
function drawImage(imgData) {
    ctx.save(); // Simpan konteks saat ini

    // Terapkan rotasi dan cermin
    ctx.translate(imgData.x + imgData.width / 2, imgData.y + imgData.height / 2); // Pindahkan titik referensi
    ctx.rotate((imgData.rotation * Math.PI) / 180); // Terapkan rotasi
    if (imgData.mirror) {
        ctx.scale(-1, 1); // Cermin
    }
    ctx.drawImage(imgData.image, -imgData.width / 2, -imgData.height / 2, imgData.width, imgData.height); // Gambar
    ctx.restore(); // Kembalikan konteks ke keadaan sebelumnya
}

// Fungsi untuk mengecek apakah mouse berada di atas gambar
function isMouseOnImage(x, y, imgData) {
    return x > imgData.x && x < imgData.x + imgData.width && y > imgData.y && y < imgData.y + imgData.height;
}


let selectedImageIndex = -1; // Variabel untuk menyimpan index gambar yang dipilih





// Fungsi untuk menukar posisi elemen dalam array
function swapArrayElements(arr, index1, index2) {
    if (index1 >= 0 && index2 >= 0 && index1 < arr.length && index2 < arr.length) {
        const temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
    }
}

// Event listener untuk tombol 'Bring to Front' (+1 Index)
document.getElementById('bringToFrontButton').addEventListener('click', function() {
    if (selectedImageIndex < images.length - 1) {
        // Geser elemen gambar satu posisi ke depan (meningkatkan z-index)
        swapArrayElements(images, selectedImageIndex, selectedImageIndex + 1);
        selectedImageIndex++; // Update selectedImageIndex
        renderImages(); // Render ulang gambar
    }
});

// Event listener untuk tombol 'Send to Back' (-1 Index)
document.getElementById('sendToBackButton').addEventListener('click', function() {
    if (selectedImageIndex > 0) {
        // Geser elemen gambar satu posisi ke belakang (menurunkan z-index)
        swapArrayElements(images, selectedImageIndex, selectedImageIndex - 1);
        selectedImageIndex--; // Update selectedImageIndex
        renderImages(); // Render ulang gambar
    }
});


canvas.addEventListener('mousedown', function(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
    let isOverImage = false;

    // Cek apakah kita mengklik salah satu gambar
    for (let i = 0; i < images.length; i++) {
        const imgData = images[i];
        const centerX = imgData.x + imgData.width / 2;
        const centerY = imgData.y + imgData.height / 2;
        const marginRight = imgData.width * .8; // Margin 20% hanya di sisi kanan
        const marginY = imgData.height * 0.2; // Margin 20% atas dan bawah

        // Cek apakah mouse berada di sisi kanan gambar (dalam margin) atau di tengah
        if (mouseX > imgData.x && mouseX < imgData.x + imgData.width + marginRight &&
            mouseY > imgData.y - marginY && mouseY < imgData.y + imgData.height + marginY) {
            isDragging = true;
            dragIndex = i;
            offsetX = mouseX - images[i].x;
            offsetY = mouseY - images[i].y;

             // Posisi settingsPanel di sebelah kiri gambar yang di-drag
             const panelX = images[i].x; 
             const panelY = images[i].y + 100;
             // Set posisi settingsPanel dan tampilkan
             const settingsPanel = document.getElementById('settingsPanel');
             settingsPanel.style.left = `${panelX}px`;
             settingsPanel.style.top = `${panelY}px `;
             settingsPanel.style.display = 'flex'; // Tampilkan panel
         
            break;
        }
        canvas.style.cursor = isOverImage ? 'grabbing' : 'grab';    
    }

});

// mousemove
canvas.addEventListener('mousemove', function(e) {
    if (isDragging) {
        const mouseX = e.offsetX;
        const mouseY = e.offsetY;

        // Perbarui posisi gambar yang sedang di-drag
        images[dragIndex].x = mouseX - offsetX;
        images[dragIndex].y = mouseY - offsetY;
 
        
         // Cek apakah mouse berada di atas gambar
    let isOverImage = false;
    for (let i = 0; i < images.length; i++) {
        if (isMouseOnImage(mouseX, mouseY, images[i])) {
            isOverImage = true; // Mouse berada di atas gambar 

                       // Posisi settingsPanel di sebelah kiri gambar yang di-drag
                       const panelX = images[i].x; // 150 bisa disesuaikan dengan lebar panel
                       const panelY = images[i].y + 100;
                       // Set posisi settingsPanel dan tampilkan
                       const settingsPanel = document.getElementById('settingsPanel');
                       settingsPanel.style.left = `${panelX}px`;
                       settingsPanel.style.top = `${panelY}px `;
                       settingsPanel.style.display = 'flex'; // Tampilkan panel
            break;
        }
    }

    // Ubah kursor berdasarkan posisi mouse
    canvas.style.cursor = isOverImage ? 'grabbing' : 'grab'; 
    // Jika di atas gambar, ubah kursor


        // Render ulang semua gambar
        renderImages();
    }
});

canvas.addEventListener('mouseup', function() {
    isDragging = false; // Selesai dragging 
    canvas.style.cursor = 'grab'; // Kembalikan kursor
});



// Update pengaturan saat diubah
rotateInput.addEventListener('input', function() {
    if (dragIndex >= 0) {
        images[dragIndex].rotation = parseFloat(this.value);
        renderImages(); // Render ulang semua gambar
    }
});

sizeInput.addEventListener('input', function() {
    if (dragIndex >= 0) {
        // Perbarui ukuran berdasarkan skala
        const scale = parseFloat(this.value);
        images[dragIndex].scale = scale;

        // Perbarui width dan height berdasarkan skala
        images[dragIndex].width = images[dragIndex].image.width * scale;
        images[dragIndex].height = images[dragIndex].image.height * scale;

        renderImages(); // Render ulang semua gambar
    }
});

 

toggleButton.addEventListener('click', function() {
    isMirrored = !isMirrored; // Toggle statusnya
    if (dragIndex >= 0) {
        images[dragIndex].mirror = isMirrored;
        renderImages(); // Render ulang semua gambar
    } 
});



// Event listener untuk tombol Download Image
document.getElementById('downloadButton').addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'meme_maker.png'; // Nama file yang akan diunduh
    link.href = canvas.toDataURL('image/png'); // Mengambil data URL dari canvas
    link.click(); // Men-trigger download
});


// Event listener untuk tombol Delete di settingsPanel
document.getElementById('deleteButton').addEventListener('click', function() { 
    if (selectedImageIndex !== -1) {
        // Hapus gambar yang dipilih dari array images
        images.splice(selectedImageIndex, 1);

        // Reset selectedImageIndex setelah penghapusan
        selectedImageIndex = -1;

        // Render ulang semua gambar setelah penghapusan
        renderImages();

        // Sembunyikan settingsPanel setelah penghapusan
        document.getElementById('settingsPanel').style.display = 'none';

               // Cek apakah semua gambar telah dihapus
               if (images.length === 0) {
                // Remove class 'active' dari semua elemen addImage
                document.querySelectorAll('.addImage').forEach(imageDiv => {
                    imageDiv.classList.remove('active');
                });
            }
    }
});

// Event listener untuk drag and drop pada canvas
canvas.addEventListener('mousedown', function(e) {
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;

    // Cek apakah kita mengklik salah satu gambar
    for (let i = 0; i < images.length; i++) {
        if (isMouseOnImage(mouseX, mouseY, images[i])) {
            isDragging = true;
            selectedImageIndex = i;  // Simpan index gambar yang dipilih
            offsetX = mouseX - images[i].x;
            offsetY = mouseY - images[i].y;

            // Tampilkan settingsPanel ketika gambar dipilih
            const settingsPanel = document.getElementById('settingsPanel');
            settingsPanel.style.display = 'flex';
            settingsPanel.style.left = `${images[i].x}px`; // Posisikan di dekat gambar
            settingsPanel.style.top = `${images[i].y}px`;

            break;
        }
    }
});

// Event listener untuk tombol Restart
document.getElementById('restartButton').addEventListener('click', function() { 
    images = []; 
     // Sembunyikan settingsPanel setelah penghapusan
     document.getElementById('settingsPanel').style.display = 'none';
    document.querySelectorAll('.addImage').forEach(imageDiv => {
        imageDiv.classList.remove('active');
    });

    // Render ulang canvas untuk menghapus gambar
    renderImages();
});



// choise button
 // Seleksi semua tombol di dalam container
 const buttons = document.querySelectorAll('.choiseBtnContainer button');
 // Seleksi semua elemen dengan id yang sama dengan data-btn
 const contentElements = document.querySelectorAll('.choiseMemes');

 buttons.forEach(button => {
     button.addEventListener('click', () => {
         // Hapus class 'active' dari semua tombol
         buttons.forEach(btn => btn.classList.remove('active'));
         // Tambahkan class 'active' ke tombol yang diklik
         button.classList.add('active');

         // Dapatkan nilai data-btn dari tombol yang diklik
         const btnData = button.getAttribute('data-btn');

         // Loop untuk menghilangkan class 'active' dari semua content
         contentElements.forEach(content => {
             // Cek apakah id content sama dengan data-btn
             if (content.id === btnData) {
                 content.classList.add('active');
             } else {
                 content.classList.remove('active');
             }
         });
     });
 });


 const settingContainer = document.querySelector('.settingContainer');

 settingContainer.addEventListener('click',() => {
    document.getElementById('settingsPanel').style.display = 'none';

 })