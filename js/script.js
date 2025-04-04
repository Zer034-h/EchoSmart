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
const javaCss = document.getElementById("javaCss");
const checkboxSet1 = document.getElementById("checkbox1");
const checkboxSet2 = document.getElementById("checkbox2");
const checkboxSet3 = document.getElementById("checkbox3");
const checkboxSet4 = document.getElementById("checkbox4");

let played1 = false;
let played2 = false;
let played3 = false;
let played4 = false;
var Mode;
var RentangA;
var RentangB;
var setPhUpValue;
var setPhDownValue;
var setTdsUpValue;
var setTdsDownValue;
var setSuhuUpValue;
var setSuhuDownValue;
var setKelembabanUpValue;
var setKelembabanDownValue;
var Alert = document.getElementById("alert");
var audioautoa = document.getElementById("audioAuto");
var audiomanuala = document.getElementById("audioManual");
var audioUp = document.getElementById("audioUp");
var audioLow = document.getElementById("audioLow");
var audioPump = document.getElementById("audioPump");

//-----------------------GetDataBase--------------------------------------//


function updateSensorData(snapshot) {
    const data = snapshot.val();
    /*
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
    */
}

function updateSetData(snapshotA) {
    const dataset = snapshotA.val();

    document.getElementById('setPhUpValue').innerText = dataset.setPhUp || 'N/A';
    document.getElementById('setPhDownValue').innerText = dataset.setPhDown || 'N/A';
    document.getElementById('setTdsUpValue').innerText = dataset.setTdsUp || 'N/A';
    document.getElementById('setTdsDownValue').innerText = dataset.setTdsDown || 'N/A';
    document.getElementById('setSuhuUpValue').innerText = dataset.setSuhuUp || 'N/A';
    document.getElementById('setSuhuDownValue').innerText = dataset.setSuhuDown || 'N/A';
    document.getElementById('setKelembabanUpValue').innerText = dataset.setKelembabanUp || 'N/A';
    document.getElementById('setKelembabanDownValue').innerText = dataset.setKelembabanDown|| 'N/A';

    setPhUpValue = parseFloat(dataset.setPhUp);
    setPhDownValue = parseFloat(dataset.setPhDown);
    setTdsUpValue = parseFloat(dataset.setTdsUp );
    setTdsDownValue = parseFloat(dataset.setTdsDown);
    setSuhuUpValue = parseFloat(dataset.setSuhuUp);
    setSuhuDownValue = parseFloat(dataset.setSuhuDown);
    setKelembabanUpValue = parseFloat(dataset.setKelembabanUp );
    setKelembabanDownValue = parseFloat(dataset.setKelembabanDown);

}


function updateModeData(snapshotB) {
    const modeset= snapshotB.val();
    Mode = modeset.Mode;
    if(Mode == true || Mode == false){
        updateMode();
    }
}

function operatormanual(snapshotC) {
    const Manual= snapshotC.val();
    checkboxSet1.checked = Manual.pompa1;
    checkboxSet2.checked = Manual.pompa2;
    checkboxSet3.checked = Manual.pompa3;
    checkboxSet4.checked = Manual.pompa4;
}



//-----------------------HtmlComunicaton--------------------------------------//


