'use strict';
/**
 * Resolve Hands home and Cache at runtime.
 *
 * Home: HANDS_HOME, else CPC_ROOT (back-compat), else
 * %LOCALAPPDATA%\AIWander\Hands (platform user-data dir when LOCALAPPDATA is unset).
 * Cache: CPC_CACHE if set, else <home>/cache.
 * No machine-specific fallback.
 */
const os = require('os');
const path = require('path');

function nonempty(name) {
  const raw = process.env[name];
  if (raw == null) return '';
  return String(raw).trim();
}

function expandEnv(input) {
  let unresolved = false;
  const expand = (name) => {
    const value = process.env[name];
    if (value == null || String(value).trim() === '') {
      unresolved = true;
      return '';
    }
    return String(value).trim();
  };
  const out = String(input)
    .replace(/%([^%]+)%/g, (_, name) => expand(name))
    .replace(/\$\{([^}]+)\}/g, (_, name) => expand(name))
    .replace(/\$([A-Za-z_][A-Za-z0-9_]*)/g, (_, name) => expand(name));
  if (unresolved) return '';
  return out.trim();
}

function defaultHandsHome() {
  const local = nonempty('LOCALAPPDATA');
  if (local) return path.join(local, 'AIWander', 'Hands');
  if (process.platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', 'AIWander', 'Hands');
  }
  const xdg = nonempty('XDG_DATA_HOME');
  const base = xdg || path.join(os.homedir(), '.local', 'share');
  return path.join(base, 'AIWander', 'Hands');
}

function resolveHome() {
  const handsEnv = expandEnv(nonempty('HANDS_HOME'));
  if (handsEnv) return { path: path.resolve(handsEnv), source: 'HANDS_HOME' };
  const rootEnv = expandEnv(nonempty('CPC_ROOT'));
  if (rootEnv) return { path: path.resolve(rootEnv), source: 'CPC_ROOT' };
  return { path: path.resolve(defaultHandsHome()), source: 'default' };
}

function resolveToolbeltPaths() {
  const home = resolveHome();
  const cacheEnv = expandEnv(nonempty('CPC_CACHE'));
  const cache = cacheEnv
    ? { path: path.resolve(cacheEnv), source: 'CPC_CACHE' }
    : { path: path.join(home.path, 'cache'), source: 'default' };
  const serversDir = path.join(home.path, 'servers');
  return {
    home,
    cache,
    serversDir,
    handsExe: path.join(serversDir, 'hands.exe'),
  };
}

module.exports = { resolveToolbeltPaths, defaultHandsHome };
