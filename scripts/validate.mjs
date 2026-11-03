#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];

function mustExist(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) errors.push('missing: ' + rel);
  return p;
}

function readJson(rel) {
  const p = mustExist(rel);
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    errors.push('invalid JSON ' + rel + ': ' + e.message);
    return null;
  }
}

mustExist('README.md');
mustExist('LICENSE');
mustExist('PACK_MATRIX.md');
mustExist('CHANGELOG.md');
mustExist('assets/logo.svg');
mustExist('mcp.optionals.example.json');
mustExist('mcp.cache.example.json');
mustExist('hooks/HOOKS_README.md');
mustExist('rules/toolbelt-freemium.mdc');
mustExist('rules/cache-first.mdc');
mustExist('scripts/resolve-paths.cjs');

const plugin = readJson('.cursor-plugin/plugin.json');
if (plugin) {
  if (plugin.name !== 'cpc-toolbelt') errors.push('plugin name must be cpc-toolbelt');
  if (plugin.version !== '0.1.0') errors.push('plugin version must be 0.1.0');
  if (plugin.author?.name !== 'AIwander') errors.push('author must be AIwander');
  if (plugin.repository !== 'https://github.com/AIWander/CPC-Toolbelt') {
    errors.push('repository must be https://github.com/AIWander/CPC-Toolbelt');
  }
  if (plugin.logo !== 'assets/logo.svg') errors.push('logo must be assets/logo.svg');
  const kw = plugin.keywords || [];
  for (const k of ['cpc', 'mcp', 'hands', 'cache', 'toolbelt', 'aiwander']) {
    if (!kw.includes(k)) errors.push('missing keyword: ' + k);
  }
  for (const key of ['HANDS_HOME', 'CPC_ROOT', 'CPC_CACHE']) {
    const prop = plugin.variables?.properties?.[key];
    if (!prop) errors.push(key + ' variable required');
    const def = prop?.default;
    if (def != null && String(def).trim() !== '') {
      errors.push(key + ' must not ship a default path; resolve it at runtime');
    }
  }
  if (plugin.hooks !== './hooks/hooks.json' && plugin.hooks !== 'hooks/hooks.json') {
    warnings.push('hooks field should point at ./hooks/hooks.json');
  }
}

function assertStdioServers(rel, doc) {
  if (!doc) return;
  const servers = doc.mcpServers || {};
  for (const [name, spec] of Object.entries(servers)) {
    if (!spec || typeof spec !== 'object') {
      errors.push(rel + ' ' + name + ' is not an object');
      continue;
    }
    if (spec.url) errors.push(rel + ' ' + name + ' must be stdio, not a url');
    if (spec.type !== 'stdio') errors.push(rel + ' ' + name + ' must set type "stdio"');
    const cmd = String(spec.command || '');
    if (!cmd) {
      errors.push(rel + ' ' + name + ' missing command');
      continue;
    }
    if (/^[A-Za-z]:[\\/]/.test(cmd) || cmd.startsWith('/') || cmd.startsWith('\\\\')) {
      errors.push(rel + ' ' + name + ' command is an absolute path');
    }
    if (!/\$\{(?:HANDS_HOME|CPC_ROOT|CPC_CACHE|CURSOR_PLUGIN_ROOT|CLAUDE_PLUGIN_ROOT)\}/.test(cmd)) {
      errors.push(rel + ' ' + name + ' command must use an install-time or plugin-root variable');
    }
  }
}

const mcp = readJson('mcp.json');
if (mcp) {
  const keys = Object.keys(mcp.mcpServers || {});
  if (!keys.includes('cpc-hands')) errors.push('mcp.json missing cpc-hands');
  if (keys.includes('cpc-cache')) errors.push('mcp.json must NOT include cpc-cache in v1');
  if (keys.includes('cpc-programmer')) errors.push('Cursor mcp.json must not include programmer by default');
  if (keys.length !== 1 || keys[0] !== 'cpc-hands') {
    errors.push('mcp.json must contain only cpc-hands');
  }
  assertStdioServers('mcp.json', mcp);
}

