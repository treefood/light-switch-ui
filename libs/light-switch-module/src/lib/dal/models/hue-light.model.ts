import { ColorMode } from './hue-common.model';

export interface HueLight {
  state: LightState;
  type: string;
  name: string;
  modelid?: string;
  uniqueid?: string;
  manufacturername?: string;
  luminaireuniqueid?: string;
  streaming?: LightStreaming;
  config?: any;
  index?: number;
}

export interface LightState {
  on: boolean;
  bri: number;
  hue?: number;
  sat?: number;
  xy?: number[];
  ct?: number;
  alert: string;
  effect: string;
  colormode: ColorMode;
  reachable: boolean;
}

export interface LightStreaming {
  renderer: boolean;
  proxy: boolean;
}
