/*
 * CityHomeClient
 * @Author: jeffzhao
 * @Date: 2019-01-14 11:33:52
 * @Last Modified by: jeffzhao
 * @Last Modified time: 2019-01-29 17:35:59
 * Copyright  © 2019 Jeff Zhao. All rights reserved.
 * @format
 * @flow
 */

import { Observable } from 'rxjs';
import { HOUR } from '../settings/CHConsts';

export const STORAGE_SYNC = {
  TOKEN: 'token',
  LOCATION: 'location',
  CATEGORY_ALL: 'category',
  FINANCIAL: 'financial',
};

/**
 * Save Object to Local
 * 使用key来保存数据（key-only）。这些数据一般是全局独有的，需要谨慎单独处理的数据
 * 批量数据请使用key和id来保存(key-id)，具体请往后看
 * 除非你手动移除，这些数据会被永久保存，而且默认不会过期。
 * @param {Object} obj {key, id, data} Object that need save
 * @returns Void
 */
export function save(obj: Object) {
  global.CHStorage.save({
    key: obj.key,
    id: obj.id,
    data: obj.data,
    // 如果不指定过期时间，则会使用defaultExpires参数
    // 如果设为null，则永不过期
    expires: HOUR * 24,
  });
  console.log('object saved: ');
  console.table(obj);
}

/**
 * Fetch Data from local storage
 * @param {Object} obj {key, id, extra} Object that need fetch
 * @returns Observable<Json>
 */
export function fetch(obj: Object) {
  console.log('fetch object:');
  console.table(obj);
  const result = Observable.create((observer) => {
    global.CHStorage
      .load({
        key: obj.key,
        id: obj.id,
        // autoSync(默认为true) 没有找到数据或数据过期时是否自动调用相应的sync方法
        // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
        autoSync: true,
        // syncInBackground(默认为true)意味着如果数据过期，
        // 在调用sync方法的同时先返回已经过期的数据。
        syncInBackground: true,
        // 你还可以给sync方法传递额外的参数
        syncParams: obj.extra,
      })
      .then((ret) => {
        observer.next(ret);
        observer.complete();
      })
      .catch((err) => {
        observer.error(err);
      });
  });

  return result;
}

/**
 * Remove object from local storage
 * @param {Object} obj {key, id} Target to remove
 */
export function remove(obj: Object) {
  global.CHStorage.remove(obj);
}
