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

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Variabel global sensor
let nilaiph, nilaitds, nilaisuhua, nilaisuhuu, nilaikelembaban;

// Fungsi untuk memetakan nilai
function map(value, fromLow, fromHigh, toLow, toHigh) {
    return (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow;
}

// Fungsi untuk update tampilan bar
function setBar(barId, value) {
    value = Math.max(0, Math.min(100, parseInt(value)));
    const bar = document.getElementById(barId);
    bar.style.height = value + "%";
    bar.innerText = value + "%";
}

// Fungsi update data sensor
function updateSensorData(snapshot) {
    const data = snapshot.val();

    document.getElementById('ph-value').innerText = data.ph ?? 'N/A';
    document.getElementById('tds-value').innerText = data.tds ?? 'N/A';
    document.getElementById('suhua-value').innerText = data.suhuair ?? 'N/A';
    document.getElementById('suhuu-value').innerText = data.suhuudara ?? 'N/A';
    document.getElementById('kelembaban-value').innerText = data.kelembaban ?? 'N/A';

    // Hitung nilai persentase untuk progress bar
    nilaiph = map(data.ph, 5, 7, 0, 100);
    nilaitds = map(data.tds, 500, 2000, 0, 100);
    nilaisuhua = map(data.suhuair, 15, 30, 0, 100);
    nilaisuhuu = map(data.suhuudara, 15, 30, 0, 100);
    nilaikelembaban = map(data.kelembaban, 40, 80, 0, 100);

    // Tampilkan bar
    setBar("phbar", nilaiph);
    setBar("tdsbar", nilaitds);
    setBar("airbar", nilaisuhua);
    setBar("udarabar", nilaisuhuu);
    setBar("kelembabanbar", nilaikelembaban);

    // Tambahkan data ke chart
    const timestamp = new Date().toLocaleTimeString();
    myChart.data.labels.push(timestamp);
    myChart.data.datasets[0].data.push(data.ph);
    myChart.data.datasets[1].data.push(data.suhuair);
    myChart.data.datasets[2].data.push(data.tds);
    myChart.data.datasets[3].data.push(data.suhuudara);
    myChart.data.datasets[4].data.push(data.kelembaban);

    // Batasi jumlah data yang ditampilkan
    if (myChart.data.labels.length > 10) {
        myChart.data.labels.shift();
        myChart.data.datasets.forEach(dataset => dataset.data.shift());
    }

    myChart.update();
}

// Inisialisasi Chart.js
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [
            { label: 'pH', data: [], borderColor: 'blue', fill: false, tension: 0.1 },
            { label: 'Suhu Air (°C)', data: [], borderColor: 'red', fill: false, tension: 0.1 },
            { label: 'TDS (ppm)', data: [], borderColor: 'green', fill: false, tension: 0.1 },
            { label: 'Suhu Udara (°C)', data: [], borderColor: 'orange', fill: false, tension: 0.1 },
            { label: 'Kelembaban (%)', data: [], borderColor: 'purple', fill: false, tension: 0.1 }
        ]
    },
    options: {
        scales: {
            x: { title: { display: false, text: 'Waktu' } },
            y: { title: { display: false, text: 'Nilai' } }
        }
    }
});

// Fungsi untuk menampilkan waktu dari internet
function tampilkanWaktuInternet() {
    fetch("https://timeapi.io/api/Time/current/zone?timeZone=Asia/Jakarta")
        .then(response => response.json())
        .then(data => {
            const dateTime = new Date(data.dateTime);
            const jam = String(dateTime.getHours()).padStart(2, '0');
            const menit = String(dateTime.getMinutes()).padStart(2, '0');
            const detik = String(dateTime.getSeconds()).padStart(2, '0');

            const waktuSekarang = `${jam}:${menit}:${detik}`;
            document.getElementById("waktu").textContent = waktuSekarang;
            document.getElementById("time").textContent = waktuSekarang;
        })
        .catch(error => {
            console.error("Gagal mengambil waktu dari API:", error);
        });
}

// Ambil data sensor secara real-time dari Firebase
const sensorRef = ref(database, 'sensor');
onValue(sensorRef, updateSensorData, (error) => {
    console.error("Error fetching data: ", error);
});
