import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCjki-ZrLPYKEj695TqvKpOyGXEQy9feSg",
    authDomain: "smartplant-a73df.firebaseapp.com",
    databaseURL: "https://smartplant-a73df-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "smartplant-a73df",
    storageBucket: "smartplant-a73df.firebasestorage.app",
    messagingSenderId: "129765684223",
    appId: "1:129765684223:web:f834cd33219a1d90e92dca",
    measurementId: "G-Y3ZKNS88N7"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

document.addEventListener("DOMContentLoaded", function() {
    // Ambil tombol berdasarkan ID
    let tombolKirim = document.getElementById("setButton");

    // Tambahkan event listener untuk klik
    tombolKirim.addEventListener("click", function() {
        kirimDataKeFirebase(); // Panggil fungsi saat tombol ditekan
    });
});

function kirimDataKeFirebase() {
    let datasetph = document.getElementById("setph").value;

    set(ref(database, 'input/setph'), datasetph)
        .then(() => {
            console.log("Data random berhasil dikirim:",database);
        })
        .catch((error) => {
            console.error("Gagal mengirim data:", error);
        });
}

const ctxa = document.getElementById('myCharta').getContext('2d');
const myCharta = new Chart(ctxa, {
    type: 'line',
    data: {
        labels: [], // Label kosong akan diisi dengan data real-time
        datasets: [
            { label: 'kelembaban', data: [], borderColor: 'blue', fill: false, tension: 0.1 },
            { label: 'Suhu udara(°C)', data: [], borderColor: 'red', fill: false, tension: 0.1 },
        ]
    },
    options: {
        scales: {
            x: { title: { display: true, text: 'Waktu' } },
            y: { title: { display: true, text: 'Nilai' } }
        }
    }
});

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Label kosong akan diisi dengan data real-time
        datasets: [
            { label: 'pH', data: [], borderColor: 'blue', fill: false, tension: 0.1 },
            { label: 'Suhu Air(°C)', data: [], borderColor: 'red', fill: false, tension: 0.1 },
            { label: 'TDS (ppm)', data: [], borderColor: 'purple', fill: false, tension: 0.1 }
        ]
    },
    options: {
        scales: {
            x: { title: { display: true, text: 'Waktu' } },
            y: { title: { display: true, text: 'Nilai' } }
        }
    }
});

function updateSensorData(snapshot) {
    const data = snapshot.val();
    
    // Perbarui nilai sensor di halaman
    document.getElementById('ph-value').innerText = data.ph || 'N/A';
    document.getElementById('suhu-value').innerText = data.suhu || 'N/A';
    document.getElementById('kekeruhan-value').innerText = data.kekeruhan || 'N/A';
    document.getElementById('tds-value').innerText = data.tds || 'N/A';

    // Tambahkan label waktu
    const timestamp = new Date().toLocaleTimeString();
    myChart.data.labels.push(timestamp);
    
    // Perbarui dataset dengan nilai baru
    myChart.data.datasets[0].data.push(data.ph);
    myChart.data.datasets[1].data.push(data.suhu);
    myChart.data.datasets[2].data.push(data.kekeruhan);
    myChart.data.datasets[3].data.push(data.tds);
    
    // Batasi jumlah data yang ditampilkan (misal 10 data terakhir)
    if (myChart.data.labels.length > 10) {
        myChart.data.labels.shift();
        myChart.data.datasets.forEach(dataset => dataset.data.shift());
    }
    
    // Perbarui chart
    myChart.update();
}

function tampilkanWaktuInternet() {
    fetch("http://worldtimeapi.org/api/timezone/Asia/Jakarta")
        .then(response => response.json())
        .then(data => {
            const dateTime = new Date(data.datetime);
            const jam = dateTime.getHours();
            const menit = dateTime.getMinutes();
            const detik = dateTime.getSeconds();

            const waktuSekarang =
                (jam < 10 ? "0" + jam : jam) + ":" +
                (menit < 10 ? "0" + menit : menit) + ":" +
                (detik < 10 ? "0" + detik : detik);

            document.getElementById("waktu").textContent = waktuSekarang;
        })
        .catch(error => {
            console.error("Gagal mengambil waktu dari API:", error);
        });
}

setInterval(tampilkanWaktuInternet, 1000);
tampilkanWaktuInternet();

const sensorRef = ref(database, 'sensor');
onValue(sensorRef, (snapshot) => {
    updateSensorData(snapshot);
}, (error) => {
    console.error("Error fetching data: ", error);
});
