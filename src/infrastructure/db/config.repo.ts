export interface InflearnExtraConfig {
  "course-auto_skip": boolean;
  "course-video_speed": boolean;
  "home-search_my_course": boolean;
}

export class ConfigRepo {
  static instance: ConfigRepo | undefined;

  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new ConfigRepo();
    return this.instance;
  };

  private getStorage = <T = any>(key: string): Promise<T | null> => {
    return new Promise((res) => {
      chrome.storage.sync.get([key], (obj) => {
        res(obj[key] ? JSON.parse(obj[key]) : null);
      });
    });
  };

  private setStorage = async (key: string, data: any) => {
    return chrome.storage.sync.set({
      [key]: JSON.stringify(data),
    });
  };

  getConfig = async () => {
    return this.getStorage<InflearnExtraConfig>("inflearn-extra-config");
  };

  setConfig = async (data: InflearnExtraConfig | any) => {
    await this.setStorage("inflearn-extra-config", data);
  };
}
