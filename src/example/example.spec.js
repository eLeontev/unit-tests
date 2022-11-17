// TODO: config project/jest to support imports to move tested method to a separate folder
// TODO: setup coverage to jest config
// TODO: add rest tests for not covered functionality

let createRequest = () => {}
let startWork = () => {}
let startFlowing = () => {}
let abort = () => {}

const createResponseState = () => {}
const createRootFormatContext = () => {}

function prerender(
    children,
    options,
) {
    return new Promise((resolve, reject) => {
        const onFatalError = reject;

        function onAllReady() {
            const stream = new ReadableStream(
                {
                    type: 'bytes',
                    pull: (controller) => {
                        startFlowing(request, controller);
                    },
                },
                // $FlowFixMe size() methods are not allowed on byte streams.
                {highWaterMark: 0},
            );

            const result = {
                prelude: stream,
            };
            resolve(result);
        }
        const request = createRequest(
            children,
            createResponseState(
                options ? options.identifierPrefix : undefined,
                undefined,
                options ? options.bootstrapScriptContent : undefined,
                options ? options.bootstrapScripts : undefined,
                options ? options.bootstrapModules : undefined,
                options ? options.unstable_externalRuntimeSrc : undefined,
            ),
            createRootFormatContext(options ? options.namespaceURI : undefined),
            options ? options.progressiveChunkSize : undefined,
            options ? options.onError : undefined,
            onAllReady,
            undefined,
            undefined,
            onFatalError,
        );
        if (options && options.signal) {
            const signal = options.signal;
            if (signal.aborted) {
                abort(request, signal.reason);
            } else {
                const listener = () => {
                    abort(request, signal.reason);
                    signal.removeEventListener('abort', listener);
                };
                signal.addEventListener('abort', listener);
            }
        }
        startWork(request);
    });
}

describe('#prerender', () => {
    let onAllReady

    beforeEach(() => {
        startWork = jest.fn().mockName('startWork')
        createRequest = jest.fn().mockName('createRequest')
    });

    beforeEach(() => {
        globalThis.ReadableStream = jest.fn().mockName('ReadableStream')
    });

    beforeEach(() => {
        createRequest.mockImplementation((...args) => {
            onAllReady = args[5]
            onAllReady()
        })
    });

    it('should return promise', () => {
        expect(prerender(children, options)).toBeInstanceOf(Promise)
    });

    describe('reject scenarios', () => {
        const myCustomError = 'myCustomError'

        beforeEach(() => {
            createRequest.mockImplementation((...args) => {
                const reject = args[8]
                reject(myCustomError)
            })
        });

        it('should reject returned promise if create request fails on fatal error', async () => {
            let error

            try {
                await prerender()
            } catch (e) {
                error = e
            } finally {
                expect(error).toBe(myCustomError)
            }
        });
    });

    describe('resolve scenarios', () => {
        let stream

        beforeEach(() => {
            stream = {isStrim: true}
            globalThis.ReadableStream.mockReturnValue(stream)
        });

        it('should resolve returned promise if no errors', async () => {
            expect(await prerender()).toEqual({
                prelude: stream,
            })
        });
    });

    describe('#onAllReady', () => {
        beforeEach(() => {
            prerender()
        });

        it('should create a new readable stream with proper params', () => {
            onAllReady()
            expect(globalThis.ReadableStream).toBeCalledWith(expect.any(Object),
                {highWaterMark: 0})
        });
    });
});
