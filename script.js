let lastPrice = 0;

// Fetch ETH price from Binance API
async function fetchETHPrice() {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
        const data = await response.json();
        const price = parseFloat(data.price);
        const priceElement = document.getElementById('live-price');
        
        // Check if the price is up or down
        let priceColorClass = '';
        if (lastPrice === 0) {
            lastPrice = price;
            priceColorClass = 'price-up'; // Initial color
        } else if (price > lastPrice) {
            priceColorClass = 'price-up'; // Price is up
        } else if (price < lastPrice) {
            priceColorClass = 'price-down'; // Price is down
        }

        // Update the price and color
        priceElement.innerHTML = `$${price.toFixed(2)}`;
        priceElement.className = `live-price ${priceColorClass}`;

        lastPrice = price; // Store the last price for comparison
    } catch (error) {
        console.error('Error fetching ETH price:', error);
    }
}

// Load TradingView Widget
function loadTradingViewWidget(timeframe = "D") {
    document.getElementById("tradingview-widget").innerHTML = ""; // Clear previous chart

    new TradingView.widget({
        "container_id": "tradingview-widget",
        "symbol": "BINANCE:ETHUSDT",
        "interval": timeframe,
        "theme": "dark",
        "style": "1",
        "timezone": "Etc/UTC",
        "allow_symbol_change": false,
        "width": "100%",
        "height": "500",
        "toolbar_bg": "#121212",
        "withdateranges": true,
        "hide_side_toolbar": false
    });
}

// When a user clicks on a timeframe box, load the correct chart
function loadChart(days) {
    let timeframe = "D"; // Default Daily
    if (days === "1") timeframe = "15";  // 15-minute Chart for 24H
    if (days === "7") timeframe = "60";  // 1-hour Chart for 7D
    if (days === "30") timeframe = "D";  // Daily Chart for 30D
    if (days === "365") timeframe = "W"; // Weekly Chart for 1Y
    if (days === "ALL") timeframe = "M"; // Monthly Chart for All-Time

    loadTradingViewWidget(timeframe);
}

// Load Default TradingView Chart on Page Load
setTimeout(() => loadTradingViewWidget(), 500);

// Fetch ETH Price every second
setInterval(fetchETHPrice, 1000);

// ============Animation=============

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        document.getElementById("splashScreen").style.display = "none";
        document.getElementById("mainContent").style.display = "block";
    }, 3500); // Matches the total animation time
});
