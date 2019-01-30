/*
 * CityHomeClient
 * @Author: jeffzhao
 * @Date: 2019-01-09 12:01:49
 * @Last Modified by: jeffzhao
 * @Last Modified time: 2019-01-14 14:11:13
 * Copyright  © 2019 Jeff Zhao. All rights reserved.
 * @format
 * @flow
 */
import { NativeModules } from 'react-native';

const {
  apiDomain,
  webDomain,
  assetsDomain,
  wechatAppID,
  wechatAppSecret,
  buglyAppID,
  aMapAppID,
} = NativeModules.CHSettings;

const CHSETTINGS = {
  apiDomain,
  webDomain,
  assetsDomain,
  wechatAppID,
  wechatAppSecret,
  buglyAppID,
  aMapAppID,
};
export default CHSETTINGS;
export const HOUR = 1000 * 3600;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = WEEK * 4;
export const YEAR = MONTH * 12;
