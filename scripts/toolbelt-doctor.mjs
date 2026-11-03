#!/usr/bin/env node
/**
 * CPC Toolbelt doctor.
 * Resolves the Hands home and Cache at runtime (see scripts/resolve-paths.cjs).
 * Checks that home, servers/hands.exe, and the Cache directory exist.
 * If <home>/shared-mcp exists and HANDS_SHARED_PORT is set, TCP-probes
 * 127.0.0.1 on that port. The probe is advisory and has no default port.
 * Path misses set ok:false. The process always exits 0 (fail-open) and
 * prints one JSON object.
 * Does not create directories, read Volumes, or open files under shared-mcp.
 */
import fs from 'fs';
import net from 'net';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { resolveToolbeltPaths } = require('./resolve-paths.cjs');

const PROBE_MS = 800;

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

function sharedPort() {
  const raw = process.env.HANDS_SHARED_PORT;
  if (raw == null || String(raw).trim() === '') return null;
  const n = Number(String(raw).trim());
  if (!Number.isInteger(n) || n < 1 || n > 65535) return null;
  return n;
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
  const resolved = resolveToolbeltPaths();
  const handsPath = resolved.handsExe;
  const marker = path.join(resolved.home.path, 'shared-mcp');
  const errors = [];

  const homeExists = existsDir(resolved.home.path);
  const handsExists = existsFile(handsPath);
  const cacheExists = existsDir(resolved.cache.path);
  if (!homeExists) errors.push('Hands home is not a directory: ' + resolved.home.path);
  if (!handsExists) errors.push('hands.exe missing: ' + handsPath);
  if (!cacheExists) errors.push('Cache directory is missing: ' + resolved.cache.path);

  const sharedPresent = homeExists && existsDir(marker);
  const port = sharedPort();
  let probe;
  if (!sharedPresent) {
    probe = { host: '127.0.0.1', port: port, status: 'skipped', error: null };
  } else if (port == null) {
    probe = {
      host: '127.0.0.1',
      port: null,
      status: 'skipped',
      error: 'HANDS_SHARED_PORT unset or not a TCP port',
    };
  } else {
    try {
      probe = await probeHands(port);
    } catch (err) {
      probe = {
        host: '127.0.0.1',
        port,
        status: 'closed',
        error: err && err.message ? err.message : 'probe failed',
      };
    }
  }

  const homeReport = {
    path: resolved.home.path,
    source: resolved.home.source,
    exists: homeExists,
  };
  const report = {
    ok: errors.length === 0,
    fail_open: true,
    hands_home: homeReport,
    cpc_root: { ...homeReport, back_compat: true },
    hands_exe: {
      path: handsPath,
      exists: handsExists,
      spawn: handsPath,
      args: [],
    },
    cpc_cache: {
      path: resolved.cache.path,
      source: resolved.cache.source,
      exists: cacheExists,
    },
    shared_host: {
      present: sharedPresent,
      marker,
      probe,
      advisory: true,
    },
    errors,
    notes: [
      'Hands home is HANDS_HOME, else CPC_ROOT, else the per-user AIWander/Hands directory.',
      'Cache v1 is a directory plus skills/hooks. This check does not look for a Cache MCP server.',
      'MCP servers in this pack are stdio. A shared-host probe runs only when HANDS_SHARED_PORT is set, and it never fails the doctor.',
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
