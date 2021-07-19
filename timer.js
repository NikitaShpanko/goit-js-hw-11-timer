const SESSION_TEXT = "dateText";
const LOCAL_LIVE = "liveRefresh";

class CountdownTimer {
  static FORMULAS = {
    days: (timeSec) => Math.floor(timeSec / (60 * 60 * 24)),
    hours: (timeSec) => Math.floor((timeSec % (60 * 60 * 24)) / (60 * 60)),
    mins: (timeSec) => Math.floor((timeSec % (60 * 60)) / 60),
    secs: (timeSec) => timeSec % 60,
  };
  static FIELDS = Object.keys(CountdownTimer.FORMULAS);
  #DOMelements = {};
  #targetTime;
  #timer = 0;
  #logTargetDate;
  constructor(objParams) {
    const parent = document.querySelector(objParams.selector);
    for (const field of CountdownTimer.FIELDS) {
      const elem = parent.querySelector(`[data-value="${field}"]`);
      if (elem) this.#DOMelements[field] = elem;
    }
    this.#logTargetDate = objParams.logTargetDate;
    this.date = objParams.targetDate;
  }

  updateTimer() {
    const nowTime = Date.now();
    for (const [key, el] of Object.entries(this.#DOMelements)) {
      el.textContent = CountdownTimer.FORMULAS[key](
        Math.round((this.#targetTime - nowTime) / 1000)
      );
    }
    //console.log(nowTime % 1000);
    //console.log(this.#targetTime - nowTime);
    this.#timer = setTimeout(() => {
      this.updateTimer();
    }, 1000 - (nowTime % 1000));
  }

  set date(newDate) {
    if (newDate && newDate instanceof Date && !isNaN(newDate.getTime())) {
      this.#targetTime = newDate.getTime();
      if (typeof this.#logTargetDate === "function")
        this.#logTargetDate(newDate);
      if (this.#timer) clearTimeout(this.#timer);
      this.updateTimer();
    }
  }

  get date() {
    return new Date(this.#targetTime);
  }
}

const remark = document.querySelector(".remarks");

let defaultText = new URL(window.location).searchParams.get("date");
if (!defaultText) defaultText = sessionStorage.getItem(SESSION_TEXT);
if (!defaultText) defaultText = `Jan 1, ${new Date().getFullYear() + 1}`;

const input = document.querySelector("#date-input");
input.value = defaultText;
input.focus();

const timer = new CountdownTimer({
  selector: "#timer-1",
  targetDate: new Date(defaultText),

  logTargetDate: (date) => {
    remark.textContent = `Until ${date}`;
  },
});

const liveRefresh = document.querySelector("#live-refresh");
liveRefresh.checked = localStorage.getItem(LOCAL_LIVE) === "true";

liveRefresh.addEventListener("change", () => {
  refreshText();
  localStorage.setItem(LOCAL_LIVE, liveRefresh.checked);
});

input.addEventListener("input", () => {
  refreshText();
  sessionStorage.setItem(SESSION_TEXT, input.value);
});

function refreshText() {
  if (liveRefresh.checked) timer.date = new Date(input.value);
}
