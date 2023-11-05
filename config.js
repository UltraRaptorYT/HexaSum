let n = 3;
let size;
if (window.innerWidth < 768) {
  size = 70;
} else {
  size = 90;
}
let grid = new Array(2 * n - 1);

let memoTime = 30;

let roundTime = 1000;

let minNum = 1;
let maxNum = 9;

document.documentElement.style.setProperty("--width", size + "px");

document.getElementById("timerTime").innerText = memoTime;
document.getElementById("memoTime").innerText = memoTime;
document.getElementById("roundTime").innerText = roundTime;

let memoTimeSetting = document.getElementById("memoTimeSetting");
memoTimeSetting.value = memoTime;
let roundTimeSetting = document.getElementById("roundTimeSetting");
roundTimeSetting.value = roundTime;
let minNumber = document.getElementById("minNumber");
minNumber.value = minNum;
let maxNumber = document.getElementById("maxNumber");
maxNumber.value = maxNum;

document.getElementById("closeSettingModal").addEventListener("click", () => {
  if (!GAME_STATE) {
    memoTime = memoTimeSetting.value;
    roundTime = roundTimeSetting.value;
    maxNum = maxNumber.value;
    minNum = minNumber.value;
  }
});