document.addEventListener("DOMContentLoaded", function() {
    let tombolKirimA = document.getElementById("setButtonA");
    let tombolKirimB = document.getElementById("setButtonB");
    let tombolKirimD = document.getElementById("setButtonD");
    let tombolKirimE = document.getElementById("setButtonE");
    let BtnDownA = document.getElementById("setButtonDownA");
    let BtnUpA = document.getElementById("setButtonUpA");
    let BtnDownB = document.getElementById("setButtonDownB");
    let BtnUpB = document.getElementById("setButtonUpB");
    let a = document.getElementById("btnoa");
    let b = document.getElementById("btnob");

    tombolKirimA.addEventListener("click", function() {
    kirimDataKeFirebaseA();
    });
    tombolKirimB.addEventListener("click", function() {
    kirimDataKeFirebaseB();
    });
    tombolKirimD.addEventListener("click", function() {
    kirimDataKeFirebaseD();
    });
    tombolKirimE.addEventListener("click", function() {
    kirimDataKeFirebaseE();
    });
    a.addEventListener("click", function(){
        Mode = !Mode;
        updateMode();
    });
    b.addEventListener("click", function(){
        Mode = !Mode;
        updateMode();
    });
    BtnDownA.addEventListener("click", function(){
        RentangA = false;
        audioLow.play();
        set(ref(database, 'operatorlimit/RentangA'), RentangA)
    });
    BtnUpA.addEventListener("click", function(){
        RentangA = true;
        audioUp.play();
        set(ref(database, 'operatorlimit/RentangA'), RentangA)
    });
    BtnDownB.addEventListener("click", function(){
        RentangB = false;
        audioLow.play();
        set(ref(database, 'operatorlimit/RentangB'), RentangB)
    });
    BtnUpB.addEventListener("click", function(){
        RentangB = true;
        audioUp.play();
        set(ref(database, 'operatorlimit/RentangB'), RentangB)
    });
});

function updateMode() {
    if (Mode) {
        document.getElementById("modeA").textContent = "Manual";
        javaCss.style.backgroundColor = '#ffffff';
        set(ref(database, 'operator/Mode'), Mode)
        .then(() => {console.log("Data berhasil dikirim:",database);})
        .catch((error) => {console.error("Gagal mengirim data:", error);});
    }else{
        document.getElementById("modeA").textContent = "Auto";
        javaCss.style.backgroundColor = '#cecece';
        set(ref(database, 'operator/Mode'), Mode)
        .then(() => {console.log("Data berhasil dikirim:",database);})
        .catch((error) => {console.error("Gagal mengirim data:", error);});
        checkboxSet1.checked = false;
        checkboxSet2.checked = false;
        checkboxSet3.checked = false;
        checkboxSet4.checked = false;

        set(ref(database, 'operatorManual/pompa1'), false);
        set(ref(database, 'operatorManual/pompa2'), false);
        set(ref(database, 'operatorManual/pompa3'), false);
        set(ref(database, 'operatorManual/pompa4'), false);
    }

    audioNot();
}





document.getElementById('checkbox1').addEventListener('change', function() {
    if(Mode){
    let checkbox1 = document.getElementById('checkbox1').checked;
    if(checkbox1)audioPump.play();
    if (this.checked) {
        set(ref(database, 'operatorManual/pompa1'), checkbox1);
    } else {
        set(ref(database, 'operatorManual/pompa1'), checkbox1);
    }
    }else{checkboxSet1.checked = false; set(ref(database, 'operatorManual/pompa1'), false);}
});

document.getElementById('checkbox2').addEventListener('change', function() {
    if(Mode){
    let checkbox2 = document.getElementById('checkbox2').checked;
    if(checkbox2)audioPump.play();
    if (this.checked) {
        set(ref(database, 'operatorManual/pompa2'), checkbox2);
    } else {
        set(ref(database, 'operatorManual/pompa2'), checkbox2);
    }
    }else{checkboxSet2.checked = false; set(ref(database, 'operatorManual/pompa2'), false);}
});

document.getElementById('checkbox3').addEventListener('change', function() {
    if(Mode){
    let checkbox3 = document.getElementById('checkbox3').checked;
    if(checkbox3)audioPump.play();
    if (this.checked) {
        set(ref(database, 'operatorManual/pompa3'), checkbox3);
    } else {
        set(ref(database, 'operatorManual/pompa3'), checkbox3);
    }
    }else{checkboxSet3.checked = false; set(ref(database, 'operatorManual/pompa3'), false);}
});

document.getElementById('checkbox4').addEventListener('change', function() {
    if(Mode){
    let checkbox4 = document.getElementById('checkbox4').checked;
    if(checkbox4)audioPump.play();
    if (this.checked) {
        set(ref(database, 'operatorManual/pompa4'), checkbox4);
    } else {
        set(ref(database, 'operatorManual/pompa4'), checkbox4);
    }
    }else{checkboxSet4.checked = false; set(ref(database, 'operatorManual/pompa4'), false);}
});





