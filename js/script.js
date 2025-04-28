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

let countdownInterval;
let isActive = false;
var nilaiph;
var nilaitds;
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
var bataswaktu = 0;
var modehumidity = false;
var modepeptisida = false;
var modekeamanan = false;
var modeangin = false;
var Alert = document.getElementById("alert");
var audioautoa = document.getElementById("audioAuto");
var audiomanuala = document.getElementById("audioManual");
var audioUp = document.getElementById("audioUp");
var audioLow = document.getElementById("audioLow");
var audioPump = document.getElementById("audioPump");
var binaryOutput;
var bits = [false, false, false, false, false, false, false, false];

//-----------------------GetDataBase--------------------------------------//


function updateSensorData(snapshot) {
    const data = snapshot.val();

    function map(value, fromLow, fromHigh, toLow, toHigh) {
        return (value - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow;
    }

    nilaiph = (map(data.ph, 5, 7, 0, 100));
    function setBarph(value) {
        value = Math.max(0, Math.min(100, parseInt(value)));
        const bar = document.getElementById("phbar");
        bar.style.height = value + "%";
        bar.innerText = value + "%";
    }

    nilaitds = (map(data.tds, 500, 2000, 0, 100));
    function setBartds(value) {
        value = Math.max(0, Math.min(100, parseInt(value)));
        const bar = document.getElementById("tdsbar");
        bar.style.height = value + "%";
        bar.innerText = value + "%";
    }

    setBarph(nilaiph);
    setBartds(nilaitds);
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

    bits[0]=Manual.pompa1;
    bits[1]=Manual.pompa2;
    bits[2]=Manual.pompa3;
    bits[3]=Manual.pompa4;

    modehumidity = Manual.modehumidity;
    modepeptisida = Manual.modepeptisida;
    modekeamanan = Manual.modekeamanan;
    modeangin = Manual.modeangin;

    if(modehumidity){
        document.getElementById("btnhumidity").textContent = "ON";
        bits[4]=true; binaryOutput = getBinaryString();
        set(ref(database, 'senddatafiks/all'), binaryOutput);
    }else{
        document.getElementById("btnhumidity").textContent = "OFF"; 
        bits[4]=false; 
        binaryOutput = getBinaryString(); 
        set(ref(database, 'senddatafiks/all'), binaryOutput);
    }
    if(modepeptisida){
        document.getElementById("btnpeptisida").textContent = "ON";
        bits[5]=true; 
        binaryOutput = getBinaryString(); 
        set(ref(database, 'senddatafiks/all'), binaryOutput);
    }else{
        document.getElementById("btnpeptisida").textContent = "OFF"; 
        bits[5]=false; binaryOutput = getBinaryString(); 
        set(ref(database, 'senddatafiks/all'), binaryOutput);
    }
    if(modekeamanan){
        document.getElementById("btnkeamanan").textContent = "ON"; 
        bits[6]=true; 
        binaryOutput = getBinaryString(); 
        set(ref(database, 'senddatafiks/all'), binaryOutput);
    }else{document.getElementById("btnkeamanan").textContent = "OFF"; 
        bits[6]=false; 
        binaryOutput = getBinaryString(); 
        set(ref(database, 'senddatafiks/all'), binaryOutput);
    }
    if(modeangin){
        document.getElementById("btnangin").textContent = "ON"; 
        bits[7]=true; 
        binaryOutput = getBinaryString(); 
        set(ref(database, 'senddatafiks/all'), binaryOutput);
    }else{
        document.getElementById("btnangin").textContent = "OFF"; 
        bits[7]=false; 
        binaryOutput = getBinaryString(); 
        set(ref(database, 'senddatafiks/all'), binaryOutput);
    }
}


function getBinaryString() {
    return (
    (bits[0] ? '1' : '0') +
    (bits[1] ? '1' : '0') +
    (bits[2] ? '1' : '0') +
    (bits[3] ? '1' : '0') +
    (bits[4] ? '1' : '0') +
    (bits[5] ? '1' : '0') +
    (bits[6] ? '1' : '0') +
    (bits[7] ? '1' : '0') +
    (bits[8] ? '1' : '0') +
    ('|')+(setPhUpValue)+
    ('|')+(setPhDownValue)+
    ('|')+(setTdsUpValue)+
    ('|')+(setTdsDownValue)+
    ('|')+(setSuhuUpValue)+
    ('|')+(setSuhuDownValue)+
    ('|')+(setKelembabanUpValue)+
    ('|')+(setKelembabanDownValue)
    );
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
    let c = document.getElementById("btnoc");
    let d = document.getElementById("btnod");
    let e = document.getElementById("endTimeButton")
    let f = document.getElementById("startTimeButton")
    let g = document.getElementById("humidtyButton")
    let h = document.getElementById("peptisidaButton")
    let i = document.getElementById("keamananButton")
    let j = document.getElementById("kipasButton")

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
    c.addEventListener("click", function(){
        if(isActive){
        Alert.play();
        alert("⚠️‼️PERINGATAN: Waktu Sedang Berjalan‼️⚠️");
        }else{
        bataswaktu = bataswaktu - 1;
        if(bataswaktu < 0){
            bataswaktu = 0;
        }
        document.getElementById("time").textContent = bataswaktu + ":00";
        if(bataswaktu<10){document.getElementById("time").textContent = "0" + bataswaktu + ":00";}
        }
    });
    d.addEventListener("click", function(){
        if(isActive){
            Alert.play();
            alert("⚠️‼️PERINGATAN: Waktu Sedang Berjalan‼️⚠️");
            }else{
        bataswaktu = bataswaktu + 1;
        if(bataswaktu > 30){
            bataswaktu = 30;
        }
        document.getElementById("time").textContent = bataswaktu+ ":00";
        if(bataswaktu<10){document.getElementById("time").textContent = "0" + bataswaktu + ":00";}
        }
    });
    e.addEventListener("click", function(){
        if(isActive){
        clearInterval(countdownInterval);
        isActive = false;
        set(ref(database, 'operatorManual/UV'), isActive);
        bataswaktu = 0;
        document.getElementById('time').textContent = "end";
        }
    });
    f.addEventListener("click", function(){
        if(bataswaktu < 1){
            Alert.play();
            alert("⚠️‼️PERINGATAN: Waktu Harus 1 Atau Lebih‼️⚠️");
        }
        if(isActive) {
            
        }
        else{startCountdown(parseInt(bataswaktu) * 60);}
    });
    g.addEventListener("click", function(){
        modehumidity = !modehumidity;
        if(modehumidity){
            set(ref(database, 'operatorManual/modehumidity'), modehumidity);
            document.getElementById("btnhumidity").textContent = "ON";
            bits[4] = true;
            binaryOutput = getBinaryString();
            set(ref(database, 'senddatafiks/all'), binaryOutput);
        }else{
            set(ref(database, 'operatorManual/modehumidity'), modehumidity);
            document.getElementById("btnhumidity").textContent = "OFF";
            bits[4] = false;
            binaryOutput = getBinaryString();
            set(ref(database, 'senddatafiks/all'), binaryOutput);
            }

    });
    h.addEventListener("click", function(){
        modepeptisida = !modepeptisida;
        if(modepeptisida){
            set(ref(database, 'operatorManual/modepeptisida'), modepeptisida);
            document.getElementById("btnpeptisida").textContent = "ON";
            bits[5] = true;
            binaryOutput = getBinaryString();
            set(ref(database, 'senddatafiks/all'), binaryOutput);
        }else{
            document.getElementById("btnpeptisida").textContent = "OFF";
            set(ref(database, 'operatorManual/modepeptisida'), modepeptisida);
            bits[5] = false;
            binaryOutput = getBinaryString();
            set(ref(database, 'senddatafiks/all'), binaryOutput);
            }
    });
    i.addEventListener("click", function(){
        modekeamanan = !modekeamanan;
        if(modekeamanan){
            set(ref(database, 'operatorManual/modekeamanan'), modekeamanan);
            document.getElementById("btnkeamanan").textContent = "ON";
            bits[6] = true;
            binaryOutput = getBinaryString();
            set(ref(database, 'senddatafiks/all'), binaryOutput);
        }else{
            document.getElementById("btnkeamanan").textContent = "OFF";
            set(ref(database, 'operatorManual/modekeamanan'), modekeamanan);
            bits[6] = false;
            binaryOutput = getBinaryString();
            set(ref(database, 'senddatafiks/all'), binaryOutput);
            }
    });
    j.addEventListener("click", function(){
        modeangin = !modeangin;
        if(modeangin){
            set(ref(database, 'operatorManual/modeangin'), modeangin);
            document.getElementById("btnangin").textContent = "ON";
            bits[7] = true;
            binaryOutput = getBinaryString();
            set(ref(database, 'senddatafiks/all'), binaryOutput);
        }else{
            document.getElementById("btnangin").textContent = "OFF";
            set(ref(database, 'operatorManual/modeangin'), modeangin);
            bits[7] = false;
            binaryOutput = getBinaryString();
            set(ref(database, 'senddatafiks/all'), binaryOutput);
            }
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
        bits[8] = true;
        binaryOutput = getBinaryString();
        set(ref(database, 'senddatafiks/all'), binaryOutput);
    }else{
        document.getElementById("modeA").textContent = "Auto";
        javaCss.style.backgroundColor = '#cecece';
        set(ref(database, 'operator/Mode'), Mode)
        .then(() => {console.log("Data berhasil dikirim:",database);})
        .catch((error) => {console.error("Gagal mengirim data:", error);});

        bits[8] = false;
        binaryOutput = getBinaryString();
        set(ref(database, 'senddatafiks/all'), binaryOutput);

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
        bits[0] = true;
        let binaryOutput = getBinaryString();
        console.log(binaryOutput);
    } else {
        set(ref(database, 'operatorManual/pompa1'), checkbox1);
        bits[0] = false;
        let binaryOutput = getBinaryString();
        console.log(binaryOutput);
    }
    }else{
        checkboxSet1.checked = false; 
        set(ref(database, 'operatorManual/pompa1'), false);
        bits[0] = false;
        let binaryOutput = getBinaryString();
        console.log(binaryOutput);
    }
});

