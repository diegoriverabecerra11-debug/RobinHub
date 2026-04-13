document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();

    // 1. BASE DE DATOS DE 50 PINES
    const datosPines = [
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

    const feed = document.getElementById('mainFeed');

    // 2. RENDERIZAR PINES
    datosPines.forEach((p, index) => {
        const pin = document.createElement('div');
        pin.className = 'pin';
        const imgUrl = `https://picsum.photos/seed/${index + 40}/400/${600 + (index % 3 * 100)}`;
        
        pin.innerHTML = `
            <img src="${imgUrl}" alt="${p.t}">
            <div class="pin-info">
                <h4>${p.t}</h4>
                <p>Por <span class="user-tag">@${p.u}</span></p>
            </div>
        `;
        pin.onclick = () => verDetalle(p.t, p.u, imgUrl);
        feed.appendChild(pin);
    });

    // 3. LÓGICA DE USUARIOS
    let usuarioLogueado = JSON.parse(localStorage.getItem('userRH')) || null;
    actualizarNav();

    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('regUser').value;
        const pass = document.getElementById('regPass').value;
        const email = document.getElementById('regEmail').value;
        
        const db = JSON.parse(localStorage.getItem('dbRH')) || [];
        db.push({ user, pass, email });
        localStorage.setItem('dbRH', JSON.stringify(db));
        
        usuarioLogueado = { user };
        localStorage.setItem('userRH', JSON.stringify(usuarioLogueado));
        location.reload();
    });

    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPass').value;
        const db = JSON.parse(localStorage.getItem('dbRH')) || [];
        const found = db.find(u => u.email === email && u.pass === pass);
        
        if(found) {
            usuarioLogueado = { user: found.user };
            localStorage.setItem('userRH', JSON.stringify(usuarioLogueado));
            location.reload();
        } else { alert("Datos incorrectos"); }
    });

    function actualizarNav() {
        const nav = document.getElementById('navActions');
        if(usuarioLogueado) {
            nav.innerHTML = `
                <button class="btn-signup" onclick="document.getElementById('fileInput').click()">+ Crear</button>
                <span style="font-weight:800">@${usuarioLogueado.user}</span>
                <button onclick="logout()" style="border:none; background:none; color:red; cursor:pointer">Salir</button>
            `;
        }
    }

    window.logout = () => { localStorage.removeItem('userRH'); location.reload(); };
    window.abrirModal = (id) => document.getElementById(id).style.display = 'flex';
    window.cerrarModal = (id) => document.getElementById(id).style.display = 'none';
    window.verDetalle = (t, u, i) => {
        document.getElementById('detTitle').innerText = t;
        document.getElementById('detUser').innerHTML = `Publicado por <span class="user-tag">@${u}</span>`;
        document.getElementById('detImg').src = i;
        abrirModal('detailModal');
    };

    // Tabs Login/Register
    document.getElementById('tabLogin').onclick = function() {
        this.classList.add('active'); document.getElementById('tabRegister').classList.remove('active');
        document.getElementById('loginForm').classList.add('active'); document.getElementById('registerForm').classList.remove('active');
    };
    document.getElementById('tabRegister').onclick = function() {
        this.classList.add('active'); document.getElementById('tabLogin').classList.remove('active');
        document.getElementById('registerForm').classList.add('active'); document.getElementById('loginForm').classList.remove('active');
    };
});