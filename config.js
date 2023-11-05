let n = 3;
let size;
if (window.innerWidth < 768) {
  size = 70;
} else {
  size = 90;
}
let grid = new Array(2 * n - 1);

let memoTime = 10;

let roundTime = 90;

document.documentElement.style.setProperty("--width", size + "px");

document.getElementById("timerTime").innerText = memoTime;
document.getElementById("memoTime").innerText = memoTime;
document.getElementById("roundTime").innerText = roundTime;
