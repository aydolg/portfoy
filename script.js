// script.js

document.addEventListener('DOMContentLoaded', () => {
    console.log("HTML içeriği yüklendi, JavaScript çalışıyor...");

    // 1. JSON verisini çekme
    fetch('portfolio_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(portfolioData => {
            console.log("Portföy verileri başarıyla yüklendi:", portfolioData);

            // 2. Portföy Özeti (portfolio-summary) div'ini dinamik olarak doldurma
            const portfolioSummaryDiv = document.getElementById('portfolio-summary');
            if (portfolioSummaryDiv) {
                // 'portfolio_data.json' içindeki hisse bazındaki verilerden toplam değerleri hesapla
                let totalInvestment = 0;
                let totalCurrentValue = 0;
                portfolioData.forEach(item => {
                    totalInvestment += item['Yatırım Miktarı'];
                    totalCurrentValue += item['Güncel Değer'];
                });
                const totalProfitLoss = totalCurrentValue - totalInvestment;
                const totalReturnPercentage = (totalInvestment !== 0) ? (totalProfitLoss / totalInvestment) * 100 : 0;

                portfolioSummaryDiv.innerHTML = `
                    <h3>Portföy Özeti</h3>
                    <p><strong>Toplam Yatırım Miktarı:</strong> ${totalInvestment.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
                    <p><strong>Toplam Güncel Değer:</strong> ${totalCurrentValue.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
                    <p><strong>Toplam Kâr/Zarar:</strong> ${totalProfitLoss.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</p>
                    <p><strong>Toplam Getiri Yüzdesi:</strong> ${totalReturnPercentage.toFixed(2)}%</p>
                    <p class="note"><em>Not: Bu özet verileri, mevcut hisse detaylarından türetilmiştir. Benchmark ve ağırlıklı reel getiri gibi genel özetler ayrı bir JSON dosyasında dışa aktarılmadığından burada gösterilememektedir.</em></p>
                `;
            } else {
                console.warn("ID 'portfolio-summary' ile div etiketi bulunamadı.");
            }

            // 3. Hisse Performansı Tablosu (stock-performance) div'ini dinamik olarak doldurma
            const stockPerformanceDiv = document.getElementById('stock-performance');
            if (stockPerformanceDiv) {
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
                                <td style="padding: 8px;">${item['Alış Fiyatı'].toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                                <td style="padding: 8px;">${item['Güncel Fiyat'].toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                                <td style="padding: 8px;">${item['Yatırım Miktarı'].toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                                <td style="padding: 8px;">${item['Güncel Değer'].toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                                <td style="padding: 8px;">${item['Kâr/Zarar'].toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</td>
                                <td style="padding: 8px;">${item['Nominal Getiri'].toFixed(2)}%</td>
                                <td style="padding: 8px;">${item['Reel Getiri Yüzdesi'].toFixed(2)}%</td>
                            </tr>
                    `;
                });
                tableHTML += `
                        </tbody>
                    </table>
                `;
                stockPerformanceDiv.innerHTML = tableHTML;
            } else {
                console.warn("ID 'stock-performance' ile div etiketi bulunamadı.");
            }

            // 4. Reel Getiri Analizi (real-return-analysis) div'ini doldurma
            const realReturnAnalysisDiv = document.getElementById('real-return-analysis');
            if (realReturnAnalysisDiv) {
                // Not: Ağırlıklı ortalama reel getiri ve basitleştirilmiş genel reel getiri gibi özetler
                // 'portfolio_data.json' dosyasında bulunmamaktadır. Bu veriler ayrı bir JSON olarak dışa aktarılmadığı sürece
                // burada dinamik olarak gösterilemez.
                realReturnAnalysisDiv.innerHTML = `
                    <h3>Detaylı Reel Getiri Analizi</h3>
                    <p><em>Önceki Python çıktılarındaki basitleştirilmiş genel reel getiri, ağırlıklı ortalama reel getiri ve hisse bazında detaylı reel getiri yorumları, 'portfolio_data.json' dosyasında bulunmadığı için burada dinamik olarak yüklenememektedir. Bu verilerin gösterimi için Python analizi sırasında bu özetlerin ayrı bir JSON dosyasına kaydedilmesi gerekmektedir.</em></p>
                `;
            } else {
                console.warn("ID 'real-return-analysis' ile div etiketi bulunamadı.");
            }

        })
        .catch(error => {
            console.error("JSON verileri çekilirken bir hata oluştu:", error);
            const portfolioSummaryDiv = document.getElementById('portfolio-summary');
            if (portfolioSummaryDiv) portfolioSummaryDiv.innerHTML = '<p class="error">Portföy verileri yüklenirken hata oluştu.</p>';
            const stockPerformanceDiv = document.getElementById('stock-performance');
            if (stockPerformanceDiv) stockPerformanceDiv.innerHTML = '<p class="error">Hisse performansı verileri yüklenirken hata oluştu.</p>';
            const realReturnAnalysisDiv = document.getElementById('real-return-analysis');
            if (realReturnAnalysisDiv) realReturnAnalysisDiv.innerHTML = '<p class="error">Reel getiri analizi verileri yüklenirken hata oluştu.</p>';
        });

    // 5. Benchmark karşılaştırma grafiğini yükleme
    const benchmarkChartImg = document.getElementById('benchmark-chart');
    if (benchmarkChartImg) {
        benchmarkChartImg.src = 'benchmark_comparison.png';
        benchmarkChartImg.alt = 'Portföy ve Benchmark Getirileri Karşılaştırması';
        console.log("Benchmark grafiği yüklendi.");
    } else {
        console.warn("ID 'benchmark-chart' ile img etiketi bulunamadı.");
    }
});
