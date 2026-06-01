import { fileURLToPath } from 'url';
import path from 'path';
import nodeCrypto from 'crypto';

// Polyfill crypto.getRandomValues para soporte de Node 16
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = {};
}
if (typeof globalThis.crypto.getRandomValues === 'undefined') {
  if (nodeCrypto.webcrypto && nodeCrypto.webcrypto.getRandomValues) {
    globalThis.crypto.getRandomValues = function (arr) {
      return nodeCrypto.webcrypto.getRandomValues(arr);
    };
  } else {
    globalThis.crypto.getRandomValues = function (arr) {
      const bytes = nodeCrypto.randomBytes(arr.length);
      for (let i = 0; i < arr.length; i++) {
        arr[i] = bytes[i];
      }
      return arr;
    };
  }
}

// Polyfill CustomEvent
if (typeof globalThis.CustomEvent === 'undefined') {
  globalThis.CustomEvent = class CustomEvent extends Event {
    constructor(event, params = {}) {
      super(event);
      this.detail = params.detail;
    }
  };
}

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const cliPath = path.resolve(currentDir, 'node_modules/vite/dist/node/cli.js').replace(/\\/g, '/');

await import('file:///' + cliPath);
