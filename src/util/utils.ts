export class Utils {
  static getStorage = <T = any>(key: string): Promise<T | null> => {
    return new Promise((res) => {
      chrome.storage.sync.get([key], (obj) => {
        res(obj[key] ? JSON.parse(obj[key]) : null);
      });
    });
  };

  static setStorage = async (key: string, data: any) => {
    return chrome.storage.sync.set({
      [key]: JSON.stringify(data),
    });
  };
}

// export async function getActiveTabURL() {
//   const tabs = await chrome.tabs.query({
//     currentWindow: true,
//     active: true,
//   });

//   return tabs[0];
// }
