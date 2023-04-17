import { Utils } from "./util/utils";

export interface InflearnExtraConfig {
  "course-auto_skip": boolean;
  "course-video_speed": boolean;
  "home-search_my_course": boolean;
}

class PopUpController {
  static instance: PopUpController | undefined;
  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new PopUpController();
    return this.instance;
  };

  private config: { [key in string]: boolean } = {};

  private isInit = false;

  init = async () => {
    if (this.isInit) return;

    const localConfig = await Utils.getStorage("inflearn-extra-config");

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
    Utils.setStorage("inflearn-extra-config", this.config);
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
    Utils.setStorage("inflearn-extra-config", this.config);
  };
}

document.addEventListener("DOMContentLoaded", async () => {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });
  const activeTab = tabs[0];

  const popUpController = PopUpController.getInstance();
  popUpController.init();
});
