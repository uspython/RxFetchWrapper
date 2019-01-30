/*
 * CityHomeClient
 * @Author: jeffzhao
 * @Date: 2019-01-14 17:47:50
 * @Last Modified by: jeffzhao
 * @Last Modified time: 2019-01-29 17:35:02
 * Copyright  © 2019 Jeff Zhao. All rights reserved.
 * @format
 * @flow
 */

/**
  * Return current token
  * @returns String
  */
export function getCHToken() {
  return global.CHToken;
}

export function getCHCurrentUser() {
  return global.CHUser;
}

export function setCHToken(token: string) {
  global.CHToken = token;
}

export function setCHCurrentUser(user: JSON) {
  global.CHUser = user;
}

/**
 * Get didLogout subject
 * @returns AsyncSubject<>
 */
export function getCHDidLogout() {
  const logout = global.didLogout;
  return logout;
}
