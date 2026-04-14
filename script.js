// Tunggu semua elemen siap
document.addEventListener("DOMContentLoaded", () => {

    // ===== ELEMENT =====
    const hasil = document.getElementById("hasil");
    const rumusInput = document.getElementById("rumus");
    const historyList = document.getElementById("history");
    const upload = document.getElementById("upload");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    // ===== KALKULATOR AMAN =====
    function hitung() {
        let rumus = rumusInput.value;

        try {
            // Validasi hanya angka & operator
            if (!/^[0-9+\-*/(). ]+$/.test(rumus)) {
                throw "Input tidak valid";
            }

            let hasilHitung = Function('"use strict"; return (' + rumus + ')')();

            hasil.innerText = "Hasil: " + hasilHitung;

            simpanHistory(rumus + " = " + hasilHitung);

        } catch (e) {
            hasil.innerText = "Error 😵";
        }
    }

    // ===== HISTORY =====
    function simpanHistory(text) {
        let data = JSON.parse(localStorage.getItem("history")) || [];
        data.push(text);
        localStorage.setItem("history", JSON.stringify(data));
        tampilHistory();
    }

    function tampilHistory() {
        historyList.innerHTML = "";

        let data = JSON.parse(localStorage.getItem("history")) || [];

        data.slice().reverse().forEach(item => {
            let li = document.createElement("li");
            li.innerText = item;
            historyList.appendChild(li);
        });
    }

    function clearHistory() {
        localStorage.removeItem("history");
        tampilHistory();
    }

    tampilHistory();

    // ===== DARK MODE =====
    function toggleMode() {
        document.body.classList.toggle("dark");
    }

    // ===== UPLOAD GAMBAR =====
    upload.addEventListener("change", (e) => {
        let file = e.target.files[0];
        if (!file) return;

        let reader = new FileReader();

        reader.onload = (event) => {
            let img = new Image();

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
            };

            img.src = event.target.result;
        };

        reader.readAsDataURL(file);
    });

    // ===== FILTER =====
    function grayscale() {
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            let avg = (data[i] + data[i+1] + data[i+2]) / 3;
            data[i] = data[i+1] = data[i+2] = avg;
        }

        ctx.putImageData(imgData, 0, 0);
    }

    function invert() {
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];
            data[i+1] = 255 - data[i+1];
            data[i+2] = 255 - data[i+2];
        }

        ctx.putImageData(imgData, 0, 0);
    }

    function brightness() {
        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] += 40;
            data[i+1] += 40;
            data[i+2] += 40;
        }

        ctx.putImageData(imgData, 0, 0);
    }

    // ===== GLOBAL BIAR BISA DIPANGGIL HTML =====
    window.hitung = hitung;
    window.toggleMode = toggleMode;
    window.grayscale = grayscale;
    window.invert = invert;
    window.brightness = brightness;
    window.clearHistory = clearHistory;

});