// script.js

document.addEventListener('DOMContentLoaded', () => {
    const reportContainer = document.getElementById('portfolio-summary');
    if (!reportContainer) {
        return;
    }

    let portfolioData = [];
    let filteredData = [];
    let portfolioSummary = {};

    const getById = (id) => document.getElementById(id);

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number' || Number.isNaN(amount)) return 'N/A';
        return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
    };

    const formatPercent = (value) => {
        if (typeof value !== 'number' || Number.isNaN(value)) return 'N/A';
        return `${value.toFixed(2)}%`;
    };

    const formatDate = (value) => {
        if (!value) return 'N/A';
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return 'N/A';
        return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' }).format(d);
    };

    const setSectionStatus = (id, message, type = 'status') => {
        const el = getById(id);
        if (!el) return;

        el.innerHTML = '';
        const p = document.createElement('p');
        p.className = type;
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
            setSectionStatus('portfolio-summary', 'Portföy özet verileri bulunamadı.', 'empty');
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
        fragment.appendChild(createInfoRow('Basitleştirilmiş Genel Reel Getiri', formatPercent(portfolioSummary['Basitlestirilmis Genel Reel Getiri Yuzdesi'])));
        fragment.appendChild(createInfoRow('Ağırlıklı Ortalama Reel Getiri', formatPercent(portfolioSummary['Agirlikli Ortalama Reel Getiri Yuzdesi'])));

        container.appendChild(fragment);
    };

    const renderTableRows = (tbody, data) => {
        tbody.innerHTML = '';

        data.forEach((item) => {
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
                    if (typeof raw === 'number') {
                        td.classList.add(raw >= 0 ? 'pos' : 'neg');
                    }
                }

                row.appendChild(td);
            });

            tbody.appendChild(row);
        });
    };

    const createTableControls = (onChange) => {
        const controls = document.createElement('div');
        controls.className = 'controls';

        const search = document.createElement('input');
        search.type = 'search';
        search.placeholder = 'Hisse ara (örn: ASELS)';
        search.className = 'input';

        const sort = document.createElement('select');
        sort.className = 'select';
        [
            ['Hisse (A-Z)', 'symbol-asc'],
            ['Hisse (Z-A)', 'symbol-desc'],
            ['Kâr/Zarar (Yüksekten Düşüğe)', 'pl-desc'],
            ['Kâr/Zarar (Düşükten Yükseğe)', 'pl-asc']
        ].forEach(([label, value]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = label;
            sort.appendChild(option);
        });

        const update = () => onChange(search.value.trim(), sort.value);
        search.addEventListener('input', update);
        sort.addEventListener('change', update);

        controls.appendChild(search);
        controls.appendChild(sort);
        return controls;
    };

    const applyFiltersAndSort = (query, sortKey) => {
        const upperQuery = query.toUpperCase();
        let list = portfolioData.filter((item) => {
            const symbol = String(item['Hisse'] ?? '').toUpperCase();
            return symbol.includes(upperQuery);
        });

        list = [...list].sort((a, b) => {
            if (sortKey === 'symbol-asc') return String(a['Hisse']).localeCompare(String(b['Hisse']), 'tr');
            if (sortKey === 'symbol-desc') return String(b['Hisse']).localeCompare(String(a['Hisse']), 'tr');
            if (sortKey === 'pl-asc') return (a['Kâr/Zarar'] ?? 0) - (b['Kâr/Zarar'] ?? 0);
            return (b['Kâr/Zarar'] ?? 0) - (a['Kâr/Zarar'] ?? 0);
        });

        filteredData = list;
        return list;
    };

    const populateStockPerformance = () => {
        const container = getById('stock-performance');
        if (!container) return;

        if (portfolioData.length === 0) {
            setSectionStatus('stock-performance', 'Hisse performansı verileri bulunamadı.', 'empty');
            return;
        }

        container.innerHTML = '';

        const heading = document.createElement('h3');
        heading.textContent = 'Hisse Performansı Detayları';

        const info = document.createElement('p');
        info.className = 'muted';

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const headers = [
            'Hisse', 'Alış Fiyatı', 'Güncel Fiyat', 'Yatırım Miktarı',
            'Güncel Değer', 'Kâr/Zarar', 'Nominal Getiri (%)', 'Reel Getiri (%)'
        ];

        const headRow = document.createElement('tr');
        headers.forEach((text) => {
            const th = document.createElement('th');
            th.textContent = text;
            headRow.appendChild(th);
        });
        thead.appendChild(headRow);

        const refreshTable = (query = '', sortKey = 'symbol-asc') => {
            const data = applyFiltersAndSort(query, sortKey);
            if (data.length === 0) {
                info.textContent = 'Sonuç bulunamadı. Filtreyi değiştirebilirsiniz.';
                tbody.innerHTML = '';
                return;
            }

            info.textContent = `${data.length} hisse listeleniyor.`;
            renderTableRows(tbody, data);
        };

        const controls = createTableControls(refreshTable);
        refreshTable('', 'symbol-asc');

        table.appendChild(thead);
        table.appendChild(tbody);
        container.appendChild(heading);
        container.appendChild(controls);
        container.appendChild(info);
        container.appendChild(table);
    };

    const createStockBullet = (stockLabel, stockData) => {
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        strong.textContent = `${stockLabel}: `;

        const text = `Nominal ${formatPercent(stockData?.['Nominal Getiri'])}, `
            + `Reel ${formatPercent(stockData?.['Reel Getiri Yüzdesi'])}, `
            + `Alış: ${formatDate(stockData?.['Alış Tarihi'])}`;

        li.appendChild(strong);
        li.append(text);
        return li;
    };

    const populateRealReturnAnalysis = () => {
        const container = getById('real-return-analysis');
        if (!container) return;

        if (Object.keys(portfolioSummary).length === 0 || portfolioData.length === 0) {
            setSectionStatus('real-return-analysis', 'Reel getiri analizi verileri bulunamadı.', 'empty');
            return;
        }

        const getStockData = (name) => portfolioData.find((item) => item['Hisse'] === name);

        container.innerHTML = '';

        const heading = document.createElement('h3');
        heading.textContent = 'Detaylı Reel Getiri Analizi';

        const p1 = createInfoRow('Basitleştirilmiş Genel Reel Getiri', formatPercent(portfolioSummary['Basitlestirilmis Genel Reel Getiri Yuzdesi']));
        const p2 = createInfoRow('Ağırlıklı Ortalama Reel Getiri', formatPercent(portfolioSummary['Agirlikli Ortalama Reel Getiri Yuzdesi']));

        const subHeading = document.createElement('h3');
        subHeading.textContent = 'Örnek Hisselerde Enflasyon Etkisi';

        const list = document.createElement('ul');
        ['ASELS', 'TUPRS', 'METRO', 'TOASO', 'GARAN'].forEach((symbol) => {
            list.appendChild(createStockBullet(symbol, getStockData(symbol)));
        });

        const summaryText = document.createElement('p');
        summaryText.textContent = 'Özetle, nominal getiri tek başına yeterli bir gösterge değildir; alım zamanına bağlı enflasyon etkisi gerçek performansı belirgin şekilde değiştirebilir.';

        container.appendChild(heading);
        container.appendChild(p1);
        container.appendChild(p2);
        container.appendChild(subHeading);
        container.appendChild(list);
        container.appendChild(summaryText);
    };

    const setLoadingStates = () => {
        setSectionStatus('portfolio-summary', 'Portföy özeti yükleniyor...', 'status');
        setSectionStatus('stock-performance', 'Hisse performansı yükleniyor...', 'status');
        setSectionStatus('real-return-analysis', 'Reel getiri analizi hazırlanıyor...', 'status');
    };

    setLoadingStates();

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
            portfolioData = Array.isArray(data) ? data : [];
            portfolioSummary = summary && typeof summary === 'object' ? summary : {};

            populateStockPerformance();
            populatePortfolioSummary();
            populateRealReturnAnalysis();
        })
        .catch((error) => {
            console.error('JSON verileri yüklenirken hata oluştu:', error);
            setSectionStatus('stock-performance', 'Hisse performansı verileri yüklenirken hata oluştu.', 'error');
            setSectionStatus('portfolio-summary', 'Portföy özet verileri yüklenirken hata oluştu.', 'error');
            setSectionStatus('real-return-analysis', 'Reel getiri analizi verileri yüklenirken hata oluştu.', 'error');
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
