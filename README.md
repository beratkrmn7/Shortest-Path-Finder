# En Kısa Yol Bulma Projesi

## CENG 3511 – Yapay Zeka Final Projesi

**Öğrenci:** Berat Karaman  
**Numara:** 220709034  

---

## Proje Açıklaması

Bu projede Dijkstra algoritması kullanılarak İzmir şehrinde seçilen iki nokta
arasındaki en kısa yolun bulunması amaçlanmıştır. Uygulama web tabanlıdır ve
harita üzerinde görsel olarak sonuç göstermektedir.

---

## Kullanılan Teknolojiler

- HTML  
- CSS  
- JavaScript  
- Leaflet.js  

---

## Proje Dosyaları

- `index.html` – Ana sayfa  
- `style.css` – Sayfa tasarımı  
- `script.js` – Harita ve kullanıcı işlemleri  
- `dijkstra.js` – Dijkstra algoritması  
- `graph-data.json` – Noktalar, yollar ve mesafeler  

---

## Çalışma Mantığı

Sayfa açıldığında `graph-data.json` dosyası yüklenir. Bu dosyada İzmir’deki
noktalar, koordinatlar ve noktalar arası mesafeler bulunmaktadır. Kullanıcı
harita üzerindeki noktalara tıklayarak veya açılır menüden başlangıç ve varış
noktalarını seçebilir. İki nokta seçildiğinde Dijkstra algoritması çalışır ve
en kısa yol harita üzerinde çizilir. Toplam mesafe ve izlenen güzergah ekranda
gösterilir.

---

## Dijkstra Algoritması

Dijkstra algoritması, ağırlıklı bir graf yapısında en kısa yolu bulmak için
kullanılır. Bu projede negatif ağırlık olmadığı varsayılmıştır. Algoritmanın
zaman karmaşıklığı yaklaşık olarak O(V²)’dir ve kullanılan veri seti için
yeterlidir.

---

## Çalıştırma

JSON dosyası `fetch` ile okunduğu için proje doğrudan çift tıklanarak
çalıştırılamaz. Proje klasöründe terminal açılarak:

python -m http.server

komutu çalıştırılır ve tarayıcıdan:

http://localhost:8000

adresine gidilir.

---

## Notlar

- Mesafeler yaklaşık değerlerdir  
- Proje eğitim amaçlıdır  
- İleride A* algoritması eklenebilir  
