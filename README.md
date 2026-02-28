# portfoy

Basit bir istemci tarafı portföy analiz raporu.

## Çalıştırma

```bash
python3 -m http.server 8000
```

Ardından tarayıcıdan `http://localhost:8000/index.html` adresini açın.

## Sayfa akışı

- `index.html`: Giriş (landing) sayfası.
- `rapor.html`: Portföy analizinin tamamını gösteren asıl rapor sayfası.

## Smoke test

Sunucu açıkken aşağıdaki komutla temel smoke testi çalıştırılabilir:

```bash
python3 smoke_test.py
```

Bu test, `index.html` ve `rapor.html` sayfalarının açıldığını ve rapor sayfasında temel bölümlerin yer aldığını doğrular.

## Dosyalar

- `index.html`: Giriş sayfası.
- `rapor.html`: Portföy analiz raporu sayfası.
- `script.js`: JSON verilerini yükler, filtre/sıralama ile raporu oluşturur.
- `style.css`: Sayfa stilleri.
- `portfolio_data.json`: Hisse bazlı detay veriler.
- `portfolio_summary.json`: Toplam portföy özeti.
- `smoke_test.py`: Basit endpoint ve içerik smoke testi.