function audioNot() {
    if(Mode === true){
        audiomanuala.play();
    }else{
        audioautoa.play();
    }
}



//-----------------------kirimdata--------------------------------------//


function kirimDataKeFirebaseA() {
var setPh = parseFloat(document.getElementById("setPh").value);

    if(RentangA){
        if(isNaN(setPh) || setPh > 7 || setPh < 5){
            Alert.play();
            alert("⚠️‼️PERINGATAN: Nilai pH harus antara 5 dan 7‼️⚠️");
            setPh = dataset.setPhUp;
        }else{
            if((setPh && setPhUpValue <= setPhDownValue) || (setPhDownValue >= setPh && setPhUpValue)){
                Alert.play();
                alert("⚠️‼️PERINGATAN: Konfigurasi pH tidak valid‼️⚠️");
                setPh = dataset.setPhUp;
            }else{
                set(ref(database, 'input/setPhUp'), setPh)
                .then(() => {console.log("Data berhasil dikirim:", database);})
                .catch((error) => {console.error("Gagal mengirim data:", error);});
            }
        }
    }else{
        if(isNaN(setPh) || setPh > 7 || setPh < 5){
            Alert.play();
            alert("⚠️‼️PERINGATAN: Nilai pH harus antara 5 dan 7‼️⚠️");
            setPh = dataset.setPhDown; 
        }else{
            if((setPhUpValue <= setPhDownValue && setPh) || (setPhDownValue && setPh >= setPhUpValue)){
                Alert.play();
                alert("⚠️‼️PERINGATAN: Konfigurasi pH tidak valid‼️⚠️");
                setPh = dataset.setPhDown;
            }else{
                set(ref(database, 'input/setPhDown'), setPh)
                .then(() => {console.log("Data berhasil dikirim:",database);})
                .catch((error) => {console.error("Gagal mengirim data:", error);});
            }
        } 
    }
}


function kirimDataKeFirebaseB() {
var setTds = parseFloat(document.getElementById("setTds").value);

    if(RentangA){
        if(isNaN(setTds) || setTds > 2000 || setTds < 500){
            Alert.play();
            alert("⚠️‼️PERINGATAN: Nilai Tds harus antara 500 dan 2000‼️⚠️");
            setTds = dataset.setTdsUp; 
        }else{
            if((setTds && setTdsUpValue <= setTdsDownValue) || (setTdsDownValue >= setTds && setTdsUpValue)) {
                Alert.play();
                alert("⚠️‼️PERINGATAN: Konfigurasi Tds tidak valid‼️⚠️");
                setTds = dataset.setTdsUp;
            }else{
                set(ref(database, 'input/setTdsUp'), setTds)
                .then(() => {console.log("Data berhasil dikirim:",database);})
                .catch((error) => {console.error("Gagal mengirim data:", error);});  
            }
        }
    }else{
        if(isNaN(setTds) || setTds > 2000 || setTds < 500){
            Alert.play();
            alert("⚠️‼️PERINGATAN: Nilai Tds harus antara 500 dan 2000‼️⚠️");
            setTds = dataset.setTdsDown; 
        }else{
            if((setTdsUpValue <= setTdsDownValue && setTds) || (setTdsDownValue && setTds >= setTdsUpValue)) {
                Alert.play();
                alert("⚠️‼️PERINGATAN: Konfigurasi Tds tidak valid‼️⚠️");
                setTds = dataset.setTdsDown;
            }else{
                set(ref(database, 'input/setTdsDown'), setTds)
                .then(() => {console.log("Data berhasil dikirim:",database);})
                .catch((error) => {console.error("Gagal mengirim data:", error);});  
            }
        }    
    }
}

