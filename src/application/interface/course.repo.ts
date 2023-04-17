export abstract class CourseRepo {
  abstract getAutoSkipIsEnabled: (id: string) => Promise<boolean>;
  abstract setAutoSkipIsEnabled: (
    id: string,
    isEnabled: boolean
  ) => Promise<void>;

  abstract getVideoSpeed: (id: string) => Promise<number>;
  abstract setVideoSpeed: (id: string, speed: number) => Promise<void>;
}
