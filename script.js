// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("HTML içeriği yüklendi, JavaScript çalışıyor...");
    const reportContainer = document.getElementById('portfolio-summary');
    if (!reportContainer) {
        return;
    }

    let portfolioData = [];
    let filteredData = [];
    let portfolioSummary = {};

    // Function to format currency
    const getById = (id) => document.getElementById(id);

    const formatCurrency = (amount) => {
        if (typeof amount !== 'number') return amount; // Handle non-numeric values
        if (typeof amount !== 'number' || Number.isNaN(amount)) return 'N/A';
        return amount.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
    };

    // Function to populate portfolio summary section
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
        const portfolioSummaryDiv = document.getElementById('portfolio-summary');
        if (!portfolioSummaryDiv) {
            console.warn("ID 'portfolio-summary' ile div etiketi bulunamadı.");
            return;
        }
        const container = getById('portfolio-summary');
        if (!container) return;

        if (Object.keys(portfolioSummary).length === 0) {
            portfolioSummaryDiv.innerHTML = '<p class="error">Portföy özet verileri yüklenemedi.</p>';
            setSectionStatus('portfolio-summary', 'Portföy özet verileri bulunamadı.', 'empty');
            return;
        }

        portfolioSummaryDiv.innerHTML = `
            <h3>Portföy Getiri Özetleri</h3>
            <p><strong>Toplam Yatırım Miktarı:</strong> ${formatCurrency(portfolioSummary['Toplam Yatırım Miktarı'])}</p>
            <p><strong>Toplam Güncel Değer:</strong> ${formatCurrency(portfolioSummary['Toplam Güncel Değer'])}</p>
            <p><strong>Toplam Kâr/Zarar:</strong> ${formatCurrency(portfolioSummary['Toplam Kar/Zarar'])}</p>
            <p><strong>Toplam Nominal Getiri Yüzdesi:</strong> ${portfolioSummary['Toplam Nominal Getiri Yuzdesi'].toFixed(2)}%</p>
            <p><strong>Basitleştirilmiş Genel Reel Getiri (Yıllık Enflasyon Bazlı):</strong> ${portfolioSummary['Basitlestirilmis Genel Reel Getiri Yuzdesi'].toFixed(2)}%</p>
            <p><strong>Ağırlıklı Ortalama Reel Getiri (Hisse Bazında Kümülatif Enflasyon ile):</strong> ${portfolioSummary['Agirlikli Ortalama Reel Getiri Yuzdesi'].toFixed(2)}%</p>
        `;
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

    // Function to populate stock performance table
    const populateStockPerformance = () => {
        const stockPerformanceDiv = document.getElementById('stock-performance');
        if (!stockPerformanceDiv) {
            console.warn("ID 'stock-performance' ile div etiketi bulunamadı.");
            return;
        }
        const container = getById('stock-performance');
        if (!container) return;

        if (portfolioData.length === 0) {
            stockPerformanceDiv.innerHTML = '<p class="error">Hisse performansı verileri yüklenemedi.</p>';
            setSectionStatus('stock-performance', 'Hisse performansı verileri bulunamadı.', 'empty');
            return;
        }

        let tableHTML = `
            <h3>Hisse Performansı Detayları</h3>
            <table border="1" style="width:100%; border-collapse: collapse; text-align: left;">
                <thead>
                    <tr>
                        <th style="padding: 8px;">Hisse</th>
                        <th style="padding: 8px;">Alış Fiyatı</th>
                        <th style="padding: 8px;">Güncel Fiyat</th>
                        <th style="padding: 8px;">Yatırım Miktarı</th>
                        <th style="padding: 8px;">Güncel Değer</th>
                        <th style="padding: 8px;">Kâr/Zarar</th>
                        <th style="padding: 8px;">Nominal Getiri (%)</th>
                        <th style="padding: 8px;">Reel Getiri (%)</th>
                    </tr>
                </thead>
                <tbody>
        `;
        portfolioData.forEach(item => {
            tableHTML += `
                    <tr>
                        <td style="padding: 8px;">${item['Hisse']}</td>
                        <td style="padding: 8px;">${formatCurrency(item['Alış Fiyatı'])}</td>
                        <td style="padding: 8px;">${formatCurrency(item['Güncel Fiyat'])}</td>
                        <td style="padding: 8px;">${formatCurrency(item['Yatırım Miktarı'])}</td>
                        <td style="padding: 8px;">${formatCurrency(item['Güncel Değer'])}</td>
                        <td style="padding: 8px;">${formatCurrency(item['Kâr/Zarar'])}</td>
                        <td style="padding: 8px;">${item['Nominal Getiri'].toFixed(2)}%</td>
                        <td style="padding: 8px;">${item['Reel Getiri Yüzdesi'].toFixed(2)}%</td>
                    </tr>
            `;
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
        tableHTML += `
                </tbody>
            </table>
        `;
        stockPerformanceDiv.innerHTML = tableHTML;
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

    // Function to populate real return analysis section
    const populateRealReturnAnalysis = () => {
        const realReturnAnalysisDiv = document.getElementById('real-return-analysis');
        if (!realReturnAnalysisDiv) {
            console.warn("ID 'real-return-analysis' ile div etiketi bulunamadı.");
            return;
        }
        const container = getById('real-return-analysis');
        if (!container) return;

        if (Object.keys(portfolioSummary).length === 0 || portfolioData.length === 0) {
             realReturnAnalysisDiv.innerHTML = '<p class="error">Reel getiri analizi verileri yüklenemedi.</p>';
             return;
            setSectionStatus('real-return-analysis', 'Reel getiri analizi verileri bulunamadı.', 'empty');
            return;
        }

        // Helper to find stock data by 'Hisse' for cumulative inflation factor
        const getStockData = (hisseName) => portfolioData.find(item => item['Hisse'] === hisseName);

        const aselsData = getStockData('ASELS');
        const tuprsData = getStockData('TUPRS');
        const metroData = getStockData('METRO');
        const toasoData = getStockData('TOASO');
        const garanData = getStockData('GARAN');


        const aselsInflation = aselsData ? ((aselsData['Kümülatif Enflasyon Faktörü'] - 1) * 100).toFixed(2) : 'N/A';
        const tuprsInflation = tuprsData ? ((tuprsData['Kümülatif Enflasyon Faktörü'] - 1) * 100).toFixed(2) : 'N/A';
        const metroInflation = metroData ? ((metroData['Kümülatif Enflasyon Faktörü'] - 1) * 100).toFixed(2) : 'N/A';


        const analysisHTML = `
            <h3>Basitleştirilmiş ve Ağırlıklı Ortalama Reel Getiri Karşılaştırması:</h3>
            <p>
                *   <strong>Basitleştirilmiş Genel Reel Getiri (${portfolioSummary['Basitlestirilmis Genel Reel Getiri Yuzdesi'].toFixed(2)}%):</strong> Bu hesaplama, portföyün toplam nominal getirisi ile tek bir yıllık enflasyon oranını (genellikle en güncel veya varsayılan bir oran) kullanarak yapılmıştır. Bu yöntem, tüm portföy için tek bir enflasyon oranının uygulandığı varsayımıyla hızlı bir genel bakış sunar.
                <br>
                *   <strong>Kısıtlaması:</strong> Hisselerin farklı alış tarihlerini ve bu tarihlerden bugüne kadar geçen süre zarfındaki değişen aylık enflasyon dinamiklerini dikkate almaz. Tüm yatırımların aynı anda yapıldığı ve aynı enflasyon etkisine maruz kaldığı varsayılır ki bu gerçekçi değildir.
            </p>
            <p>
                *   <strong>Ağırlıklı Ortalama Reel Getiri (${portfolioSummary['Agirlikli Ortalama Reel Getiri Yuzdesi'].toFixed(2)}%):</strong> Bu daha detaylı yaklaşım, her bir hissenin kendi <strong>alış tarihinden güncel tarihe kadar geçen süre boyunca maruz kaldığı kümülatif aylık enflasyon oranlarını</strong> hesaplar. Ardından, her hissenin reel getirisi, portföydeki başlangıç yatırım ağırlığına göre ağırlıklandırılarak toplam portföyün ağırlıklı ortalama reel getirisi elde edilir.
                <br>
                *   <strong>Neden Daha Doğru?</strong> Bu yöntem, yatırımların zaman içindeki değerini daha doğru yansıtır çünkü:
                    <ol>
                        <li>Her bir hisse senedinin piyasada tutulduğu gerçek zaman dilimini (alış tarihinden bugüne) göz önünde bulundurur.</li>
                        <li>Bu zaman dilimi boyunca yaşanan değişken aylık enflasyon oranlarının kümülatif etkisini hesaba katar. Böylece, daha eski yatırımların daha uzun süre enflasyona maruz kaldığı gerçeği ve enflasyonun dönemler arasındaki dalgalanmaları doğru bir şekilde yansıtılır.</li>
                        <li>Her hissenin portföydeki göreceli büyüklüğünü (yatırım ağırlığını) dahil ederek, büyük yatırımların genel reel getiri üzerindeki etkisini doğru bir şekilde temsil eder.</li>
                    </ol>
            </p>
            <p>
                <strong>Sonuç:</strong> Ağırlıklı ortalama reel getiri, her hissenin bireysel tutulma sürelerini ve bu süre zarfındaki gerçek enflasyon etkisini hesaba kattığı için, portföyün enflasyona karşı gerçek performansını ve yatırımcının alım gücündeki değişimi çok daha doğru ve gerçeğe yakın bir şekilde gösterir. Basitleştirilmiş yaklaşım genel bir fikir verirken, detaylı analiz için ağırlıklı ortalama reel getiri tercih edilmelidir.
            </p>

            <h3>Alış Tarihi ve Enflasyonun Reel Getiriye Etkisi:</h3>
            <p>Hisselerin <strong>alış tarihleri</strong>, yatırımların enflasyona maruz kalma süresini ve dolayısıyla kümülatif enflasyon faktörünü doğrudan etkilemektedir. Enflasyonun yüksek olduğu dönemlerde uzun süre elde tutulan hisselerde, nominal getiri yüksek olsa dahi, reel getiri önemli ölçüde eriyebilir.</p>

            <p>
                *   <strong>Enflasyonun Reel Getiriyi Düşürdüğü Örnekler:</strong>
                    <ul>
                        <li><strong>ASELS (Nominal: ${aselsData ? aselsData['Nominal Getiri'].toFixed(2) : 'N/A'}%, Reel: ${aselsData ? aselsData['Reel Getiri Yüzdesi'].toFixed(2) : 'N/A'}%):</strong> Yüksek nominal getiriye rağmen, alış tarihi (${aselsData ? new Date(aselsData['Alış Tarihi']).toISOString().slice(0, 10) : 'N/A'}) itibarıyla bir yıla yakın bir süredir elde tutulduğu ve bu süreçteki kümülatif enflasyon (%${aselsInflation}%) nedeniyle reel getirisi nominalin altında kalmıştır. Yine de reel bazda en iyi performans gösteren hisse olmuştur.</li>
                        <li><strong>TUPRS (Nominal: ${tuprsData ? tuprsData['Nominal Getiri'].toFixed(2) : 'N/A'}%, Reel: ${tuprsData ? tuprsData['Reel Getiri Yüzdesi'].toFixed(2) : 'N/A'}%):</strong> Nispeten erken bir alış tarihi (${tuprsData ? new Date(tuprsData['Alış Tarihi']).toISOString().slice(0, 10) : 'N/A'}) ve bu tarihten itibaren bir yıldan fazla süren yüksek kümülatif enflasyon (%${tuprsInflation}%) etkisiyle nominal getirisi önemli ölçüde aşınmıştır.</li>
                        <li><strong>METRO (Nominal: ${metroData ? metroData['Nominal Getiri'].toFixed(2) : 'N/A'}%, Reel: ${metroData ? metroData['Reel Getiri Yüzdesi'].toFixed(2) : 'N/A'}%):</strong> Benzer şekilde, erken alış tarihi (${metroData ? new Date(metroData['Alış Tarihi']).toISOString().slice(0, 10) : 'N/A'}) ve yüksek kümülatif enflasyon (%${metroInflation}%) nedeniyle nominal getirisi reel bazda yarı yarıya azalmıştır.</li>
                    </ul>
            </p>

            <p>
                *   <strong>Reel ve Nominal Getirisi Yakın Olanlar:</strong>
                    <ul>
                        <li><strong>TOASO (Nominal: ${toasoData ? toasoData['Nominal Getiri'].toFixed(2) : 'N/A'}%, Reel: ${toasoData ? toasoData['Reel Getiri Yüzdesi'].toFixed(2) : 'N/A'}%):</strong> Alış tarihi (${toasoData ? new Date(toasoData['Alış Tarihi']).toISOString().slice(0, 10) : 'N/A'}) en güncel enflasyon verisine (2026-01) çok yakın olduğu için kümülatif enflasyon faktörü 1.0 olarak hesaplanmıştır. Bu nedenle nominal ve reel getirisi neredeyse aynı kalmıştır.</li>
                        <li><strong>GARAN (Nominal: ${garanData ? garanData['Nominal Getiri'].toFixed(2) : 'N/A'}%, Reel: ${garanData ? garanData['Reel Getiri Yüzdesi'].toFixed(2) : 'N/A'}%):</strong> TOASO ile benzer şekilde, alış tarihi (${garanData ? new Date(garanData['Alış Tarihi']).toISOString().slice(0, 10) : 'N/A'}) nedeniyle kümülatif enflasyon faktörü 1.0 olarak hesaplanmıştır, bu da nominal ve reel getirinin aynı kalmasına neden olmuştur.</li>
                    </ul>
            </p>
            <p>Bu durum, <strong>yatırımın ne zaman yapıldığının ve ne kadar süre elde tutulduğunun, özellikle yüksek enflasyonlu ekonomilerde, bir yatırımın gerçek değerini belirlemede kritik bir rol oynadığını</strong> göstermektedir. Geçmiş dönemdeki yüksek enflasyon oranları, bazı hisselerin nominal olarak iyi görünse de, alım gücü açısından daha az kazanç sağladığını ortaya koymaktadır.</p>

            <h3>Temel Bulgular ve Yatırım Perspektifini Değiştiren Etkiler:</h3>
            <p>
                *   <strong>Enflasyonun Aşındırıcı Etkisi Gözle Görülüyor:</strong> Daha önceki basitleştirilmiş reel getiri analizi, portföyün genel olarak enflasyon karşısında değer kaybettiğini göstermişti (${portfolioSummary['Basitlestirilmis Genel Reel Getiri Yuzdesi'].toFixed(2)}%). Ancak ağırlıklı ortalama reel getiri (${portfolioSummary['Agirlikli Ortalama Reel Getiri Yuzdesi'].toFixed(2)}%), portföyün enflasyon üzerinde pozitif bir reel getiri sağladığını ortaya koymaktadır. Bu fark, hisselerin farklı alım zamanlarına ve bu zamanlar boyunca yaşanan farklı enflasyon dinamiklerine özel olarak bakıldığında, bazı yatırımların enflasyona karşı daha dirençli olduğunu göstermektedir.
            </p>
            <p>
                *   <strong>Nominal Getiri Yanıltıcı Olabilir:</strong> ASELS, TUPRS ve METRO gibi hisselerin nominal getirileri oldukça yüksek görünse de, bu hisselerin daha eski alış tarihleri nedeniyle maruz kaldıkları yüksek kümülatif enflasyon, reel getirilerini önemli ölçüde düşürmüştür. Bu durum, sadece nominal getirilere odaklanmanın, yatırımcının gerçek alım gücü artışı hakkında yanıltıcı bir tablo sunabileceğini göstermektedir.
            </p>
            <p>
                *   <strong>Alış Zamanlamasının Önemi:</strong> Enflasyon verilerine yakın tarihlerde alınan TOASO ve GARAN gibi hisselerin reel getirileri nominal getirilerine çok yakın çıkmıştır. Bu, yatırımların enflasyonun yoğun olduğu dönemlerden uzak, daha kısa süre önce yapılması durumunda, enflasyonun reel getiri üzerindeki aşındırıcı etkisinin daha az olacağını göstermektedir.
            </p>
            <p>
                *   <strong>Portföy Yönetiminde Yeni Bir Boyut:</strong> Detaylı reel getiri analizi, portföy yönetiminde sadece nominal kâr/zarar değil, aynı zamanda enflasyonun etkisini de göz önünde bulundurarak daha bilinçli kararlar alınması gerektiğini vurgulamaktadır. Enflasyon koruması sağlayan veya reel bazda getiri potansiyeli yüksek olan varlıklara yönelmek, yatırımcının uzun vadeli alım gücünü koruması için kritik öneme sahiptir.
            </p>
            <p><strong>Genel Sonuç:</strong> Bu detaylı analiz, portföyün nominalde kârlı görünse de, enflasyonla mücadelede daha karmaşık bir tablo çizdiğini göstermiştir. Yatırım kararlarında, hisselerin alış tarihlerine özel enflasyon etkilerini dikkate almak, gerçek performansı değerlendirmek ve gelecekteki stratejileri belirlemek açısından hayati bir öneme sahiptir.</n></p>
        `;
        realReturnAnalysisDiv.innerHTML = analysisHTML;
    };
        const getStockData = (name) => portfolioData.find((item) => item['Hisse'] === name);

        container.innerHTML = '';

    // Fetch portfolio data
    fetch('portfolio_data.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            portfolioData = data;
            console.log("Portfolio data loaded.");
            populateStockPerformance(); // Populate stock performance table once data is loaded
        })
        .catch(error => {
            console.error("Error fetching portfolio_data.json:", error);
            const stockPerformanceDiv = document.getElementById('stock-performance');
            if (stockPerformanceDiv) stockPerformanceDiv.innerHTML = '<p class="error">Hisse performansı verileri yüklenirken hata oluştu.</p>';
        });
        const heading = document.createElement('h3');
        heading.textContent = 'Detaylı Reel Getiri Analizi';

    // Fetch portfolio summary
    fetch('portfolio_summary.json')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            portfolioSummary = data;
            console.log("Portfolio summary loaded.");
            populatePortfolioSummary(); // Populate summary section
            // Note: populateRealReturnAnalysis needs both portfolioData and portfolioSummary
        })
        .catch(error => {
            console.error("Error fetching portfolio_summary.json:", error);
            const portfolioSummaryDiv = document.getElementById('portfolio-summary');
            if (portfolioSummaryDiv) portfolioSummaryDiv.innerHTML = '<p class="error">Portföy özet verileri yüklenirken hata oluştu.</p>';
        const p1 = createInfoRow('Basitleştirilmiş Genel Reel Getiri', formatPercent(portfolioSummary['Basitlestirilmis Genel Reel Getiri Yuzdesi']));
        const p2 = createInfoRow('Ağırlıklı Ortalama Reel Getiri', formatPercent(portfolioSummary['Agirlikli Ortalama Reel Getiri Yuzdesi']));

        const subHeading = document.createElement('h3');
        subHeading.textContent = 'Örnek Hisselerde Enflasyon Etkisi';

        const list = document.createElement('ul');
        ['ASELS', 'TUPRS', 'METRO', 'TOASO', 'GARAN'].forEach((symbol) => {
            list.appendChild(createStockBullet(symbol, getStockData(symbol)));
        });

    // Use Promise.all to ensure both portfolioData and portfolioSummary are loaded before populating real return analysis
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
        fetch('portfolio_data.json').then(res => {
        fetch('portfolio_data.json').then((res) => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        }),
        fetch('portfolio_summary.json').then(res => {
        fetch('portfolio_summary.json').then((res) => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
    ])
    .then(([pData, pSummary]) => {
        portfolioData = pData;
        portfolioSummary = pSummary;
        console.log("Both portfolio data and summary loaded for real return analysis.");
        populateRealReturnAnalysis();
    })
    .catch(error => {
        console.error("Error fetching one or both JSON files for real return analysis:", error);
        const realReturnAnalysisDiv = document.getElementById('real-return-analysis');
        if (realReturnAnalysisDiv) realReturnAnalysisDiv.innerHTML = '<p class="error">Reel getiri analizi verileri yüklenirken hata oluştu.</p>';
    });

    // Load benchmark chart
    const benchmarkChartImg = document.getElementById('benchmark-chart');
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
        console.log("Benchmark grafiği yüklendi.");
    } else {
        console.warn("ID 'benchmark-chart' ile img etiketi bulunamadı.");
        benchmarkChartImg.onerror = () => {
            benchmarkChartImg.classList.add('hidden');
            if (benchmarkMessage) {
                benchmarkMessage.textContent = 'Benchmark grafiği bulunamadı.';
                benchmarkMessage.classList.remove('hidden');
            }
        };
    }
});
