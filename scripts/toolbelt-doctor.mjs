#!/usr/bin/env node
/**
 * CPC Toolbelt doctor.
 * Checks CPC_ROOT, hands.exe, and CPC_CACHE.
 * If %CPC_ROOT%\shared-mcp exists, TCP-probes 127.0.0.1:7772 (Hands).
 * That probe is advisory. Path misses set ok:false. The process always
 * exits 0 (fail-open) and prints one JSON object.
 * Does not create directories, read Volumes, parse shared-mcp configs,
 * or contact any port other than 7772.
 */
import fs from 'fs';
import net from 'net';
import path from 'path';

const HANDS_PORT = 7772;
const PROBE_MS = 800;

function envPath(name, fallback) {
  const raw = process.env[name];
  if (raw && String(raw).trim()) {
    return { path: path.resolve(String(raw).trim()), source: 'env' };
  }
  return { path: fallback, source: 'default' };
}

function existsDir(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isDirectory();
  } catch {
    return false;
  }
}

function existsFile(p) {
  try {
    return fs.existsSync(p) && fs.statSync(p).isFile();
  } catch {
    return false;
  }
}

function probeHands(port) {
  return new Promise((resolve) => {
    const host = '127.0.0.1';
    const socket = new net.Socket();
    let settled = false;
    const finish = (status, error) => {
      if (settled) return;
      settled = true;
      try {
        socket.destroy();
      } catch {
        /* ignore */
      }
      resolve({ host, port, status, error });
    };
    const wall = setTimeout(() => finish('closed', 'timeout'), PROBE_MS + 200);
    const done = (status, error) => {
      clearTimeout(wall);
      finish(status, error);
    };
    socket.setTimeout(PROBE_MS);
    socket.once('connect', () => done('open', null));
    socket.once('timeout', () => done('closed', 'timeout'));
    socket.once('error', (err) => done('closed', err.code || err.message));
    try {
      socket.connect(port, host);
    } catch (err) {
      done('closed', err && err.message ? err.message : 'connect failed');
    }
  });
}

async function run() {
  const root = envPath('CPC_ROOT', 'C:\\CPC');
  const cache = envPath('CPC_CACHE', 'C:\\CPC\\cache');
  const handsPath = path.join(root.path, 'servers', 'hands.exe');
  const marker = path.join(root.path, 'shared-mcp');
  const errors = [];

  const rootExists = existsDir(root.path);
  const handsExists = existsFile(handsPath);
  const cacheExists = existsDir(cache.path);
  if (!rootExists) errors.push('CPC_ROOT is not a directory: ' + root.path);
  if (!handsExists) errors.push('hands.exe missing: ' + handsPath);
  if (!cacheExists) errors.push('CPC_CACHE is not a directory: ' + cache.path);

  const sharedPresent = rootExists && existsDir(marker);
  let probe;
  if (!sharedPresent) {
    probe = { host: '127.0.0.1', port: HANDS_PORT, status: 'skipped', error: null };
  } else {
    try {
      probe = await probeHands(HANDS_PORT);
    } catch (err) {
      probe = {
        host: '127.0.0.1',
        port: HANDS_PORT,
        status: 'closed',
        error: err && err.message ? err.message : 'probe failed',
      };
    }
  }

  const report = {
    ok: errors.length === 0,
    fail_open: true,
    cpc_root: { path: root.path, source: root.source, exists: rootExists },
    hands_exe: {
      path: handsPath,
      exists: handsExists,
      spawn: handsPath,
      args: [],
    },
    cpc_cache: { path: cache.path, source: cache.source, exists: cacheExists },
    shared_host: {
      present: sharedPresent,
      marker,
      probe,
      advisory: true,
    },
    errors,
    notes: [
      'Cache v1 is a directory plus skills/hooks. This check does not look for a Cache MCP server.',
      'A closed or skipped 7772 probe does not fail the doctor.',
    ],
  };
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
}

run().catch((err) => {
  const report = {
    ok: false,
    fail_open: true,
    errors: [err && err.message ? err.message : String(err)],
    notes: ['Doctor caught an unexpected error and did not fail the process.'],
  };
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
});
