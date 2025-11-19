const priceEl = document.getElementById("price");
const lastFiftyElement = document.getElementById("priceArray");

// Binance BTCUSDT Trade Stream
const socket = new WebSocket("wss://data-stream.binance.com/ws/btcusdt@trade");

let lastFifty = [];
let lastFiftyAvg = 0;

socket.onopen = () => {
  console.log("Connected to Binance WebSocket!");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  // price is in 'p'
  const price = parseFloat(data.p).toFixed(2);
  priceEl.textContent = "$" + price;

  if (lastFifty.length >= 50) {
    lastFifty.shift();
  }
  lastFifty.push(parseFloat(data.p));
  let sum = lastFifty.reduce((sum, num) => sum + num, 0);
  lastFiftyElement.textContent = sum / lastFifty.length;
};

socket.onerror = (err) => {
  console.error("WebSocket Error:", err);
};
