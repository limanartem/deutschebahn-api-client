import { TestEnvironment } from 'jest-environment-node';
import { fetch as undiciFetch, Dispatcher } from 'undici';
import { JestEnvironmentConfig, EnvironmentContext } from '@jest/environment';

module.exports = class extends TestEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.mockGlobalFetch();
  }

  /**
   * Replace the global fetch implementation with one which still uses undici, but pulls
   * in the correct "dispatcher" from the global object.
   *
   * Background:
   * 1. Every call to fetch uses a "dispatcher", i.e. the underlying HTTP client
   * 2. If you don't explicitly specify it when calling `fetch(...)`, Undici / Node
   *    internally uses a special symbol to find the default global one inside the
   *    global namespace [1]
   * 3. Jest runs each test in a separate process, so Symbol.for(...) returns a
   *    different value in the test process.
   * 4. This means that calling `setGlobalDispatcher(...)` in the test has no effect on
   *    the global version that fetch otherwise would use.
   * 5. This means that your mocks won't apply and won't be cleared up automatically.
   *
   * This method overrides the global fetch, to specify our own global dispatcher, and
   * creates a special method that can be used to replace the dispatcher.
   *
   * [1]: https://github.com/nodejs/undici/blob/e5c9d703e63cd5ad691b8ce26e3f9a81c598f2e3/lib/global.js#L5
   */
  mockGlobalFetch() {
    this.global.fetch = (input: any, init: any) =>
      undiciFetch(input, {
        dispatcher: this.global['mockAgent'] as Dispatcher,
        ...init,
      }) as unknown as Promise<Response>;

    this.global.setMockedFetchGlobalDispatcher = (agent: any) =>
      Object.defineProperty(this.global, 'mockAgent', {
        value: agent,
        writable: true,
        enumerable: false,
        configurable: false,
      });
  }
};
