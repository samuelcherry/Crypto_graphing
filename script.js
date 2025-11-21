const priceEl = document.getElementById("price");
const lastFiftyElement = document.getElementById("priceArray");
const highest = document.getElementById("highest");
const lowest = document.getElementById("lowest");
const avgPercent = document.getElementById("avgPercent");
const chartTop = document.getElementById("chartTop");

// Binance BTCUSDT Trade Stream
const socket = new WebSocket("wss://data-stream.binance.com/ws/btcusdt@trade");

let lastFifty = [];
let lastFiftyAvg = 0;
let avg = 0;
let currentMinutePrices = [];
let minuteAverages = [];
let TopAverages = [];
let BottomAverages = [];

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

  highest.textContent = highestNumber;
  lowest.textContent = lowestNumber;
};

socket.onerror = (err) => {
  console.error("WebSocket Error:", err);
};

setInterval(() => {
  console.log("timer started");
  if (currentMinutePrices.length === 0) return;

  highestNumber = Math.max(...currentMinutePrices);
  lowestNumber = Math.min(...currentMinutePrices);

  const sum = currentMinutePrices.reduce((a, b) => a + b, 0);
  const avg = sum / currentMinutePrices.length;

  minuteAverages.push(avg);
  TopAverages.push(highestNumber);
  BottomAverages.push(lowestNumber);

  currentMinutePrices = [];
  console.log("New 1-minute average:", avg);

  if (avg) {
    console.log(avg);

    let range = highestNumber - lowestNumber;
    let newAvg = highestNumber - avg;

    let avgDec = newAvg / range;
    let avgPer = avgDec * 100;
    console.log("highest Number: ", highestNumber);
    console.log("lowest Number: ", lowestNumber);
    console.log("range: ", range);
    console.log("new avg: ", newAvg);
    console.log("avgDec: ", avgDec);
    console.log("avgPer: ", avgPer);
    avgPercent.textContent = minuteAverages.length ? avgPer : "0";
    chartTop.textContent = Math.max(TopAverages);
  }
}, 60000);

function init() {
  const canvas = document.getElementById("canvas");
  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");

    ctx.strokeStyle = "green";
    ctx.fillStyle = "green";

    ctx.fillRect(50, 50, 100, 100);
  }
}
