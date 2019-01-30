/* eslint-disable no-unused-vars */
/*
 * CityHomeClient
 * @Author: jeffzhao
 * @Date: 2019-01-17 11:35:49
 * @Last Modified by: jeffzhao
 * @Last Modified time: 2019-01-29 17:36:30
 * Copyright  © 2019 Jeff Zhao. All rights reserved.
 * @format
 * @flow
 */
import { tap } from 'rxjs/operators';
import { Get$, Param } from '../network/APIRouter';
import { save, STORAGE_SYNC } from './CHStorage';

// Note: sync property from `storage` only accept async method
// So，when data expired, just fetch new data and save to device
// Not emit the new data
// Reason: `Observable<Json>` call toPromise() method not working

export async function location() {
  console.log('location expired, fetching new =====>');
  Get$('common/place_list', new Param(null, () => true))
    .subscribe(
      (json) => {
        save({ key: STORAGE_SYNC.LOCATION, data: json });
      },
      err => console.error(err),
    );
}

export async function category() {
  console.log('category expired, fetching new =====>');
  Get$('common/category_list', new Param({ type: '' }, () => true))
    .subscribe(
      (json) => {
        save({ key: STORAGE_SYNC.CATEGORY_ALL, data: json });
      },
      err => console.error(err),
    );
}

export async function financial() {
  console.log('financial expired, fetching new =====>');
  Get$('common/finance_type_list', new Param({ type: 'financial' }, () => true))
    .subscribe(
      (json) => {
        save({ key: STORAGE_SYNC.FINANCIAL, data: json });
      },
      err => console.error(err),
    );
}
