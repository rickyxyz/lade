export type DeviceScreenType = "desktop" | "tablet" | "mobile";

export type LayoutContextType = {
  device: DeviceScreenType;
  width: number;
  height: number;
};
