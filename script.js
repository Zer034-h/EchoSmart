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

const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Label kosong akan diisi dengan data real-time
        datasets: [
            {
                label: 'pH',
                data: [1],
                borderColor: 'blue',
                fill: false,
                tension: 0.1
            },
            {
                label: ' °C',
                data: [2],
                borderColor: 'red',
                fill: false,
                tension: 0.1
            },
            {
                label: 'ppm',
                data: [3],
                borderColor: 'green',
                fill: false,
                tension: 0.1
            },
            {
                label: 'suhuu',
                data: [4],
                borderColor: 'orange',
                fill: false,
                tension: 0.1
            },
            {
                label: 'kelembaban',
                data: [5],
                borderColor: 'brown',
                fill: false,
                tension: 0.1
            }
        ]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: false,
                    text: 'Waktu'
                }
            },
            y: {
                title: {
                    display: false,
                    text: 'Nilai'
                }
            }
        }
    }
});



function updateSensorData(snapshot) {
    const data = snapshot.val();
    
    // Perbarui nilai sensor di halaman
    document.getElementById('ph-value').innerText = data.ph || 'N/A';
    document.getElementById('tds-value').innerText = data.tds || 'N/A';
    document.getElementById('suhua-value').innerText = data.suhuair || 'N/A';
    document.getElementById('suhuu-value').innerText = data.suhuudara || 'N/A';
    document.getElementById('kelembaban-value').innerText = data.kelembaban|| 'N/A';
    document.getElementById('ph-valuea').innerText = data.ph || 'N/A';
    document.getElementById('tds-valuea').innerText = data.tds || 'N/A';
    document.getElementById('suhua-valuea').innerText = data.suhuair || 'N/A';
    document.getElementById('suhuu-valuea').innerText = data.suhuudara || 'N/A';
    document.getElementById('kelembaban-valuea').innerText = data.kelembaban|| 'N/A';
    
    // Tambahkan label waktu
    const timestamp = new Date().toLocaleTimeString();
    myChart.data.labels.push(timestamp);
    
    // Perbarui dataset dengan nilai baru
    myChart.data.datasets[0].data.push(data.ph);
    myChart.data.datasets[1].data.push(data.suhuair);
    myChart.data.datasets[2].data.push(data.tds);
    myChart.data.datasets[3].data.push(data.suhuudara);
    myChart.data.datasets[4].data.push(data.kelembaban);
    
    // Batasi jumlah data yang ditampilkan (misal 10 data terakhir)
    if (myChart.data.labels.length > 10) {
        myChart.data.labels.shift();
        myChart.data.datasets.forEach(dataset => dataset.data.shift());
    }
    
    // Perbarui chart
    myChart.update();
}

function tampilkanWaktuInternet() {
    fetch("https://timeapi.io/api/Time/current/zone?timeZone=Asia/Jakarta")
        .then(response => response.json())
        .then(data => {
            const dateTime = new Date(data.dateTime);
            const jam = dateTime.getHours();
            const menit = dateTime.getMinutes();
            const detik = dateTime.getSeconds();

            const waktuSekarang =
                (jam < 10 ? "0" + jam : jam) + ":" +
                (menit < 10 ? "0" + menit : menit) + ":" +
                (detik < 10 ? "0" + detik : detik);

            document.getElementById("waktu").textContent = waktuSekarang;
            document.getElementById("time").textContent = waktuSekarang;
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
