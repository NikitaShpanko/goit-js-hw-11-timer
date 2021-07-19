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
  constructor(objParams) {
    const parent = document.querySelector(objParams.selector);
    for (const field of CountdownTimer.FIELDS) {
      const elem = parent.querySelector(`[data-value="${field}"]`);
      if (elem) this.#DOMelements[field] = elem;
    }
    this.#targetTime = objParams.targetDate.getTime();
    this.updateTimer();
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
    setTimeout(() => {
      this.updateTimer();
    }, 1000 - (nowTime % 1000));
  }
}

new CountdownTimer({
  selector: "#timer-1",
  targetDate: new Date("Sep 27, 2021"),
});