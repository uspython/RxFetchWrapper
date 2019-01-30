/* eslint-disable no-undef */
/*
 * CityHomeClient
 * @Author: jeffzhao
 * @Date: 2019-01-04 16:25:52
 * @Last Modified by: jeffzhao
 * @Last Modified time: 2019-01-30 11:44:06
 * Copyright  © 2019 Jeff Zhao. All rights reserved.
 * @format
 * @flow
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import { RequestInit, Response } from 'isomorphic-fetch';
import { Observable, throwError } from 'rxjs';
import {
  retryWhen, concatMap, tap, finalize, flatMap,
} from 'rxjs/operators';
import * as _ from 'lodash';
import queryString from 'query-string';
import cityHomeHeader from './CityHomeHeader';
import {
  APIError as _APIError,
  VerificationError as _VerificationError,
  ERROR_CODE_ENUM,
} from './Errors';
import apiUrl from './APIUrl';
import APIParam, { type APIParamProps } from './APIParam';
import { getCHDidLogout } from '../settings/CHGlobal';
import { fetch as fetchStorage, save as saveStorage } from '../services/CHStorage';

// Enum for http method
const MethodEnum = {
  GET: 'GET',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class APIRouter {
  static get(url: string, apiParam?: APIParamProps) {
    return APIRouter.connect(url, MethodEnum.GET, apiParam);
  }

  static post(url: string, apiParam?: APIParamProps) {
    return APIRouter.connect(url, MethodEnum.POST, apiParam);
  }

  static delete(url: string, apiParam?: APIParamProps) {
    return APIRouter.connect(url, MethodEnum.DELETE, apiParam);
  }

  /**
   * Request Construction
   * @param {apiUrl} url Request Url
   * @param {String} method Http Method
   * @param {APIParam} [apiParam] APIParam Object
   * @returns static Request Object
   */
  static apiRequest(url: string, method: string, apiParam: APIParamProps) {
    const { paramsObject } = apiParam;
    const headers = cityHomeHeader({ url, method, paramsObject });
    let requestUrl = apiUrl(url);
    const init: RequestInit = {
      method,
      headers,
      mode: 'cros',
      credentials: 'include',
    };
    switch (method) {
      case MethodEnum.POST:
        init.body = _.escape(queryString.stringify(paramsObject));
        break;
      default:
        requestUrl = paramsObject
          ? `${requestUrl}?${_.escape(queryString.stringify(paramsObject))}`
          : requestUrl;
        break;
    }
    const request = new Request(requestUrl, init);
    return request;
  }

  /**
   * Fetch method base
   * @param {apiUrl} url An apiUrl object for request
   * @param {String} method Http method
   * @param {APIParam} apiParam An APIParam object for request
   * @returns Observable<Json>
   */
  static connect(url: string, method: string, apiParam?: APIParamProps) {
    const result = Observable.create((observer) => {
      // Params verification, will reture a VerificationError if params are not match
      const verifyResult = apiParam.verificationCallback();
      if (verifyResult instanceof _VerificationError) {
        // Emit API Error
        observer.error(verifyResult);
      }
      fetch(APIRouter.apiRequest(url, method, apiParam))
        .then((resp: Response) => {
          if (resp.ok) { return resp.json(); }
          throw new _APIError(`${resp.status}`, resp.text());
        })
        .then((json) => {
          if (json.status) {
            // Api Error
            const code = _.get(json, 'status', 'no status code');
            const message = _.get(json, 'message', 'no message');
            // Emit API Error
            throw new _APIError(code, message);
          } else if (json.data) {
            // Emit Json Data
            observer.next(_.get(json, 'data', {}));
          } else {
            // Emit Json
            observer.next(json);
          }
        }).catch((error) => {
          // Emit Network Error
          console.log('network error ======>:', error.code, error.message);
          observer.error(error);
        });
    });
    // TODO: Fetch need cancel when unsubscribe
    // Fetch need retry when network error occored
    return result.pipe(
      // Notify to observer that if token expired or refresh failed
      // Do some clean jobs
      tap(null, (error) => {
        if (error.code === ERROR_CODE_ENUM.TOKEN_EXPIRED
          || error.code === ERROR_CODE_ENUM.REFRESH_TOKEN_FAILED) {
          getCHDidLogout().next(true); // Will be called many times
        }
      }),
      retryWhen(APIRouter.retryStrategyOccured),
      finalize(() => getCHDidLogout().complete()),
    );
  }

  static retryStrategyOccured(errors) {
    return errors.pipe(
      // Return some retry Observable object
      concatMap((err) => {
        if (err instanceof _APIError) {
          switch (err.code) {
            case ERROR_CODE_ENUM.TOKEN_EXPIRED:
              return APIRouter.refreshToken();
            default:
              return throwError(err);
          }
        } else if (err instanceof Error) {
          // TODO: Adaptive DNS
          console.log('Error :', err);
          return throwError(err);
        } else {
          // Emit this error to subscribter
          console.log('else error:', err);
          return throwError(err);
        }
      }),
    );
  }

  /**
   * Refreash Token
   * @returns Obserable<Void>
   */
  static refreshToken() {
    return fetchStorage({ key: 'token' })
      .pipe(
        flatMap(token => APIRouter.get('accounts/api_token_refresh/', new Param({ token }, () => true))),
        tap(json => saveStorage({ key: 'token', data: json.token })),
      );
  }
}


export const Get$ = APIRouter.get;
export const Post$ = APIRouter.post;
export const Delete$ = APIRouter.delete;
export const Param = APIParam;
export const APIError = _APIError;
export const VerificationError = _VerificationError;
