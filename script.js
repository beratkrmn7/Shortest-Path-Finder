// ================================
// GLOBAL DEĞİŞKENLER
// ================================
var izmir_harita = null;
var harita;
var yolCizgisi = null;
var baslangicIsareti = null;
var varisIsareti = null;

// ================================
// SAYFA YÜKLENİNCE JSON OKU
// ================================
window.onload = function () {
    fetch("graph-data.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("JSON dosyası yüklenemedi");
            }
            return response.json();
        })
        .then(data => {
            izmir_harita = data;
            haritayiBaslat();
        })
        .catch(error => {
            alert("Veri yüklenirken hata oluştu!");
            console.error(error);
        });
};

// ================================
// HARİTA BAŞLAT
// ================================
function haritayiBaslat() {
    harita = L.map('map').setView([38.4237, 27.1428], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(harita);

    yollariCiz();
    noktalariEkle();
    dropdownDoldur();
}

// ================================
// YOLLARI ÇİZ
// ================================
function yollariCiz() {
    for (var nokta in izmir_harita.yollar) {
        var baglananlar = izmir_harita.yollar[nokta];

        for (var i = 0; i < baglananlar.length; i++) {
            var hedef = baglananlar[i].node;

            L.polyline([
                izmir_harita.koordinatlar[nokta],
                izmir_harita.koordinatlar[hedef]
            ], {
                color: '#3498db',
                weight: 2,
                opacity: 0.4
            }).addTo(harita);
        }
    }
}

// ================================
// NOKTALARI EKLE
// ================================
function noktalariEkle() {
    for (var i = 0; i < izmir_harita.noktalar.length; i++) {
        var nokta = izmir_harita.noktalar[i];
        var koord = izmir_harita.koordinatlar[nokta];

        var marker = L.circleMarker(koord, {
            radius: 8,
            fillColor: 'red',
            color: 'white',
            weight: 2,
            fillOpacity: 1
        }).addTo(harita);

        (function (secilenNokta) {
            marker.on('click', function () {
                noktaSec(secilenNokta);
            });
            marker.bindTooltip(secilenNokta, { permanent: false, direction: "top" });
        })(nokta);
    }
}

// ================================
// MARKER TIKLAMA MANTIĞI
// ================================
function noktaSec(isim) {
    var baslangicSelect = document.getElementById('startNode');
    var varisSelect = document.getElementById('endNode');

    if (baslangicSelect.value === "") {
        baslangicSelect.value = isim;
    } 
    else if (varisSelect.value === "" && baslangicSelect.value !== isim) {
        varisSelect.value = isim;
        hesaplaYol();
    } 
    else {
        baslangicSelect.value = isim;
        varisSelect.value = "";
        eskiCizgileriTemizle();
        document.getElementById('sonuclar').innerHTML =
            "<p>Yeni başlangıç seçildi...</p>";
    }
}

// ================================
// DROPDOWN DOLDUR
// ================================
function dropdownDoldur() {
    var baslangicSelect = document.getElementById('startNode');
    var varisSelect = document.getElementById('endNode');

    for (var i = 0; i < izmir_harita.noktalar.length; i++) {
        var nokta = izmir_harita.noktalar[i];

        var option1 = document.createElement('option');
        option1.value = nokta;
        option1.text = nokta;
        baslangicSelect.add(option1);

        var option2 = document.createElement('option');
        option2.value = nokta;
        option2.text = nokta;
        varisSelect.add(option2);
    }
}

// ================================
// YOL HESAPLA
// ================================
function hesaplaYol() {
    var baslangic = document.getElementById('startNode').value;
    var varis = document.getElementById('endNode').value;

    if (baslangic === "" || varis === "") {
        alert("Lütfen başlangıç ve varış noktası seçin!");
        return;
    }

    if (baslangic === varis) {
        alert("Başlangıç ve varış aynı olamaz!");
        return;
    }

    eskiCizgileriTemizle();

    var sonuc = dijkstra(izmir_harita.yollar, baslangic, varis);

    if (sonuc.mesafe === Infinity) {
        alert("Bu noktalar arasında yol bulunamadı!");
        return;
    }

    yoluGoster(sonuc, baslangic, varis);
}

// ================================
// ESKİ ÇİZGİLERİ TEMİZLE
// ================================
function eskiCizgileriTemizle() {
    if (yolCizgisi) harita.removeLayer(yolCizgisi);
    if (baslangicIsareti) harita.removeLayer(baslangicIsareti);
    if (varisIsareti) harita.removeLayer(varisIsareti);
}

// ================================
// YOLU HARİTADA GÖSTER
// ================================
function yoluGoster(sonuc, baslangic, varis) {
    var yolKoordinatlari = [];

    for (var i = 0; i < sonuc.yol.length; i++) {
        yolKoordinatlari.push(
            izmir_harita.koordinatlar[sonuc.yol[i]]
        );
    }

    yolCizgisi = L.polyline(yolKoordinatlari, {
        color: '#ff1900',
        weight: 5,
        opacity: 0.8
    }).addTo(harita);

    baslangicIsareti = L.circleMarker(
        izmir_harita.koordinatlar[baslangic], {
        radius: 10,
        fillColor: '#2ecc71',
        color: 'white',
        weight: 2,
        fillOpacity: 1
    }).addTo(harita)
      .bindPopup("Başlangıç: " + baslangic)
      .openPopup();

    varisIsareti = L.circleMarker(
        izmir_harita.koordinatlar[varis], {
        radius: 10,
        fillColor: '#e74c3c',
        color: 'white',
        weight: 2,
        fillOpacity: 1
    }).addTo(harita)
      .bindPopup("Varış: " + varis);

    harita.fitBounds(yolCizgisi.getBounds());
    sonuclariGoster(sonuc);
}

// ================================
// SONUÇLARI GÖSTER
// ================================
function sonuclariGoster(sonuc) {
    var sonucDiv = document.getElementById('sonuclar');

    sonucDiv.innerHTML = `
        <div style="padding:10px; background:#e8f8f5; border-radius:5px;">
            <p><strong>Toplam Mesafe:</strong> ${sonuc.mesafe.toFixed(1)} km</p>
            <p><strong>Geçilen Düğüm Sayısı:</strong> ${sonuc.yol.length}</p>
            <p><strong>Güzergah:</strong><br>${sonuc.yol.join(" ➝ ")}</p>
        </div>
    `;
}

// ================================
// TEMİZLE
// ================================
function temizle() {
    eskiCizgileriTemizle();
    document.getElementById('startNode').value = "";
    document.getElementById('endNode').value = "";
    document.getElementById('sonuclar').innerHTML =
        "<p>Henüz hesaplama yapılmadı.</p>";
    harita.setView([38.4237, 27.1428], 11);
}
