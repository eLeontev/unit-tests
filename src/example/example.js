// https://github.com/facebook/react/blob/main/packages/react-dom/src/server/ReactDOMFizzStaticBrowser.js

const {createRequest,
  startWork,
  startFlowing,
  abort,
  createResponseState,
  createRootFormatContext} = require('./utils')
// import {
//   createRequest,
//   startWork,
//   startFlowing,
//   abort,
// } from './utils';
//
// import {
//   createResponseState,
//   createRootFormatContext,
// } from './utils';

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

export {prerender};