document.getElementById('checkbox2').addEventListener('change', function() {
    if(Mode){
    let checkbox2 = document.getElementById('checkbox2').checked;
    if(checkbox2)audioPump.play();
    if (this.checked) {
        set(ref(database, 'operatorManual/pompa2'), checkbox2);
        bits[1] = true;
        let binaryOutput = getBinaryString();
        console.log(binaryOutput);
    } else {
        set(ref(database, 'operatorManual/pompa2'), checkbox2);
        bits[1] = false;
        let binaryOutput = getBinaryString();
        console.log(binaryOutput);
    }
    }else{checkboxSet2.checked = false; 
        set(ref(database, 'operatorManual/pompa2'), false);
        bits[1] = false;
        let binaryOutput = getBinaryString();
        console.log(binaryOutput);
    }
});

document.getElementById('checkbox3').addEventListener('change', function() {
    if(Mode){
    let checkbox3 = document.getElementById('checkbox3').checked;
    if(checkbox3)audioPump.play();
    if (this.checked) {
        set(ref(database, 'operatorManual/pompa3'), checkbox3);
        bits[2] = true;
        let binaryOutput = getBinaryString();
        console.log(binaryOutput);
    } else {
        set(ref(database, 'operatorManual/pompa3'), checkbox3);
        bits[2] = false;
        let binaryOutput = getBinaryString();
        console.log(binaryOutput);
    }
    }else{checkboxSet3.checked = false; 
        set(ref(database, 'operatorManual/pompa3'), false);
        bits[2] = false;
        let binaryOutput = getBinaryString();
        console.log(binaryOutput);
    }
});