assertStdioServers('mcp.optionals.example.json', readJson('mcp.optionals.example.json'));

const cacheEx = readJson('mcp.cache.example.json');
if (cacheEx) {
  const comment = JSON.stringify(cacheEx);
  if (!/DEFERRED|not for v1|NOT FOR V1/i.test(comment)) {
    errors.push('mcp.cache.example.json must be labeled deferred / not for v1');
  }
  assertStdioServers('mcp.cache.example.json', cacheEx);
}

const hooks = readJson('hooks/hooks.json');
if (hooks) {
  if (hooks.version !== 1) errors.push('hooks.json version must be 1');
  for (const ev of ['sessionStart', 'beforeSubmitPrompt', 'beforeMCPExecution', 'stop']) {
    if (!hooks.hooks?.[ev]?.length) errors.push('hooks.json missing ' + ev);
  }
  const stop = hooks.hooks?.stop?.[0];
  if (stop && stop.loop_limit !== 0) errors.push('stop hook loop_limit must be 0');
  for (const list of Object.values(hooks.hooks || {})) {
    for (const h of list) {
      if (!String(h.command || '').includes('CURSOR_PLUGIN_ROOT')) {
        errors.push('hook command should use ${CURSOR_PLUGIN_ROOT}: ' + h.command);
      }
    }
  }
}

for (const script of [
  'hooks/session_start.js',
  'hooks/cache_first_prompt.js',
  'hooks/cache_before_mcp.js',
  'hooks/stop_doctor_nudge.js',
  'scripts/toolbelt-doctor.mjs',
  'scripts/resolve-paths.cjs',
]) {
  mustExist(script);
}

for (const skill of [
  'getting-started',
  'toolbelt-setup',
  'toolbelt-doctor',
  'cache-first',
  'enable-optional',
  'add-programmer',
  'hands-check',
]) {
  const sk = mustExist('skills/' + skill + '/SKILL.md');
  if (fs.existsSync(sk)) {
    const t = fs.readFileSync(sk, 'utf8');
    if (!t.startsWith('---')) errors.push(skill + ' SKILL.md missing frontmatter');
    if (!t.includes('name: ' + skill)) errors.push(skill + ' frontmatter name mismatch');
  }
}

const gettingStarted = path.join(root, 'skills', 'getting-started', 'SKILL.md');
if (fs.existsSync(gettingStarted)) {
  const t = fs.readFileSync(gettingStarted, 'utf8');
  if (!t.includes('hands_setup_status')) {
    errors.push('getting-started skill must tell the agent to call hands_setup_status first');
  }
  if (!/Tailscale/i.test(t)) errors.push('getting-started skill must walk through a private tunnel');
  if (!/never store/i.test(t)) errors.push('getting-started skill must say never store keys');
  if (!/public/i.test(t)) errors.push('getting-started skill must refuse a public link by default');
}

for (const cmd of ['getting-started', 'toolbelt-setup', 'enable-optional', 'toolbelt-doctor']) {
  mustExist('commands/' + cmd + '.md');
}

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
if (!/autonomous/i.test(readme)) warnings.push('README should mention not branding as autonomous');
if (!/CPC_CACHE/.test(readme)) warnings.push('README should mention CPC_CACHE');
if (!/HANDS_HOME/.test(readme)) warnings.push('README should mention HANDS_HOME');
if (!/stdio/i.test(readme)) errors.push('README must describe stdio MCP');

const skipScan = new Set([path.normalize('scripts/validate.mjs')]);
const scanExt = new Set(['.md', '.mdc', '.js', '.mjs', '.cjs', '.json', '.svg', '.txt', '.yml', '.yaml']);
const machineRes = [
  new RegExp('C:[\\\\/]+' + 'CPC\\b', 'i'),
  new RegExp('suite_' + 'attempts', 'i'),
  new RegExp('\\b' + String.fromCharCode(66, 69, 69) + '\\b'),
  new RegExp('Jose' + 'p'),
  new RegExp('\\b' + ['p', 'a', 'l'].join('') + '\\b', 'i'),
  new RegExp('tail' + '7263d4', 'i'),
  new RegExp('\\b100\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b'),
  new RegExp('[A-Za-z]:\\\\Users\\\\', 'i'),
  /\b777[1-9]\b/,
];

