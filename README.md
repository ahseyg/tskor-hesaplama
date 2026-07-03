# Not ve T-Skor Hesaplayici

Bu uygulama, universite ogrencilerinin ders notlarini ve harf notu karsiliklarini bagil (can egrisi) veya sabit sistem uzerinden hesaplamalarina yardimci olmak amaciyla gelistirilmis web tabanli bir aractir.

## Ozellikler

*   Bagil ve Sabit Sistem Destegi: Dersin niteligine gore istediginiz sistemi secebilirsiniz.
*   Standart Sapma Tahmini: Bagil sistemde sinif standart sapmasi bilinmedigi durumlarda, dusuk (10), orta (15) ve yuksek (20) standart sapma senaryolarina gore uc farkli harf notu tahmini sunar.
*   Anlik Not Ortalamasi (ANO): Mevcut yariyil icerisindeki derslerinizin ortalamasini anlik olarak hesaplar.
*   Genel Agirlikli Not Ortalamasi (AGNO): Onceki donemlere ait AKTS ve AGNO bilgilerinizi girerek kumulatif ortalamanizi gorebilirsiniz.
*   Veri Yedekleme ve Tasima: Girilen tum dersleri ve gecmis donem verilerini JSON formati ile disa aktarabilir ve baska bir tarayicida veya cihazda ice aktararak kaldiginiz yerden devam edebilirsiniz.
*   Modern Arayuz: Gozu yormayan, kullanici dostu, karanlik (dark mode) tasarim.

## Kurulum ve Calistirma

Proje, React ve Vite kullanilarak gelistirilmistir. Kendi bilgisayarinizda calistirmak icin asagidaki adimlari izleyin:

1. Bagimliliklari yukleyin:
   npm install

2. Gelistirme sunucusunu baslatin:
   npm run dev

3. Uygulamaya tarayicinizdan http://localhost:5173 adresi uzerinden erisin.

## GitHub Pages Uzerinde Yayinlama

Bu proje GitHub Pages uzerinde yayinlanmaya hazirdir.

1. package.json icerisindeki homepage satirini kendi GitHub adresinize gore duzenleyin:
   "homepage": "https://[KULLANICI_ADINIZ].github.io/[REPO_ADINIZ]"

2. Projeyi yayina almak icin terminalde asagidaki komutu calistirin:
   npm run deploy

## Kullanilan Teknolojiler

*   React
*   Vite
*   Vanilla CSS
