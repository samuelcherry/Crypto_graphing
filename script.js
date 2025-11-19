const priceEl = document.getElementById("price");
const lastFiftyElement = document.getElementById("priceArray");
const highest = document.getElementById("highest");
const lowest = document.getElementById("lowest");
const avgPercent = document.getElementById("avgPercent");

// Binance BTCUSDT Trade Stream
const socket = new WebSocket("wss://data-stream.binance.com/ws/btcusdt@trade");

let lastFifty = [];
let lastFiftyAvg = 0;

let currentMinutePrices = [];
let minuteAverages = [];

socket.onopen = () => {
  console.log("Connected to Binance WebSocket!");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  const price = parseFloat(data.p);
  currentMinutePrices.push(price);

  priceEl.textContent = "$" + price;

  if (lastFifty.length >= 50) {
    lastFifty.shift();
  }
  lastFifty.push(parseFloat(data.p));

  let highestNumber = Math.max(...lastFifty);
  let lowestNumber = Math.min(...lastFifty);
  let avg = minuteAverages[minuteAverages.length - 1];

  let newHighest = highestNumber - lowestNumber;
  let newAvg = avg - lowestNumber;
  let avgDec = newAvg / newHighest;
  let avgPer = avgDec;

  highest.textContent = highestNumber;
  lowest.textContent = lowestNumber;
  avgPercent.textContent = minuteAverages.length ? avgPer : "0";
};

socket.onerror = (err) => {
  console.error("WebSocket Error:", err);
};

setInterval(() => {
  if (currentMinutePrices.length === 0) return;

  const sum = currentMinutePrices.reduce((a, b) => a + b, 0);
  const avg = sum / currentMinutePrices.length;

  minuteAverages.push(avg);

  currentMinutePrices = [];
  console.log("New 1-minute average:", avg);
}, 60000);
