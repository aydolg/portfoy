# portfoy

Basit bir istemci tarafı portföy analiz raporu.

## Çalıştırma

```bash
python3 -m http.server 8000
```

Ardından tarayıcıdan `http://localhost:8000/index.html` adresini açın.

> Not: Detaylı rapora doğrudan `http://localhost:8000/rapor.html` ile de erişebilirsiniz.

## Dosyalar

- `index.html`: Giriş sayfası (rapor bağlantısı içerir).
- `rapor.html`: Portföy analiz raporu sayfası.
- `script.js`: JSON verilerini yükler ve raporu oluşturur.
- `style.css`: Sayfa stilleri.
- `portfolio_data.json`: Hisse bazlı detay veriler.
- `portfolio_summary.json`: Toplam portföy özeti.
