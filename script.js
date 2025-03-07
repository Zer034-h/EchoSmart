const menuToggle = document.querySelector('.menu-toggle');
		const nav = document.querySelector('nav ul');
	  
		menuToggle.addEventListener('click', function(){
		  nav.classList.toggle('slide');
		});


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAvRVu9RyCvxQvTu1iiy7mMDja26cACuTU",
  authDomain: "iot-monitoring-fe406.firebaseapp.com",
  databaseURL: "https://iot-monitoring-fe406-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "iot-monitoring-fe406",
  storageBucket: "iot-monitoring-fe406.appspot.com",
  messagingSenderId: "534573831564",
  appId: "1:534578381564:web:6ed12537db0c135bf84d79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Inisialisasi chart
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [], // Label kosong akan diisi dengan data real-time
        datasets: [
            {
                label: 'pH',
                data: [],
                borderColor: 'blue',
                fill: false,
                tension: 0.1
            },
            {
                label: ' °C',
                data: [],
                borderColor: 'red',
                fill: false,
                tension: 0.1
            },
            {
                label: 'NTU',
                data: [],
                borderColor: 'green',
                fill: false,
                tension: 0.1
            },
            {
                label: 'ppm',
                data: [],
                borderColor: 'purple',
                fill: false,
                tension: 0.1
            }
        ]
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Waktu'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Nilai'
                }
            }
        }
    }
});

// Fungsi untuk memperbarui data di halaman
function updateSensorData(snapshot) {
  const data = snapshot.val();
  
  // Memperbarui nilai sensor di halaman
  document.getElementById('ph-value').innerText = data.ph || 'N/A';
  document.getElementById('suhu-value').innerText = data.suhu || 'N/A';
  document.getElementById('kekeruhan-value').innerText = data.kekeruhan || 'N/A';
  document.getElementById('tds-value').innerText = data.tds || 'N/A';

  // Tambahkan label waktu (misalnya dalam detik atau timestamp real-time)
  const timestamp = new Date().toLocaleTimeString();
  myChart.data.labels.push(timestamp);
  
  // Memperbarui dataset dengan nilai baru
  myChart.data.datasets[0].data.push(data.ph);
  myChart.data.datasets[1].data.push(data.suhu);
  myChart.data.datasets[2].data.push(data.kekeruhan);
  myChart.data.datasets[3].data.push(data.tds);
  
  // Batasi jumlah data yang ditampilkan (misal 10 data terakhir)
  if (myChart.data.labels.length > 10) {
      myChart.data.labels.shift();
      myChart.data.datasets.forEach(dataset => dataset.data.shift());
      }
  
  // Update chart untuk menampilkan data baru
  myChart.update();
}

function tampilkanWaktuInternet() {
    // URL untuk zona waktu Jakarta (WIB), bisa diganti untuk zona WITA atau WIT
    const url = "http://worldtimeapi.org/api/timezone/Asia/Jakarta";

    // Mengambil data dari API
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const dateTime = new Date(data.datetime); // Mendapatkan waktu dari response API
            const jam = dateTime.getHours();
            const menit = dateTime.getMinutes();
            const detik = dateTime.getSeconds();

            // Menambahkan 0 di depan angka jika kurang dari 10
            const waktuSekarang =
                (jam < 10 ? "0" + jam : jam) + ":" +
                (menit < 10 ? "0" + menit : menit) + ":" +
                (detik < 10 ? "0" + detik : detik);

            // Menampilkan waktu di elemen HTML
            document.getElementById("waktu").textContent = waktuSekarang;
        })
        .catch(error => {
            console.error("Gagal mengambil waktu dari API:", error);
        });
}

setInterval(tampilkanWaktuInternet, 1000);

// Menampilkan waktu internet saat halaman dimuat
tampilkanWaktuInternet();
// Mendengarkan perubahan data di Firebase Realtime Database
const sensorRef = ref(database, 'sensor'); // Sesuaikan dengan jalur di Firebase
onValue(sensorRef, (snapshot) => {
  updateSensorData(snapshot);
}, (error) => {
  console.error("Error fetching data: ", error);
});