import CronParser from 'cron-parser';

export class DailyCount {
  constructor() {
    this.map = {};
    this.cron = CronParser.parseExpression('0 0 * * *');
    this.clearOnNextDay();
  }

  clearOnNextDay() {
    setTimeout(() => {
      this.map = {};
      this.clearOnNextDay();
    }, this.cron.next().getTime() - Date.now());
  }

  add(key) {
    if (!(key in this.map)) this.map[key] = 0;
    this.map[key]++;
  }

  sub(key) {
    if (this.map[key] > 0) this.map[key]--;
  }

  get(key) {
    return this.map[key] || 0;
  }
}
