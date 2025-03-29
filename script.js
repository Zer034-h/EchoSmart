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
    let tombolKirimA = document.getElementById("setButtonA");

    // Tambahkan event listener untuk klik
    tombolKirimA.addEventListener("click", function() {
        kirimDataKeFirebaseA(); // Panggil fungsi saat tombol ditekan
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Ambil tombol berdasarkan ID
    let tombolKirimB = document.getElementById("setButtonB");

    // Tambahkan event listener untuk klik
    tombolKirimB.addEventListener("click", function() {
        kirimDataKeFirebaseB(); // Panggil fungsi saat tombol ditekan
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Ambil tombol berdasarkan ID
    let tombolKirimC = document.getElementById("setButtonC");

    // Tambahkan event listener untuk klik
    tombolKirimC.addEventListener("click", function() {
        kirimDataKeFirebaseC(); // Panggil fungsi saat tombol ditekan
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Ambil tombol berdasarkan ID
    let tombolKirimD= document.getElementById("setButtonD");

    // Tambahkan event listener untuk klik
    tombolKirimD.addEventListener("click", function() {
        kirimDataKeFirebaseD(); // Panggil fungsi saat tombol ditekan
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Ambil tombol berdasarkan ID
    let tombolKirimE = document.getElementById("setButtonE");

    // Tambahkan event listener untuk klik
    tombolKirimE.addEventListener("click", function() {
        kirimDataKeFirebaseE(); // Panggil fungsi saat tombol ditekan
    });
});
//-----------------------kirimdata--------------------------------------//
var audio = document.getElementById("alert");

function kirimDataKeFirebaseA() {
    let datasetph = parseFloat(document.getElementById("setph").value);
    if (datasetph >= 20 || datasetph <= 1) {
        audio = document.getElementById("alert");
        audio.play();
        alert("Warning!, nilai tidak boleh lebih dari 20");
        datasetph = dataset.setph; 
    }
    if (datasetph === ""){
        audio = document.getElementById("alert");
        audio.play();
        alert("isi nilai");
        datasetph = dataset.setph; 
    }
    if (typeof datasetph === 'string') {
        audio = document.getElementById("alert");
        audio.play();
        alert("isi nilai dengan angka");
        datasetph = dataset.setph; 
    }
    else {}
    set(ref(database, 'input/setph'), datasetph)
        .then(() => {
            console.log("Data berhasil dikirim:",database);
        })
        .catch((error) => {
            console.error("Gagal mengirim data:", error);
        });
}

function kirimDataKeFirebaseB() {
    let datasettds = parseFloat(document.getElementById("settds").value);
    if (datasettds >= 20 || datasettds <= 1) {
        audio = document.getElementById("alert");
        audio.play();
        alert("Warning!, nilai tidak boleh lebih dari 20");
        datasettds = dataset.settds; 
    }
    if (datasettds === ""){
        audio = document.getElementById("alert");
        audio.play();
        alert("isi nilai");
        datasettds = dataset.settds; 
    }
    if (typeof datasettds === 'string') {
        audio = document.getElementById("alert");
        audio.play();
        alert("isi nilai dengan angka");
        datasettds = dataset.settds; 
    }
    else {}
    set(ref(database, 'input/settds'), datasettds)
        .then(() => {
            console.log("Data berhasil dikirim:",database);
        })
        .catch((error) => {
            console.error("Gagal mengirim data:", error);
        });
}

function kirimDataKeFirebaseC() {
    let datasuhuair = document.getElementById("setsuhuair").value;
    if (datasuhuair >= 20) {
        datasuhuair = 20;
        var audio = document.getElementById("alert");
        audio.play();
        alert("Warning!, nilai tidak boleh lebih dari 20");
    }else {}
    set(ref(database, 'input/setsuhuair'), datasuhuair)
        .then(() => {
            console.log("Data berhasil dikirim:",database);
        })
        .catch((error) => {
            console.error("Gagal mengirim data:", error);
        });
}

function kirimDataKeFirebaseD() {
    let datasuhuudara = document.getElementById("setsuhuudara").value;
    if (datasuhuudara >= 20) {
        datasuhuudara = 20;
        var audio = document.getElementById("alert");
        audio.play();
        alert("Warning!, nilai tidak boleh lebih dari 20");
    }else {}
    set(ref(database, 'input/setsuhuudara'), datasuhuudara)
        .then(() => {
            console.log("Data berhasil dikirim:",database);
        })
        .catch((error) => {
            console.error("Gagal mengirim data:", error);
        });
}

function kirimDataKeFirebaseE() {
    let datakelembaban = parseFloat(document.getElementById("setkelembaban").value);
    if (datakelembaban >= 20) {
        datakelembaban = 20;
        var audio = document.getElementById("alert");
        audio.play();
        alert("Warning!, nilai tidak boleh lebih dari 20");
    }else {}
    set(ref(database, 'input/setkelembaban'), datakelembaban)
        .then(() => {
            console.log("Data berhasil dikirim:",database);
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
            {label: 'pH', data: [1], borderColor: 'blue', fill: false, tension: 0.1},
            {label: ' °C',data: [2],borderColor: 'red',fill: false,tension: 0.1},
            {label: 'ppm',data: [3],borderColor: 'green',fill: false,tension: 0.1},
            {label: ' °C',data: [4],borderColor: 'orange',fill: false,tension: 0.1},
            {label: 'rH',data: [5],borderColor: 'brown',fill: false,tension: 0.1}
        ]
    },
    options: {
        scales: {x: {title: {display: false,text: 'Waktu'}},
                 y: {title: {display: false,text: 'Nilai'}}
                }
             }
});


function updateSetData(snapshotA) {
    const dataset= snapshotA.val();

    document.getElementById('setph-value').innerText = dataset.setph || 'N/A';
    document.getElementById('settds-value').innerText = dataset.settds || 'N/A';
    document.getElementById('setsuhua-value').innerText = dataset.setsuhuair || 'N/A';
    document.getElementById('setsuhuu-value').innerText = dataset.setsuhuudara || 'N/A';
    document.getElementById('setkelembaban-value').innerText = dataset.setkelembaban|| 'N/A';
}

function updateSensorData(snapshot) {
    const data = snapshot.val();
    /*
    document.getElementById('ph-value').innerText = data.ph || 'N/A';
    document.getElementById('tds-value').innerText = data.tds || 'N/A';
    document.getElementById('suhua-value').innerText = data.suhuair || 'N/A';
    document.getElementById('suhuu-value').innerText = data.suhuudara || 'N/A';
    document.getElementById('kelembaban-value').innerText = data.kelembaban|| 'N/A';
    */
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

const datasetRef = ref(database, 'input');
onValue(datasetRef, (snapshotA) => {
    updateSetData(snapshotA);
}, (error) => {
    console.error("Error fetching data: ", error);
});
