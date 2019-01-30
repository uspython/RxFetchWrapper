/* eslint-disable no-undef */
/*
 * CityHomeClient
 * @Author: jeffzhao
 * @Date: 2019-01-05 20:25:05
 * @Last Modified by: jeffzhao
 * @Last Modified time: 2019-01-29 18:08:57
 * Copyright  © 2019 Jeff Zhao. All rights reserved.
 * @format
 * @flow
 */

import DeviceInfo from 'react-native-device-info';
import * as _ from 'lodash';
import { name as appName } from '../../app.json';
import { getCHToken, getCHCurrentUser } from '../settings/CHGlobal';

export type HeaderConfigProps = {
  method: string,
  url: string,
};

/**
 * Request Header Contruction
 * @param {HeaderConfigProps} [config] Http header config object
 * @returns Header() Object
 */
export default function cityHomeHeader(config?: HeaderConfigProps) {
  const baseConfig = {
    Accept: 'application/json',
    UserAgent: `${appName}/${DeviceInfo.getVersion()}/${DeviceInfo.getDeviceLocale()} \
    (${DeviceInfo.getDeviceId()}; ${DeviceInfo.getSystemName()})${DeviceInfo.getSystemVersion()}; \
    ${DeviceInfo.getDeviceLocale()} ${DeviceInfo.getDeviceCountry()}`,
    AcceptEncoding: 'gzip;q=1.0, compress;q=0.5',
    AcceptLanguage: `${DeviceInfo.getDeviceLocale()};q=1`,
  };

  const headers = new Headers();
  headers.set('Accept', baseConfig.Accept);
  headers.set('User-Agent', baseConfig.UserAgent);
  headers.set('Accept-Encoding', baseConfig.AcceptEncoding);
  headers.set('Accept-Language', baseConfig.AcceptLanguage);
  headers.set('Connecttion', 'keep-alive');
  // POST and DELETE method using formdata
  if (config?.method !== 'GET') {
    headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
  }
  // 登录和更新token不需要Authorization
  if (config?.url === 'accounts/login'
  || config?.url === 'accounts/api_token_refresh') {
    headers.delete('Authorization');
  }
  // Add Authorization Token
  if (!_.isEmpty(getCHCurrentUser())) {
    headers.set('Authorization', `Bearer ${getCHToken()}`);
  }

  return headers;
}
