import {utilB} from "../utils/utils";

export const testA = async (promise, cb, fallbackValue) => {
    const data = await promise
    const res = await utilB(data).catch(() => Promise.resolve(fallbackValue))

    cb('not started yet')

    return Promise.resolve(res).then(() => cb('handled'))
}

export const testB = ({ method }, [, cb], value) => {
    const promise = new Promise((res, rej) => (value > method() ? res(true) : rej('/')));
    const setPathname = (pathname) => (location.pathname = pathname);

    setTimeout(() => promise.then(cb()).catch(setPathname), 100);

    return promise;
};
