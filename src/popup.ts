import { ConfigRepo } from "./infrastructure/db/config.repo";

class PopUpController {
  static instance: PopUpController | undefined;

  constructor(private configRepo: ConfigRepo) {}

  static getInstance = (configRepo: ConfigRepo) => {
    if (this.instance) return this.instance;
    this.instance = new PopUpController(configRepo);
    return this.instance;
  };

  private config: { [key in string]: boolean } = {};

  private isInit = false;

  init = async () => {
    if (this.isInit) return;

    const localConfig =
      (await this.configRepo.getConfig()) as any as typeof this.config;

    const list = document.querySelectorAll(
      "li input"
    ) as any as HTMLInputElement[];
    for (const ele of list) {
      const id = ele.id;
      this.config[id] = localConfig === null ? true : localConfig[id];
      ele.checked = this.config[id];
      ele.addEventListener("click", () => {
        this.config[id] = !this.config[id];
        this.updateConfig();
      });
    }
    this.configRepo.setConfig(this.config);
  };

  private updateConfig = () => {
    const list = document.querySelectorAll(
      "li input"
    ) as any as HTMLInputElement[];
    for (const ele of list) {
      const id = ele.id;
      this.config[id] = ele.checked;
      ele.checked = this.config[id];
    }
    this.configRepo.setConfig(this.config);
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });
  const activeTab = tabs[0];

  const popUpController = PopUpController.getInstance(ConfigRepo.getInstance());
  popUpController.init();
});
