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
  if (!plugin.variables?.properties?.CPC_ROOT) errors.push('CPC_ROOT variable required');
  if (!plugin.variables?.properties?.CPC_CACHE) errors.push('CPC_CACHE variable required');
  const cacheDefault = plugin.variables?.properties?.CPC_CACHE?.default || '';
  if (!String(cacheDefault).replace(/\\\\/g, '\\').includes('cache')) {
    errors.push('CPC_CACHE default should suggest C:\\CPC\\cache');
  }
  if (plugin.hooks !== './hooks/hooks.json' && plugin.hooks !== 'hooks/hooks.json') {
    warnings.push('hooks field should point at ./hooks/hooks.json');
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
}

const cacheEx = readJson('mcp.cache.example.json');
if (cacheEx) {
  const comment = JSON.stringify(cacheEx);
  if (!/DEFERRED|not for v1|NOT FOR V1/i.test(comment)) {
    errors.push('mcp.cache.example.json must be labeled deferred / not for v1');
  }
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
]) {
  mustExist(script);
}

for (const skill of [
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

for (const cmd of ['toolbelt-setup', 'enable-optional', 'toolbelt-doctor']) {
  mustExist('commands/' + cmd + '.md');
}

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
if (!/autonomous/i.test(readme)) warnings.push('README should mention not branding as autonomous');
if (!/[Cc]:\+CPC\+cache|CPC\cache|CPC\/cache|CPC_CACHE/.test(readme)) {
  warnings.push('README should mention default CPC_CACHE path');
}

// Smoke-test hooks fail-open
for (const [script, stdin] of [
  ['hooks/session_start.js', '{}'],
  ['hooks/cache_first_prompt.js', JSON.stringify({ prompt: 'download the logo asset' })],
  ['hooks/cache_before_mcp.js', JSON.stringify({ tool_name: 'browser_navigate', mcp_server_name: 'cpc-hands' })],
  ['hooks/stop_doctor_nudge.js', JSON.stringify({ status: 'completed', loop_count: 0 })],
]) {
  const r = spawnSync(process.execPath, [path.join(root, script)], {
    input: stdin,
    encoding: 'utf8',
    env: { ...process.env, CPC_TOOLBELT_DOCTOR_ON_STOP: '0' },
  });
  if (r.status !== 0) errors.push(script + ' exited ' + r.status);
  try {
    JSON.parse((r.stdout || '{}').trim() || '{}');
  } catch {
    errors.push(script + ' did not emit JSON: ' + r.stdout);
  }
}

const result = { root, errors, warnings, ok: errors.length === 0 };
console.log(JSON.stringify(result, null, 2));
process.exit(errors.length ? 1 : 0);
