import { compare } from 'compare-versions';

class BotClientInfo {
  constructor() {
    this.info = {
      name: '',
      version: '',
    };
    this.supportUseFileDirectlyInCQImg = true;
  }

  get isNapCat() {
    return this.info.name.startsWith('NapCat');
  }

  /**
   * @param {{ name: string; version: string }} info
   */
  setInfo(info) {
    this.info = info;
    this.updateComputed();
  }

  /** @private */
  updateComputed() {
    this.supportUseFileDirectlyInCQImg = !(this.isNapCat && compare(this.info.version, '4.3.6', '<'));
  }
}

export const botClientInfo = new BotClientInfo();
