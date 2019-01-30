/*
 * CityHomeClient
 * @Author: jeffzhao
 * @Date: 2019-01-11 16:00:29
 * @Last Modified by: jeffzhao
 * @Last Modified time: 2019-01-29 17:53:51
 * Copyright  © 2019 Jeff Zhao. All rights reserved.
 * @format
 * @flow
 */
export class APIError extends Error {
  errorCode: string;

  errorMessage: string;

  /**
   * APIError constructor
   * @param {String} code api error code
   * @param {String} message api error message
   */
  constructor(code: string | number, message: string) {
    super(`code: ${code}, message: ${message}`);
    this.errorCode = `${code}`;
    this.errorMessage = message;
  }

  get code() { return this.errorCode; }
}
/*
    case invalidToken = 10011
    case needRefreshToken = 10005
    case refreshTokenFailed = 10010
    case permissionDenied = 10004
 */
export const ERROR_CODE_ENUM = {
  TOKEN_EXPIRED: '10005',
  INVALID_TOKEN: '10011',
  PERMISSION_DENIED: '10004',
  REFRESH_TOKEN_FAILED: '10010',
};

export class VerificationError extends APIError {}
