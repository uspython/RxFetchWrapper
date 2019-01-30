/*
 * CityHomeClient
 * @Author: jeffzhao
 * @Date: 2019-01-08 18:50:32
 * @Last Modified by: jeffzhao
 * @Last Modified time: 2019-01-29 18:00:36
 * Copyright  © 2019 Jeff Zhao. All rights reserved.
 * @format
 * @flow
 */
import * as _ from 'lodash';
import CHSETTINGS from '../settings/CHConsts';


/**
 * Http api url Construction
 * @param {string} url api's name, such as `room/order`
 */
export default function apiUrl(url: string) {
  // Remove `/` at prefix and add `/` to suffix if not contain `?` or
  // not have a `/`
  let component = '';
  const { apiDomain } = CHSETTINGS;
  // Reomve prefix `/`
  if (_.startsWith(url, '/')) { component = _.trimStart(url, '/'); }
  // Append `/`
  if (_.endsWith(url, '/') || url.indexOf('?') >= 0) {
    component = url;
  } else {
    component = `${url}/`;
  }
  return `${apiDomain}/${component}`;
}