document.getElementById('checkbox4').addEventListener('change', function() {
    if(Mode){
    let checkbox4 = document.getElementById('checkbox4').checked;
    if(checkbox4)audioPump.play();
    if (this.checked) {
        set(ref(database, 'operatorManual/pompa4'), checkbox4);
        bits[3] = true;
        let binaryOutput = getBinaryString();
        console.log(binaryOutput);
    } else {
        set(ref(database, 'operatorManual/pompa4'), checkbox4);
        bits[3] = false;
        let binaryOutput = getBinaryString();
        console.log(binaryOutput);
    }
    }else{checkboxSet4.checked = false; 
        set(ref(database, 'operatorManual/pompa4'), false);
        bits[3] = false;
        let binaryOutput = getBinaryString();
        console.log(binaryOutput);
    }
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
                binaryOutput = getBinaryString();
                set(ref(database, 'senddatafiks/all'), binaryOutput);
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
                binaryOutput = getBinaryString();
                set(ref(database, 'senddatafiks/all'), binaryOutput);
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
                binaryOutput = getBinaryString();
                set(ref(database, 'senddatafiks/all'), binaryOutput);
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
                binaryOutput = getBinaryString();
                set(ref(database, 'senddatafiks/all'), binaryOutput);
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
                binaryOutput = getBinaryString();
                set(ref(database, 'senddatafiks/all'), binaryOutput);
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
                binaryOutput = getBinaryString();
                set(ref(database, 'senddatafiks/all'), binaryOutput);
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
                binaryOutput = getBinaryString();
                set(ref(database, 'senddatafiks/all'), binaryOutput);
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
                binaryOutput = getBinaryString();
                set(ref(database, 'senddatafiks/all'), binaryOutput);
            }
        }
    }
}


function startCountdown(duration) {
    let timer = duration, minutes, seconds;

    isActive = true;
    set(ref(database, 'operatorManual/UV'), isActive);
    countdownInterval = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('time').textContent = minutes + ":" + seconds;
        set(ref(database, 'operatorManual/Time'), minutes + ":" + seconds);

        if (--timer < 0) {
            clearInterval(countdownInterval);
            isActive = false;
            bataswaktu = 0;
            set(ref(database, 'operatorManual/UV'), isActive);
            document.getElementById('time').textContent = "end";
        }
    }, 1000);
}




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

