const resolve = require('resolve');
const { resolvePath } = require('babel-plugin-module-resolver');

// https://github.com/dividab/tsconfig-paths/blob/f42003925f4d56458d41daed80013c8ad23c88ea/src/register.ts#L9-L37
const builtinModules = [
  'assert',
  'buffer',
  'child_process',
  'cluster',
  'crypto',
  'dgram',
  'dns',
  'domain',
  'events',
  'fs',
  'http',
  'https',
  'net',
  'os',
  'path',
  'punycode',
  'querystring',
  'readline',
  'stream',
  'string_decoder',
  'tls',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'zlib',
].reduce((r, m) => ({ ...r, [m]: true }), {});

/**
 * Leaves built-in modules and node_modules untouched.
 */
module.exports = function betterResolvePath(sourcePath, currentFile, opts) {
  // keep built-in modules, `resolve.sync` will handle other styles of built-in modules import (ex. require('fs/promises'))
  if (builtinModules[sourcePath]) {
    return sourcePath;
  }

  try {
    const realPath = resolve.sync(sourcePath);
    // detect node modules or
    if (
      realPath === sourcePath || // require('fs/promises')
      realPath.includes(`node_modules/${sourcePath}`) // dependencies
    ) {
      return sourcePath;
    }
  } catch (error) {}
  return resolvePath(sourcePath, currentFile, opts);
};
