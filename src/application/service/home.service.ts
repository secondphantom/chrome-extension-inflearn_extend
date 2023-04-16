export class HomeService {
  static instance: HomeService | undefined;

  constructor() {}

  static getInstance = () => {
    if (this.instance) return this.instance;
    this.instance = new HomeService();
    return this.instance;
  };

  searchMyCourse = (input: string) => {
    if (input.length === 0) return;
    const urlDecoded = encodeURI(
      `https://www.inflearn.com/my-courses?s=${input}`
    );
    window.location.href = urlDecoded;
  };
}
