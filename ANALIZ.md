# Portföy Analizi

Bu analiz, `portfolio_data.json` ve `portfolio_summary.json` içindeki mevcut anlık değerler üzerinden hazırlanmıştır.

## 1) Genel görünüm

- Toplam yatırım: **4.124.255,88 TL**
- Toplam güncel değer: **5.624.735,36 TL**
- Toplam kâr/zarar: **+1.500.479,48 TL**
- Toplam nominal getiri: **%36,38**
- Pozisyon sayısı: **15 hisse**

Özetle portföy nominal olarak güçlü artıdadır; ancak reel getiride kullanılan yönteme göre sonuçlar ayrışmaktadır.

## 2) Reel getiri yorumu

`portfolio_summary.json` içinde iki farklı reel getiri metriği bulunuyor:

- Basitleştirilmiş genel reel getiri: **-%14,85**
- Ağırlıklı ortalama reel getiri: **%14,51**

Bu fark, hesap yöntemi farklılığından kaynaklanır:
- Basitleştirilmiş yaklaşım, portföyü tek bir zaman noktasından alınmış gibi değerlendirir.
- Ağırlıklı ortalama yaklaşım, her pozisyonun alış zamanı ve ağırlığını dikkate alır.

Kademeli alım yapılan portföylerde ikinci metrik genelde daha temsil edicidir.

## 3) Yoğunlaşma (konsantrasyon) riski

Portföy ağırlıkları bazı hisselerde belirgin şekilde yoğunlaşmıştır:

- BIMAS: **%36,36**
- AEFES: **%9,83**
- THYAO: **%7,72**
- MGROS: **%7,57**
- AKBNK: **%7,00**

Yoğunlaşma göstergeleri:
- İlk 3 pozisyon toplamı: **%53,91**
- İlk 5 pozisyon toplamı: **%68,48**

BIMAS tek başına çok yüksek ağırlığa sahip olduğu için, tek-hisse kaynaklı oynaklık portföy toplamını anlamlı etkileyebilir.

## 4) Katkı analizi (kâr/zarar)

Kâra en yüksek katkı yapanlar:
- BIMAS: **+581.545,80 TL**
- ASELS: **+386.583,30 TL**
- TUPRS: **+207.806,03 TL**

Nominal olarak negatifte kalanlar:
- THYAO: **-10.360,00 TL**
- KCHOL: **-1.704,00 TL**
- TOASO: **-233,22 TL**

Bu dağılım, performansın birkaç güçlü kazanan hissede toplandığını gösteriyor.

## 5) Enflasyon karşısında gözlem

Pozisyon bazında reel getiriler incelendiğinde:
- Çok güçlü reel performans: ASELS (**%103,80**), METRO (**%42,83**), TUPRS (**%36,10**), VAKBN (**%30,86**)
- Enflasyon altında kalan/negatif reel: AEFES (**-%1,14**), THYAO (**-%3,25**), KCHOL (**-%2,67**), TOASO (**-%0,12**)

Dolayısıyla nominal kâr ile reel alım gücü artışı her pozisyonda aynı değildir.

## 6) Kısa aksiyon önerileri (yatırım tavsiyesi değildir)

1. **Ağırlık limiti tanımlayın**: Tek hissede üst sınır (ör. %20-25) belirlemek konsantrasyon riskini azaltır.
2. **Periyodik dengeleme uygulayın**: Aşırı büyüyen pozisyonlardan kısmi kâr realize edip düşük ağırlıklı/stratejik alanlara dağıtım yapılabilir.
3. **Reel performansı ana KPI yapın**: Nominal yerine reel getiri ve ağırlıklı reel katkıyı aylık izlemek daha sağlıklı karar sağlar.
4. **Senaryo testi ekleyin**: En büyük 3 pozisyonda eşanlı %10 düşüş senaryosunun toplam portföye etkisini düzenli hesaplayın.

## 7) Veriyle ilgili not

Alış tarihleri içinde 2026 yılına denk gelen timestamp’ler bulunuyor. Bu, ileri tarihli işlem planı veya veri giriş formatı nedeniyle olabilir; raporlama döneminde yanlış anlaşılmayı önlemek için tarih etiketinin netleştirilmesi faydalı olur.
