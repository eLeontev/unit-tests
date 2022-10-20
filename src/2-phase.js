import {defaultValue, shouldBeTruthy} from "../constants/constants";

export const testA = () => {
    if (shouldBeTruthy) {
        return 1
    }

    return 2
}

export const testB = (hasValue, value) => hasValue && value

export const testC = (hasValue, value) => hasValue && value ? value : defaultValue

export const testD = (obj) => {
    if (obj?.methodA() && obj.methodB()) {
        return defaultValue
    }

    if (obj?.methodC() || obj.methodD()) {
        return defaultValue.toUpperCase()
    }

    return defaultValue.toLowerCase()
}
