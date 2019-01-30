/*
 * CityHomeClient
 * @Author: jeffzhao
 * @Date: 2019-01-09 15:41:22
 * @Last Modified by: jeffzhao
 * @Last Modified time: 2019-01-29 18:51:14
 * Copyright  © 2019 Jeff Zhao. All rights reserved.
 * @format
 * @flow
 */

export type APIParamProps = {
  paramsObject: Object,
  verificationCallback: Function
}

export default class APIParam {
  paramsObject: Object;

  verificationCallback: Function;

  /**
   * API Request Params Construction
   * @param {Object} params Params for request
   * @param {Function} [verification] Params Verification Block
   */
  constructor(params: Object = {}, verification?: Function) {
    this.paramsObject = params;
    this.verificationCallback = verification;
  }

  get params() { return this.paramsObject; }

  get verification() { return this.verificationCallback; }
}