function walk(dir, relBase) {
  for (const name of fs.readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const abs = path.join(dir, name);
    const rel = relBase ? relBase + '/' + name : name;
    const st = fs.statSync(abs);
    if (st.isDirectory()) {
      walk(abs, rel);
      continue;
    }
    if (!scanExt.has(path.extname(name))) continue;
    if (skipScan.has(path.normalize(rel))) continue;
    const text = fs.readFileSync(abs, 'utf8');
    for (const re of machineRes) {
      if (re.test(text)) errors.push('hard-coded machine path or host detail in ' + rel + ' (' + re + ')');
    }
  }
}
walk(root, '');

// Smoke-test hooks fail-open
for (const [script, stdin] of [
  ['hooks/session_start.js', '{}'],
  ['hooks/cache_first_prompt.js', JSON.stringify({ prompt: 'download the logo asset' })],
  ['hooks/cache_before_mcp.js', JSON.stringify({ tool_name: 'browser_navigate', mcp_server_name: 'cpc-hands' })],
  ['hooks/stop_doctor_nudge.js', JSON.stringify({ status: 'completed', loop_count: 0 })],
]) {
  const hookEnv = { ...process.env, CPC_TOOLBELT_DOCTOR_ON_STOP: '0' };
  for (const key of ['HANDS_HOME', 'CPC_ROOT', 'CPC_CACHE', 'HANDS_SHARED_PORT']) delete hookEnv[key];
  const r = spawnSync(process.execPath, [path.join(root, script)], {
    input: stdin,
    encoding: 'utf8',
    env: hookEnv,
  });
  if (r.status !== 0) errors.push(script + ' exited ' + r.status);
  try {
    JSON.parse((r.stdout || '{}').trim() || '{}');
  } catch {
    errors.push(script + ' did not emit JSON: ' + r.stdout);
  }
  if (r.stdout && machineRes.some((re) => re.test(r.stdout))) {
    errors.push(script + ' emitted a machine-specific path');
  }
}

function doctorEnv(extra) {
  const env = { ...process.env };
  for (const key of ['HANDS_HOME', 'CPC_ROOT', 'CPC_CACHE', 'HANDS_SHARED_PORT', 'LOCALAPPDATA']) {
    delete env[key];
  }
  return { ...env, ...extra };
}

