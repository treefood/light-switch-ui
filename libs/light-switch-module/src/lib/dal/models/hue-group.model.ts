import { ColorMode } from './hue-common.model';

export interface HueGroup {
  name: string;
  type: GroupType;
  lights: string[];
  sensors: string[];
  action: GroupAction;
  state: GroupState;
  presence?: any;
  lightleve?: any;
  recycle: boolean;
  class: string;
}

export interface GroupState {
  all_on: boolean;
  any_on: boolean;
}

export interface GroupAction {
  on: boolean;
  bri: number;
  hue: number;
  sat: number;
  effect: string;
  xy: number[];
  ct: number;
  alert: string;
  colormode: ColorMode;
}

export enum GroupType {
  LightGroup = 'LightGroup',
  Luminaire = 'Luminaire',
  LightSource = 'LightSource',
  Room = 'Room',
  Entertainment = 'Entertainment',
  Zone = 'Zone'
}
