import {defaultValue} from "../constants/constants";
import {utilA} from "../utils/utils";

export const testA = (method) => method(defaultValue)

export const testB = (value = defaultValue) => utilA(value)

export const testC = (cb) => utilB({defaultValue}).then(cb)

export const testD = (cb) => setTimeout(() => testC(cb), 100)