// Doctor: path verdict is JSON `ok`. Process exit stays 0 (fail-open).
{
  const os = await import('os');
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'toolbelt-doctor-'));
  const servers = path.join(fixture, 'servers');
  const cacheDir = path.join(fixture, 'cache');
  fs.mkdirSync(servers, { recursive: true });
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.writeFileSync(path.join(servers, 'hands.exe'), '');
  const doctor = path.join(root, 'scripts', 'toolbelt-doctor.mjs');
  const good = spawnSync(process.execPath, [doctor], {
    encoding: 'utf8',
    timeout: 5000,
    env: doctorEnv({ CPC_ROOT: fixture, CPC_CACHE: cacheDir }),
  });
  if (good.status !== 0) errors.push('toolbelt-doctor.mjs exited ' + good.status + ' on a good fixture');
  let goodJson = null;
  try {
    goodJson = JSON.parse((good.stdout || '').trim());
  } catch {
    errors.push('toolbelt-doctor.mjs did not emit JSON on a good fixture');
  }
  if (goodJson) {
    if (goodJson.ok !== true) errors.push('toolbelt-doctor.mjs ok should be true when paths exist');
    if (goodJson.hands_home?.source !== 'CPC_ROOT') {
      errors.push('CPC_ROOT should override the default Hands home when HANDS_HOME is unset');
    }
    if (goodJson.shared_host?.probe?.status !== 'skipped') {
      errors.push('toolbelt-doctor.mjs should skip the shared-host probe when no port is configured');
    }
    if (goodJson.hands_exe?.spawn !== path.join(fixture, 'servers', 'hands.exe')) {
      errors.push('hands spawn path should stay under the resolved home');
    }
  }

  const handsHome = path.join(fixture, 'hands-home');
  fs.mkdirSync(path.join(handsHome, 'servers'), { recursive: true });
  fs.writeFileSync(path.join(handsHome, 'servers', 'hands.exe'), '');
  const preferHands = spawnSync(process.execPath, [doctor], {
    encoding: 'utf8',
    timeout: 5000,
    env: doctorEnv({ HANDS_HOME: handsHome, CPC_ROOT: fixture, CPC_CACHE: cacheDir }),
  });
  try {
    const preferJson = JSON.parse((preferHands.stdout || '').trim());
    if (preferJson.hands_home?.source !== 'HANDS_HOME' || preferJson.hands_home?.path !== path.resolve(handsHome)) {
      errors.push('HANDS_HOME must win over CPC_ROOT');
    }
  } catch {
    errors.push('toolbelt-doctor.mjs did not emit JSON for the HANDS_HOME override');
  }

  fs.mkdirSync(path.join(fixture, 'shared-mcp'), { recursive: true });
  const shared = spawnSync(process.execPath, [doctor], {
    encoding: 'utf8',
    timeout: 5000,
    env: doctorEnv({ CPC_ROOT: fixture, CPC_CACHE: cacheDir, HANDS_SHARED_PORT: '1' }),
  });
  if (shared.status !== 0) errors.push('toolbelt-doctor.mjs exited ' + shared.status + ' when probing a shared port');
  let sharedJson = null;
  try {
    sharedJson = JSON.parse((shared.stdout || '').trim());
  } catch {
    errors.push('toolbelt-doctor.mjs did not emit JSON for the shared-host probe');
  }
  if (sharedJson) {
    if (sharedJson.ok !== true) errors.push('a shared-host probe must not fail path checks');
    const st = sharedJson.shared_host?.probe?.status;
    if (st !== 'open' && st !== 'closed') {
      errors.push('shared-host probe status must be open or closed, got ' + st);
    }
    if (sharedJson.shared_host?.probe?.port !== 1) {
      errors.push('shared-host probe must use HANDS_SHARED_PORT and not a built-in port');
    }
  }

  const local = path.join(fixture, 'local');
  fs.mkdirSync(local, { recursive: true });
  const defaults = spawnSync(process.execPath, [doctor], {
    encoding: 'utf8',
    timeout: 5000,
    env: doctorEnv({ LOCALAPPDATA: local }),
  });
  try {
    const defaultsJson = JSON.parse((defaults.stdout || '').trim());
    const expectedHome = path.join(local, 'AIWander', 'Hands');
    if (defaultsJson.hands_home?.source !== 'default' || defaultsJson.hands_home?.path !== expectedHome) {
      errors.push('default Hands home must be %LOCALAPPDATA%/AIWander/Hands');
    }
    if (defaultsJson.cpc_cache?.path !== path.join(expectedHome, 'cache')) {
      errors.push('default Cache must be <Hands home>/cache');
    }
    if (defaultsJson.ok !== false) errors.push('missing default directories must report ok:false');
  } catch {
    errors.push('toolbelt-doctor.mjs did not emit JSON for the default home');
  }

  const bad = spawnSync(process.execPath, [doctor], {
    encoding: 'utf8',
    timeout: 5000,
    env: doctorEnv({
      CPC_ROOT: path.join(fixture, 'missing-root'),
      CPC_CACHE: path.join(fixture, 'missing-cache'),
    }),
  });
  if (bad.status !== 0) errors.push('toolbelt-doctor.mjs must fail-open (exit 0) when paths are missing');
  try {
    const badJson = JSON.parse((bad.stdout || '').trim());
    if (badJson.ok !== false) errors.push('toolbelt-doctor.mjs ok should be false when paths are missing');
  } catch {
    errors.push('toolbelt-doctor.mjs did not emit JSON when paths are missing');
  }

  fs.rmSync(fixture, { recursive: true, force: true });
}

const result = { root, errors, warnings, ok: errors.length === 0 };
console.log(JSON.stringify(result, null, 2));
process.exit(errors.length ? 1 : 0);
