import { ConfigRepo } from "./infrastructure/db/config.repo";

declare var RUN_ENV: string;
declare var RESTRICTED_MENU_ID_LIST: string[];

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
    this.disableRestrictedMenu();
    const localConfig =
      (await this.configRepo.getConfig()) as any as typeof this.config;

    const list = document.querySelectorAll("li");
    for (const ele of list) {
      const spanEle = ele.querySelector("span");
      if (spanEle) {
        const key = spanEle.getAttribute("data-i18n");
        spanEle!.innerText = chrome.i18n.getMessage(key!);
      }
      const inputEle = ele.querySelector("input")!;
      const id = inputEle.id;
      this.config[id] = localConfig === null ? true : localConfig[id];

      if (RESTRICTED_MENU_ID_LIST.includes(id)) {
        this.config[id] = false;
      }

      inputEle.checked = this.config[id];
      inputEle.addEventListener("click", () => {
        this.config[id] = !this.config[id];
        this.updateConfig();
      });
    }
    this.configRepo.setConfig(this.config);
  };

  private disableRestrictedMenu = () => {
    const sections = document.querySelectorAll("section");
    if (!sections) return;
    sections.forEach((sectionEle, index) => {
      const liList = sectionEle.querySelectorAll("li");

      let count = 0;

      liList.forEach((liEle, index) => {
        const input = liEle.querySelector("input");
        if (!input) return;
        const id = input.getAttribute("id");
        if (!id) return;
        if (RESTRICTED_MENU_ID_LIST.includes(id)) {
          liEle.style.display = "none";
          count++;
        }
        if (count === index + 1) {
          sectionEle.style.display = "none";
        }
      });
    });
    return;
  };

  private updateConfig = () => {
    const list = document.querySelectorAll(
      "li input"
    ) as any as HTMLInputElement[];
    for (const ele of list) {
      const id = ele.id;
      this.config[id] = ele.checked;
      if (RESTRICTED_MENU_ID_LIST.includes(id)) {
        this.config[id] = false;
      }
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
