// 1. IMPORTACIONES DE FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// 2. CONFIGURACIÓN (Tus credenciales de RobinHub)
const firebaseConfig = {
  apiKey: "AIzaSyBhYIC92ClAovRCcpYxtTjDDlyKRdelpHs",
  authDomain: "robinhub-592e9.firebaseapp.com",
  projectId: "robinhub-592e9",
  storageBucket: "robinhub-592e9.firebasestorage.app",
  messagingSenderId: "715257099670",
  appId: "1:715257099670:web:9c3d89da39b32cbb6cd9b7",
  measurementId: "G-9FTD4CJXKV"
};

// Inicializar
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    const feed = document.getElementById('mainFeed');

    // --- TU BASE DE DATOS DE 50 PINES ---
    const datosPinesEstaticos = [
        { t: "Café de Mañana", u: "CaffeineLover", c: "coffee" },
        { t: "Cimas Nevadas", u: "MountainExplorer", c: "landscape" },
        { t: "Surf en Bali", u: "WaveRider", c: "sports" },
        { t: "Espresso Doble", u: "BaristaPro", c: "coffee" },
        { t: "Bosque de Niebla", u: "NatureGeek", c: "landscape" },
        { t: "Maratón Urbano", u: "RunFast", c: "sports" },
        { t: "Latte Art Corazón", u: "MilkMaster", c: "coffee" },
        { t: "Atardecer Rojo", u: "SkyWatcher", c: "landscape" },
        { t: "Ciclismo de Montaña", u: "MTB_Life", c: "sports" },
        { t: "Café en la Cama", u: "LazySunday", c: "coffee" },
        { t: "Lago de Cristal", u: "AquaPure", c: "landscape" },
        { t: "Baloncesto Callejero", u: "HoopsVibe", c: "sports" },
        { t: "Grano Tostado", u: "RoastKing", c: "coffee" },
        { t: "Desierto Infinito", u: "SandDune", c: "landscape" },
        { t: "Tenis en Tierra", u: "MatchPoint", c: "sports" },
        { t: "Moka Caliente", u: "ChocoLover", c: "coffee" },
        { t: "Cascada Escondida", u: "WildTravel", c: "landscape" },
        { t: "Escalada Libre", u: "VerticalLimit", c: "sports" },
        { t: "Café con Vistas", u: "TravelCup", c: "coffee" },
        { t: "Camino de Flores", u: "SpringVibe", c: "landscape" },
        { t: "Fútbol Playa", u: "GoalSetter", c: "sports" },
        { t: "Café Irlandés", u: "SpiritBar", c: "coffee" },
        { t: "Aurora Boreal", u: "NightLight", c: "landscape" },
        { t: "Skate Park", u: "OllieMaster", c: "sports" },
        { t: "Cappuccino Cremoso", u: "CreamyArt", c: "coffee" },
        { t: "Playa Paraíso", u: "IslandBoy", c: "landscape" },
        { t: "Yoga al Aire Libre", u: "ZenLife", c: "sports" },
        { t: "Cold Brew Hielo", u: "IceCoffee", c: "coffee" },
        { t: "Cañón del Colorado", u: "RedRock", c: "landscape" },
        { t: "Natación Olímpica", u: "DeepBlue", c: "sports" },
        { t: "Café y Libro", u: "BookWorm", c: "coffee" },
        { t: "Selva Tropical", u: "Amazonia", c: "landscape" },
        { t: "Boxeo Training", u: "PunchHard", c: "sports" },
        { t: "Desayuno Completo", u: "FoodieCafé", c: "coffee" },
        { t: "Acantilados", u: "OceanEdge", c: "landscape" },
        { t: "Snowboard Pro", u: "PowderDay", c: "sports" },
        { t: "Café Negro", u: "PureBlack", c: "coffee" },
        { t: "Campo de Trigo", u: "GoldenHour", c: "landscape" },
        { t: "Voleibol Arena", u: "SpikeIt", c: "sports" },
        { t: "Cafetería Vintage", u: "RetroVibe", c: "coffee" },
        { t: "Valle Verde", u: "GreenValley", c: "landscape" },
        { t: "Crossfit WOD", u: "BeastMode", c: "sports" },
        { t: "Macchiato", u: "SmallCup", c: "coffee" },
        { t: "Volcán Activo", u: "FireEarth", c: "landscape" },
        { t: "Rugby Match", u: "ScrumMaster", c: "sports" },
        { t: "Café Takeaway", u: "OnTheGo", c: "coffee" },
        { t: "Arrecife Coral", u: "DivingDeep", c: "landscape" },
        { t: "Golf de Lujo", u: "GreenFee", c: "sports" },
        { t: "Café Helado", u: "SummerSip", c: "coffee" },
        { t: "Picos de Europa", u: "SpainTravel", c: "landscape" }
    ];

    // --- CARGA DE PINES (Firebase + Estáticos) ---
    async function cargarTodoElFeed() {
        feed.innerHTML = "";

        try {
            // A) Traer pines reales de Firebase
            const q = query(collection(db, "pines"), orderBy("fecha", "desc"));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const p = doc.data();
                renderizarPin(p.titulo, p.usuario, p.imagen, true);
            });
        } catch (e) { console.log("Cargando solo pines estáticos..."); }

        // B) Añadir los 50 pines de tu lista original
        datosPinesEstaticos.forEach((p, index) => {
            const imgUrl = `https://picsum.photos/seed/${index + 40}/400/${600 + (index % 3 * 100)}`;
            renderizarPin(p.t, p.u, imgUrl, false);
        });
    }

    function renderizarPin(titulo, usuario, img, esFirebase) {
        const pin = document.createElement('div');
        pin.className = 'pin';
        pin.innerHTML = `
            <img src="${img}" alt="${titulo}">
            <div class="pin-info">
                <h4>${titulo}</h4>
                <p>Por <span class="${esFirebase ? 'user-tag' : ''}">@${usuario}</span></p>
            </div>
        `;
        pin.onclick = () => window.verDetalle(titulo, usuario, img);
        feed.appendChild(pin);
    }

    // --- LÓGICA DE USUARIOS CON FIREBASE ---
    onAuthStateChanged(auth, (user) => {
        actualizarNav(user);
        cargarTodoElFeed();
    });

    // Registro
    document.getElementById('registerForm').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('regEmail').value;
        const pass = document.getElementById('regPass').value;
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
            location.reload();
        } catch (err) { alert("Error al registrar: " + err.message); }
    };

    // Login
    document.getElementById('loginForm').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPass').value;
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            location.reload();
        } catch (err) { alert("Usuario o clave incorrecta"); }
    };

    // --- SUBIR NUEVO PIN A FIREBASE ---
    const fInput = document.getElementById('fileInput');
    let fotoBase64 = "";

    fInput.onchange = function() {
        const reader = new FileReader();
        reader.onload = (e) => {
            fotoBase64 = e.target.result;
            document.getElementById('previewImg').src = fotoBase64;
            window.abrirModal('uploadModal');
        };
        reader.readAsDataURL(this.files[0]);
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

            await addDoc(collection(db, "pines"), {
                titulo: t,
                usuario: auth.currentUser.email.split('@')[0],
                imagen: url,
                fecha: Date.now()
            });

            location.reload();
        } catch (err) { alert("Error: " + err.message); }
    };

    // --- FUNCIONES GLOBALES ---
    function actualizarNav(user) {
        const nav = document.getElementById('navActions');
        if(user) {
            nav.innerHTML = `
                <button class="btn-signup" onclick="document.getElementById('fileInput').click()">+ Crear</button>
                <span style="font-weight:800; margin-left:10px">@${user.email.split('@')[0]}</span>
                <button onclick="window.logout()" style="border:none; background:none; color:red; cursor:pointer; margin-left:10px">Salir</button>
            `;
        } else {
            nav.innerHTML = `
                <button class="btn-login" onclick="window.abrirModal('authModal')">Entrar</button>
                <button class="btn-signup" onclick="window.abrirModal('authModal')">Registrarse</button>
            `;
        }
    }

    window.logout = () => signOut(auth).then(() => location.reload());
    window.abrirModal = (id) => document.getElementById(id).style.display = 'flex';
    window.cerrarModal = (id) => document.getElementById(id).style.display = 'none';
    
    window.verDetalle = (t, u, i) => {
        document.getElementById('detTitle').innerText = t;
        document.getElementById('detUser').innerHTML = `Publicado por <span class="user-tag">@${u}</span>`;
        document.getElementById('detImg').src = i;
        window.abrirModal('detailModal');
    };

    // Tabs
    document.getElementById('tabLogin').onclick = () => {
        document.getElementById('tabLogin').classList.add('active'); document.getElementById('tabRegister').classList.remove('active');
        document.getElementById('loginForm').classList.add('active'); document.getElementById('registerForm').classList.remove('active');
    };
    document.getElementById('tabRegister').onclick = () => {
        document.getElementById('tabRegister').classList.add('active'); document.getElementById('tabLogin').classList.remove('active');
        document.getElementById('registerForm').classList.add('active'); document.getElementById('loginForm').classList.remove('active');
    };
});
