let investment = 0, buyPrice = 0, fee = 0, isSubmitted = false;

// Function to load data from localStorage
function loadSavedData() {
    if (localStorage.getItem("investment")) {
        investment = parseFloat(localStorage.getItem("investment"));
        buyPrice = parseFloat(localStorage.getItem("buyPrice"));
        fee = parseFloat(localStorage.getItem("fee"));
        isSubmitted = localStorage.getItem("isSubmitted") === "true";
        
        // Set the values in input fields
        document.getElementById("investment").value = investment;
        document.getElementById("buyPrice").value = buyPrice;
        document.getElementById("fee").value = fee;

        // If the form was previously submitted, show the results
        if (isSubmitted) {
            updateLivePrice(); // Update the live price and calculations
        }
    }
}

// Function to save data to localStorage
function saveData() {
    localStorage.setItem("investment", investment);
    localStorage.setItem("buyPrice", buyPrice);
    localStorage.setItem("fee", fee);
    localStorage.setItem("isSubmitted", isSubmitted);
}

async function getLiveETHPrice() {
    try {
        let response = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT");
        let data = await response.json();
        return parseFloat(data.price);
    } catch (error) {
        console.error("Error fetching ETH price:", error);
        return null;
    }
}

async function updateLivePrice() {
    let livePrice = await getLiveETHPrice();
    if (!livePrice) return;

    if (isSubmitted) {
        let profit = (investment / buyPrice) * livePrice - investment - fee;
        let total = investment + profit;

        // Update UI elements for Invested, Profit, and Total
        document.getElementById("investmentText").innerText = `$${investment.toFixed(0)}`;

        let profitElement = document.getElementById("profitAmount");
        let totalElement = document.getElementById("total");

        if (profit >= 0) {
            profitElement.innerText = `+${profit.toFixed(2)} Profit`;
            profitElement.style.color = "rgb(22, 238, 22)";
        } else {
            profitElement.innerText = `${profit.toFixed(2).replace("-", "")} Loss`;
            profitElement.style.color = "red";
        }

        totalElement.innerText = `= $${total.toFixed(0)}`;

        // Hide the 🔢 button and show the Edit button
        document.getElementById("profitCalculatorBtn").style.display = "none";
        document.getElementById("editButton").style.display = "inline-block";
    }
}

function submitForm() {
    investment = parseFloat(document.getElementById("investment").value);
    buyPrice = parseFloat(document.getElementById("buyPrice").value);
    fee = parseFloat(document.getElementById("fee").value);

    // Mark the form as submitted
    isSubmitted = true;
    saveData();  // Save data to localStorage
    closePopup();
    updateLivePrice();
}

function openPopup() {
    document.getElementById("profitPopup").style.display = "block";
}

function closePopup() {
    document.getElementById("profitPopup").style.display = "none";
}

// Load saved data when the page is loaded
window.onload = loadSavedData;

// Update live price every second
setInterval(updateLivePrice, 1000);
