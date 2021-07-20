// const SESSION_TEXT = "dateText";
//const LOCAL_LIVE = "liveRefresh";

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
// if (!defaultText) defaultText = sessionStorage.getItem(SESSION_TEXT);
if (!defaultText) defaultText = `Jan 1, ${new Date().getFullYear() + 1}`;

const timer = new CountdownTimer({
  selector: "#timer-1",
  targetDate: new Date(defaultText),

  logTargetDate: (date) => {
    remark.textContent = `Until ${date}`;
  },
});

//const liveRefresh = document.querySelector("#live-refresh");
//liveRefresh.checked = localStorage.getItem(LOCAL_LIVE) === "true";

// liveRefresh.addEventListener("change", () => {
//   refreshText();
//   localStorage.setItem(LOCAL_LIVE, liveRefresh.checked);
// });

const form = document.querySelector("form");
form.addEventListener("submit", (e) => {
  if (!isDateText(input.value)) e.preventDefault();
  if (input.value === "") window.location = window.location.origin;
});

const submit = form.querySelector('[type="submit"]');

const input = form.querySelector("#date-input");
input.value = defaultText;
input.focus();
checkText(); // will catch invalid input from the search string
input.addEventListener("input", checkText);

function isDateText(text) {
  return !isNaN(new Date(text).getTime());
}

function checkText() {
  if (isDateText(input.value) || input.value.length === 0) {
    submit.removeAttribute("disabled");
    input.classList.remove("invalid");
    if (input.value !== defaultText && input.value.length) {
      input.classList.add("valid");
    } else {
      input.classList.remove("valid");
    }
  } else {
    submit.setAttribute("disabled", "");
    input.classList.add("invalid");
    input.classList.remove("valid");
  }
}
