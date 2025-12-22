// Dijkstra Algoritması
// En kısa yolu bulmak için kullanılır

function dijkstra(graf, baslangic, bitis) {
    // Mesafeleri tutacak obje
    var mesafeler = {};
    
    // Önceki düğümleri tutacak obje (yolu bulmak için)
    var oncekiler = {};
    
    // Ziyaret edilmeyen düğümler
    var ziyaretEdilmeyenler = [];
    
    // Tüm düğümleri al
    for (var dugum in graf) {
        mesafeler[dugum] = Infinity; // Başta hepsine sonsuz mesafe ver
        oncekiler[dugum] = null;
        ziyaretEdilmeyenler.push(dugum);
    }
    
    // Başlangıç düğümünün mesafesini 0 yap
    mesafeler[baslangic] = 0;
    
    // Ana döngü - tüm düğümler ziyaret edilene kadar devam et
    while (ziyaretEdilmeyenler.length > 0) {
        
        // En küçük mesafeli düğümü bul
        var enKucukDugum = null;
        var enKucukMesafe = Infinity;
        
        for (var i = 0; i < ziyaretEdilmeyenler.length; i++) {
            var dugum = ziyaretEdilmeyenler[i];
            if (mesafeler[dugum] < enKucukMesafe) {
                enKucukMesafe = mesafeler[dugum];
                enKucukDugum = dugum;
            }
        }
        
        // Eğer düğüm bulunamadıysa veya mesafe sonsuza eşitse dur
        if (enKucukDugum === null || mesafeler[enKucukDugum] === Infinity) {
            break;
        }
        
        // Bitişe ulaştıysak dur
        if (enKucukDugum === bitis) {
            break;
        }
        
        // Bu düğümü ziyaret edildi olarak işaretle (listeden çıkar)
        var index = ziyaretEdilmeyenler.indexOf(enKucukDugum);
        ziyaretEdilmeyenler.splice(index, 1);
        
        // Komşu düğümleri kontrol et
        var komsular = graf[enKucukDugum];
        if (komsular) {
            for (var j = 0; j < komsular.length; j++) {
                var komsu = komsular[j];
                var komsuDugum = komsu.node;
                var komsuMesafe = komsu.weight;
                
                // Yeni mesafeyi hesapla
                var yeniMesafe = mesafeler[enKucukDugum] + komsuMesafe;
                
                // Eğer yeni mesafe daha kısaysa güncelle
                if (yeniMesafe < mesafeler[komsuDugum]) {
                    mesafeler[komsuDugum] = yeniMesafe;
                    oncekiler[komsuDugum] = enKucukDugum;
                }
            }
        }
    }
    
    // Yolu oluştur (geriye doğru giderek)
    var yol = [];
    var suankiDugum = bitis;
    
    while (suankiDugum !== null) {
        yol.unshift(suankiDugum); // Başa ekle
        suankiDugum = oncekiler[suankiDugum];
    }
    
    // Sonucu döndür
    return {
        mesafe: mesafeler[bitis],
        yol: yol
    };
}