function kirimDataKeFirebaseD() {
var setSuhu = parseFloat(document.getElementById("setSuhu").value);

    if(RentangB){
        if(isNaN(setSuhu) || setSuhu > 30 || setSuhu < 15){
            Alert.play();
            alert("⚠️‼️PERINGATAN: Nilai Suhu harus antara 15 dan 30‼️⚠️");
            setSuhu = dataset.setSuhuUp;
        }else{
            if((setSuhu && setSuhuUpValue <= setSuhuDownValue) || (setSuhuDownValue >= setSuhu && setSuhuUpValue)){
                Alert.play();
                alert("⚠️‼️PERINGATAN: Konfigurasi Suhu tidak valid‼️⚠️");
                setSuhu = dataset.setSuhuUp;
            }else{
                set(ref(database, 'input/setSuhuUp'), setSuhu)
                .then(() => {console.log("Data berhasil dikirim:", database);})
                .catch((error) => {console.error("Gagal mengirim data:", error);});
            }
        }
    }else{
        if(isNaN(setSuhu) || setSuhu > 30 || setSuhu < 15){
            Alert.play();
            alert("⚠️‼️PERINGATAN: Nilai Suhu harus antara 15 dan 30‼️⚠️");
            setSuhu = dataset.setSuhuDown; 
        }else{
            if ((setSuhuUpValue <= setSuhuDownValue && setSuhu) || (setSuhuDownValue && setSuhu >= setSuhuUpValue)) {
                Alert.play();
                alert("⚠️‼️PERINGATAN: Konfigurasi Suhu tidak valid‼️⚠️");
                setSuhu = dataset.setSuhuDown;
            }else{
                set(ref(database, 'input/setSuhuDown'), setSuhu)
                .then(() => {console.log("Data berhasil dikirim:",database);})
                .catch((error) => {console.error("Gagal mengirim data:", error);});
            }
        } 
    }
}

function kirimDataKeFirebaseE() {
    var setKelembaban = parseFloat(document.getElementById("setKelembaban").value);

    if(RentangB){
        if (isNaN(setKelembaban) || setKelembaban > 80 || setKelembaban < 40) {
            Alert.play();
            alert("⚠️‼️PERINGATAN: Nilai Kelembaban harus antara 40 dan 80‼️⚠️");
            setKelembaban = dataset.setKelembabanUp;
        }else{     
            if((setKelembaban && setKelembabanUpValue <= setKelembabanDownValue) || (setKelembabanDownValue >= setKelembaban && setKelembabanUpValue)){
                Alert.play();
                alert("⚠️‼️PERINGATAN: Konfigurasi Kelembaban tidak valid‼️⚠️");
                setKelembaban = dataset.setKelembabanUp;
            }else{
                set(ref(database, 'input/setKelembabanUp'), setKelembaban)
                .then(() => {console.log("Data berhasil dikirim:", database);})
                .catch((error) => {console.error("Gagal mengirim data:", error);});
            }
        }
    }else{
        if (isNaN(setKelembaban) || setKelembaban > 80 || setKelembaban < 40) {
            Alert.play();
            alert("⚠️‼️PERINGATAN: Nilai Kelembaban harus antara 40 dan 80‼️⚠️");
            setKelembaban = dataset.setKelembabanDown; 
        }else{
            if ((setKelembabanUpValue <= setKelembabanDownValue && setKelembaban) || (setKelembabanDownValue && setKelembaban >= setKelembabanUpValue)){
                Alert.play();
                alert("⚠️‼️PERINGATAN: Konfigurasi Kelembaban tidak valid‼️⚠️");
                setKelembaban = dataset.setKelembabanDown;
            }else{
                set(ref(database, 'input/setKelembabanDown'), setKelembaban)
                .then(() => {console.log("Data berhasil dikirim:",database);})
                .catch((error) => {console.error("Gagal mengirim data:", error);});
            }
        }
    }
}





/*
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
    options:{
        scales: {x: {title: {display: false,text: 'Waktu'}},
                 y: {title: {display: false,text: 'Nilai'}}
                }
            }
});
*/




/*
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
*/
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

const datamodeRef = ref(database, 'operator');
onValue(datamodeRef, (snapshotB) => {
    updateModeData(snapshotB);
}, (error) => {
    console.error("Error fetching data: ", error);
});

const operatorManual = ref(database, 'operatorManual');
onValue(operatorManual, (snapshotC) => {
    operatormanual(snapshotC);
}, (error) => {
    console.error("Error fetching data: ", error);
});

