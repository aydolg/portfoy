// script.js

document.addEventListener('DOMContentLoaded', () => {
    let portfolioData = [];
    let portfolioSummary = {};

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number' || Number.isNaN(amount)) return 'N/A';
        return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
    };

    const formatPercent = (value) => {
        if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
        return `${value.toFixed(2)}%`;
    };

    const getById = (id) => document.getElementById(id);

    const setSectionError = (id, message) => {
        const el = getById(id);
        if (!el) return;
        el.innerHTML = '';
        const p = document.createElement('p');
        p.className = 'error';
        p.textContent = message;
        el.appendChild(p);
    };

    const createInfoRow = (label, value) => {
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = `${label}: `;
        p.appendChild(strong);
        p.append(value);
        return p;
    };

    const populatePortfolioSummary = () => {
        const container = getById('portfolio-summary');
        if (!container) return;

        if (Object.keys(portfolioSummary).length === 0) {
            setSectionError('portfolio-summary', 'Portföy özet verileri yüklenemedi.');
            return;
        }

        container.innerHTML = '';
        const heading = document.createElement('h3');
        heading.textContent = 'Portföy Getiri Özetleri';

        const fragment = document.createDocumentFragment();
        fragment.appendChild(heading);
        fragment.appendChild(createInfoRow('Toplam Yatırım Miktarı', formatCurrency(portfolioSummary['Toplam Yatırım Miktarı'])));
        fragment.appendChild(createInfoRow('Toplam Güncel Değer', formatCurrency(portfolioSummary['Toplam Güncel Değer'])));
        fragment.appendChild(createInfoRow('Toplam Kâr/Zarar', formatCurrency(portfolioSummary['Toplam Kar/Zarar'])));
        fragment.appendChild(createInfoRow('Toplam Nominal Getiri Yüzdesi', formatPercent(portfolioSummary['Toplam Nominal Getiri Yuzdesi'])));
        fragment.appendChild(createInfoRow('Basitleştirilmiş Genel Reel Getiri (Yıllık Enflasyon Bazlı)', formatPercent(portfolioSummary['Basitlestirilmis Genel Reel Getiri Yuzdesi'])));
        fragment.appendChild(createInfoRow('Ağırlıklı Ortalama Reel Getiri (Hisse Bazında Kümülatif Enflasyon ile)', formatPercent(portfolioSummary['Agirlikli Ortalama Reel Getiri Yuzdesi'])));

        container.appendChild(fragment);
    };

    const populateStockPerformance = () => {
        const container = getById('stock-performance');
        if (!container) return;

        if (portfolioData.length === 0) {
            setSectionError('stock-performance', 'Hisse performansı verileri yüklenemedi.');
            return;
        }

        container.innerHTML = '';

        const heading = document.createElement('h3');
        heading.textContent = 'Hisse Performansı Detayları';

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const headers = [
            'Hisse',
            'Alış Fiyatı',
            'Güncel Fiyat',
            'Yatırım Miktarı',
            'Güncel Değer',
            'Kâr/Zarar',
            'Nominal Getiri (%)',
            'Reel Getiri (%)'
        ];

        const headRow = document.createElement('tr');
        headers.forEach((text) => {
            const th = document.createElement('th');
            th.textContent = text;
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);

        portfolioData.forEach((item) => {
            const row = document.createElement('tr');
            const cells = [
                item['Hisse'] ?? 'N/A',
                formatCurrency(item['Alış Fiyatı']),
                formatCurrency(item['Güncel Fiyat']),
                formatCurrency(item['Yatırım Miktarı']),
                formatCurrency(item['Güncel Değer']),
                formatCurrency(item['Kâr/Zarar']),
                formatPercent(item['Nominal Getiri']),
                formatPercent(item['Reel Getiri Yüzdesi'])
            ];

            cells.forEach((cellValue, index) => {
                const td = document.createElement('td');
                td.textContent = String(cellValue);
                if (index === 5) {
                    const raw = item['Kâr/Zarar'];
                    td.classList.add(raw >= 0 ? 'pos' : 'neg');
                }
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);
        container.appendChild(heading);
        container.appendChild(table);
    };

    const populateRealReturnAnalysis = () => {
        const container = getById('real-return-analysis');
        if (!container) return;

        if (Object.keys(portfolioSummary).length === 0 || portfolioData.length === 0) {
            setSectionError('real-return-analysis', 'Reel getiri analizi verileri yüklenemedi.');
            return;
        }

        const getStockData = (name) => portfolioData.find((item) => item['Hisse'] === name);
        const fmtDate = (value) => {
            if (!value) return 'N/A';
            const d = new Date(value);
            if (Number.isNaN(d.getTime())) return 'N/A';
            return d.toISOString().slice(0, 10);
        };

        const asels = getStockData('ASELS');
        const tuprs = getStockData('TUPRS');
        const metro = getStockData('METRO');
        const toaso = getStockData('TOASO');
        const garan = getStockData('GARAN');

        container.innerHTML = `
            <h3>Detaylı Reel Getiri Analizi</h3>
            <p><strong>Basitleştirilmiş Genel Reel Getiri:</strong> ${formatPercent(portfolioSummary['Basitlestirilmis Genel Reel Getiri Yuzdesi'])}</p>
            <p><strong>Ağırlıklı Ortalama Reel Getiri:</strong> ${formatPercent(portfolioSummary['Agirlikli Ortalama Reel Getiri Yuzdesi'])}</p>

            <h3>Örnek Hisselerde Enflasyon Etkisi</h3>
            <ul>
                <li><strong>ASELS:</strong> Nominal ${formatPercent(asels?.['Nominal Getiri'])}, Reel ${formatPercent(asels?.['Reel Getiri Yüzdesi'])}, Alış: ${fmtDate(asels?.['Alış Tarihi'])}</li>
                <li><strong>TUPRS:</strong> Nominal ${formatPercent(tuprs?.['Nominal Getiri'])}, Reel ${formatPercent(tuprs?.['Reel Getiri Yüzdesi'])}, Alış: ${fmtDate(tuprs?.['Alış Tarihi'])}</li>
                <li><strong>METRO:</strong> Nominal ${formatPercent(metro?.['Nominal Getiri'])}, Reel ${formatPercent(metro?.['Reel Getiri Yüzdesi'])}, Alış: ${fmtDate(metro?.['Alış Tarihi'])}</li>
                <li><strong>TOASO:</strong> Nominal ${formatPercent(toaso?.['Nominal Getiri'])}, Reel ${formatPercent(toaso?.['Reel Getiri Yüzdesi'])}, Alış: ${fmtDate(toaso?.['Alış Tarihi'])}</li>
                <li><strong>GARAN:</strong> Nominal ${formatPercent(garan?.['Nominal Getiri'])}, Reel ${formatPercent(garan?.['Reel Getiri Yüzdesi'])}, Alış: ${fmtDate(garan?.['Alış Tarihi'])}</li>
            </ul>

            <p>Özetle, nominal getiri tek başına yeterli bir gösterge değildir; alım zamanına bağlı enflasyon etkisi gerçek performansı belirgin şekilde değiştirebilir.</p>
        `;
    };

    Promise.all([
        fetch('portfolio_data.json').then((res) => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        }),
        fetch('portfolio_summary.json').then((res) => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
    ])
        .then(([data, summary]) => {
            portfolioData = data;
            portfolioSummary = summary;

            populateStockPerformance();
            populatePortfolioSummary();
            populateRealReturnAnalysis();
        })
        .catch((error) => {
            console.error('JSON verileri yüklenirken hata oluştu:', error);
            setSectionError('stock-performance', 'Hisse performansı verileri yüklenirken hata oluştu.');
            setSectionError('portfolio-summary', 'Portföy özet verileri yüklenirken hata oluştu.');
            setSectionError('real-return-analysis', 'Reel getiri analizi verileri yüklenirken hata oluştu.');
        });

    const benchmarkChartImg = getById('benchmark-chart');
    const benchmarkMessage = getById('benchmark-message');

    if (benchmarkChartImg) {
        benchmarkChartImg.src = 'benchmark_comparison.png';
        benchmarkChartImg.alt = 'Portföy ve Benchmark Getirileri Karşılaştırması';
        benchmarkChartImg.onerror = () => {
            benchmarkChartImg.classList.add('hidden');
            if (benchmarkMessage) {
                benchmarkMessage.textContent = 'Benchmark grafiği bulunamadı.';
                benchmarkMessage.classList.remove('hidden');
            }
        };
    }
});
