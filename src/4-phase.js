import {utilA} from "../utils/utils";
import {defaultValue} from "../constants/constants";

export class Test {
    valueB = 2.4123

    constructor(dependency, valueA, arg) {
        this.dependency = dependency
        this.valueA = valueA
        this.valueC = utilA(arg)
        this.valueD = this.methodD(this.valueB)
    }

    methodA() {
        return this.dependency(this.valueB) * this.valueB
    }

    methodB() {
        if (this.valueD) {
            return this.methodC()
        }

        return this.valueA
    }

    methodC(arg) {
        if (arg > this.valueC) {
            return this.methodC
        }
    }

    methodD(value, arr) {
        const res = arr.reduce(this.methodC, defaultValue)
        const [first, ...rest] = arr
        
        return res === this.valueD ? this.methodD(value, rest) : first
    }
}
