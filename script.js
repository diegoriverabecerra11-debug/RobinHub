// 1. IMPORTACIONES (Desde la CDN que te dio Firebase)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-storage.js";

// 2. TU CONFIGURACIÓN REAL
const firebaseConfig = {
  apiKey: "AIzaSyBhYIC92ClAovRCcpYxtTjDDlyKRdelpHs",
  authDomain: "robinhub-592e9.firebaseapp.com",
  projectId: "robinhub-592e9",
  storageBucket: "robinhub-592e9.firebasestorage.app",
  messagingSenderId: "715257099670",
  appId: "1:715257099670:web:9c3d89da39b32cbb6cd9b7",
  measurementId: "G-9FTD4CJXKV"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    const feed = document.getElementById('mainFeed');

    // TUS 50 PINES DE RELLENO
    const datosEstaticos = [
        { t: "Café de Mañana", u: "CaffeineLover" },
        { t: "Cimas Nevadas", u: "MountainExplorer" },
        { t: "Surf en Bali", u: "WaveRider" },
        { t: "Espresso Doble", u: "BaristaPro" },
        { t: "Bosque de Niebla", u: "NatureGeek" },
        { t: "Maratón Urbano", u: "RunFast" },
        { t: "Latte Art Corazón", u: "MilkMaster" },
        { t: "Atardecer Rojo", u: "SkyWatcher" },
        { t: "Ciclismo de Montaña", u: "MTB_Life" },
        { t: "Café en la Cama", u: "LazySunday" }
        // ... (puedes rellenar hasta los 50 como tenías antes)
    ];

    // --- CARGAR TODO ---
    async function cargarFeed() {
        feed.innerHTML = "";
        try {
            // Cargar fotos reales de Firebase
            const q = query(collection(db, "pines"), orderBy("fecha", "desc"));
            const snapshot = await getDocs(q);
            snapshot.forEach(doc => renderPin(doc.data().titulo, doc.data().usuario, doc.data().imagen, true));
        } catch (e) { console.log("Firebase vacío o sin permisos"); }

        // Cargar tus 50 de siempre
        datosEstaticos.forEach((p, i) => {
            const img = `https://picsum.photos/seed/${i + 50}/400/600`;
            renderPin(p.t, p.u, img, false);
        });
    }

    function renderPin(t, u, img, esReal) {
        const div = document.createElement('div');
        div.className = 'pin';
        div.innerHTML = `<img src="${img}"><div class="pin-info"><h4>${t}</h4><p>Por <span class="${esReal ? 'user-tag' : ''}">@${u}</span></p></div>`;
        feed.appendChild(div);
    }

    // --- AUTH ---
    onAuthStateChanged(auth, (user) => {
        const nav = document.getElementById('navActions');
        if(user) {
            nav.innerHTML = `<button class="btn-signup" onclick="document.getElementById('fileInput').click()">+ Crear</button>
                             <span style="font-weight:800; margin: 0 10px;">@${user.email.split('@')[0]}</span>
                             <button onclick="signOut(getAuth())" style="color:red; cursor:pointer; border:none; background:none;">Salir</button>`;
        } else {
            nav.innerHTML = `<button class="btn-login" onclick="window.abrirModal('authModal')">Entrar</button>
                             <button class="btn-signup" onclick="window.abrirModal('authModal')">Registro</button>`;
        }
        cargarFeed();
    });

    // Lógica de Registro
    document.getElementById('registerForm').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;
        try { await createUserWithEmailAndPassword(auth, email, pass); location.reload(); } 
        catch (err) { alert(err.message); }
    };

    // Lógica de Login
    document.getElementById('loginForm').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPass').value;
        try { await signInWithEmailAndPassword(auth, email, pass); location.reload(); } 
        catch (err) { alert("Error al entrar"); }
    };

    // --- SUBIDA ---
    const fInput = document.getElementById('fileInput');
    let fotoBase64 = "";

    fInput.onchange = (e) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
            fotoBase64 = ev.target.result;
            document.getElementById('previewImg').src = fotoBase64;
            window.abrirModal('uploadModal');
        };
        reader.readAsDataURL(e.target.files[0]);
    };

    document.getElementById('publishBtn').onclick = async () => {
        const t = document.getElementById('pinTitle').value;
        if(!t || !fotoBase64) return;
        const btn = document.getElementById('publishBtn');
        btn.innerText = "Subiendo...";
        btn.disabled = true;

        try {
            const storageRef = ref(storage, `pines/${Date.now()}.jpg`);
            await uploadString(storageRef, fotoBase64, 'data_url');
            const url = await getDownloadURL(storageRef);
            await addDoc(collection(db, "pines"), { titulo: t, usuario: auth.currentUser.email.split('@')[0], imagen: url, fecha: Date.now() });
            location.reload();
        } catch (err) { alert(err.message); }
    };

    // Ayudantes de ventana
    window.abrirModal = (id) => document.getElementById(id).style.display = 'flex';
    window.cerrarModal = (id) => document.getElementById(id).style.display = 'none';
});
