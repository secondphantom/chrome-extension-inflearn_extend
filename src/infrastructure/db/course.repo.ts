import { CourseRepo } from "../../application/interface/course.repo";

export class CourseChromeStorageSyncRepo extends CourseRepo {
  static instance: CourseChromeStorageSyncRepo | undefined;

  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new CourseChromeStorageSyncRepo();
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

  getAutoSkipIsEnabled = async (id: string) => {
    let isEnabledAutoSkip = await this.getStorage<boolean>(id);
    if (isEnabledAutoSkip === null) {
      this.setAutoSkipIsEnabled(id, false);
      isEnabledAutoSkip = false;
    }
    return isEnabledAutoSkip;
  };

  setAutoSkipIsEnabled = async (id: string, isEnabled: boolean) => {
    await this.setStorage(id, isEnabled);
  };

  getVideoSpeed = async (id: string) => {
    let videoSpeed = await this.getStorage<number>(id);

    if (videoSpeed === null) {
      this.setVideoSpeed(id, 1);
      videoSpeed = 1;
    }
    return videoSpeed;
  };

  setVideoSpeed = async (id: string, speed: number) => {
    await this.setStorage(id, speed);
  };
}
