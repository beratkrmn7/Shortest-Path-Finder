// script.js - İşaretçileri (Marker) kaldıran güncel sürüm

// Global Variables
let map;
let selectedPoints = [];
let routeLayer = null;
let graphLayer = L.layerGroup();
let currentMode = 'free';
let currentAlgorithm = 'dijkstra';

// İkon tanımlamalarını siliyoruz çünkü artık marker kullanmayacağız

window.onload = function() {
    map = L.map('map').setView([38.4237, 27.1428], 11);

    // Canlı Voyager katmanı
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors & CARTO',
        maxZoom: 19
    }).addTo(map);

    graphLayer.addTo(map);

    map.on('click', function(e) {
        if (currentMode === 'free' && selectedPoints.length < 2) {
            addPoint(e.latlng, null);
        }
    });

    setMode('free');
};

function setMode(mode) {
    currentMode = mode;
    clearMap();
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(mode + 'Mode').classList.add('active');

    const instructions = document.getElementById('instructions');
    if (mode === 'graph') {
        showGraphNodes();
        instructions.innerHTML = `<p style="font-size:13px; color:#64748b;">Graph Mode: Select predefined markers on the map.</p>`;
    } else {
        graphLayer.clearLayers();
        instructions.innerHTML = `<p style="font-size:13px; color:#64748b;">Free Mode: Click anywhere on the map to set points.</p>`;
    }
}

function setAlgorithm(algo) {
    currentAlgorithm = algo;
    document.querySelectorAll('.algo-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('algo' + algo.charAt(0).toUpperCase() + algo.slice(1)).classList.add('active');
    if (currentMode === 'graph' && selectedPoints.length === 2) calculatePath();
}

function showGraphNodes() {
    graphLayer.clearLayers();
    for (let name in graphData.nodes) {
        const coord = graphData.nodes[name];
        const marker = L.circleMarker(coord, {
            radius: 6, // Biraz daha küçülttük
            color: '#fff',
            fillColor: '#667eea',
            fillOpacity: 0.9,
            weight: 2
        }).bindTooltip(name, { permanent: true, direction: 'top', className: 'my-tooltip', offset: [0, -10] });

        marker.on('click', function() {
            if (currentMode === 'graph' && (selectedPoints.length === 0 || selectedPoints[0].name !== name)) {
                if (selectedPoints.length < 2) addPoint(L.latLng(coord), name);
            }
        });
        graphLayer.addLayer(marker);
    }
}

// GÜNCELLENEN FONKSİYON: Marker eklemeyi durdurduk
function addPoint(latlng, name) {
    // Görseldeki yeşil/kırmızı ikonları (L.marker) artık eklemiyoruz.
    // Sadece koordinatları listeye alıyoruz.
    selectedPoints.push({ latlng, name });

    // Geçici olarak tıkladığın yeri belli etmek istersen ufak bir daire bırakabiliriz:
    L.circleMarker(latlng, { radius: 4, color: '#ff4757' }).addTo(map);

    if (selectedPoints.length === 2) calculatePath();
}

function calculatePath() {
    if (selectedPoints.length < 2) return;
    document.getElementById('loadingOverlay').classList.add('show');
    currentMode === 'graph' ? calculateGraphPath() : calculateFreePath();
}

function calculateGraphPath() {
    const start = selectedPoints[0].name, end = selectedPoints[1].name;
    try {
        let result = currentAlgorithm === 'dijkstra' ? dijkstra(start, end) :
                     (currentAlgorithm === 'astar' ? astar(start, end) : bfs(start, end));
        document.getElementById('loadingOverlay').classList.remove('show');
        if (!result) return alert("No path found!");
        drawGraphRoute(result.path);
        displayResults(result.distance, result.path.length, currentAlgorithm);
    } catch (e) { document.getElementById('loadingOverlay').classList.remove('show'); }
}

async function calculateFreePath() {
    const p1 = selectedPoints[0].latlng, p2 = selectedPoints[1].latlng;
    const url = `https://router.project-osrm.org/route/v1/driving/${p1.lng},${p1.lat};${p2.lng},${p2.lat}?overview=full&geometries=geojson`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        document.getElementById('loadingOverlay').classList.remove('show');
        if (data.code !== 'Ok') return alert("No route found");
        const route = data.routes[0];
        if (routeLayer) map.removeLayer(routeLayer);

        // Rota çizgisi
        routeLayer = L.geoJSON(route.geometry, {
            style: { color: '#ff4757', weight: 6, opacity: 0.9 }
        }).addTo(map);

        map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
        updateResultsHTML((route.distance / 1000).toFixed(2) + " km", Math.round(route.duration / 60) + " min", "Real road data");
    } catch (e) { document.getElementById('loadingOverlay').classList.remove('show'); }
}

function drawGraphRoute(pathNodes) {
    if (routeLayer) map.removeLayer(routeLayer);
    const latlngs = pathNodes.map(name => graphData.nodes[name]);
    routeLayer = L.polyline(latlngs, { color: '#ff4757', weight: 6, dashArray: '10, 10', opacity: 0.9 }).addTo(map);
    map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
}

function displayResults(dist, steps, algo) {
    updateResultsHTML(dist.toFixed(2) + " units", Math.round(dist * 1.5) + " min", `Algorithm: ${algo.toUpperCase()}`);
}

function updateResultsHTML(dist, time, extra) {
    document.getElementById('results').innerHTML = `
        <div class="result-grid">
            <div class="result-item"><div class="result-label">Distance</div><div class="result-value">${dist}</div></div>
            <div class="result-item"><div class="result-label">Est. Time</div><div class="result-value">${time}</div></div>
        </div>
        <div class="route-path"><strong>Info:</strong> ${extra}</div>`;
}

function clearMap() {
    // Ekrandaki tüm çizimleri ve geçici noktaları temizle
    map.eachLayer((layer) => {
        if (layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
            // Grafik düğümlerini silme (onlar graphLayer içinde)
            if (!graphLayer.hasLayer(layer)) {
                map.removeLayer(layer);
            }
        }
    });

    selectedPoints = [];
    if (routeLayer) map.removeLayer(routeLayer);
    routeLayer = null;
    document.getElementById('results').innerHTML = '<p style="text-align:center;padding:20px; font-size:12px; color:#64748b;">Select two points.</p>';
    if (currentMode === 'graph') showGraphNodes();
}
