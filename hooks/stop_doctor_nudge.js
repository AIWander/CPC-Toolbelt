#!/usr/bin/env node
'use strict';
/**
 * stop — optional doctor follow-up. Default off (loop_limit 0 + env gate).
 * Only emits followup_message when CPC_TOOLBELT_DOCTOR_ON_STOP=1.
 */
const fs = require('fs');

function readInput() {
  try {
    const chunks = [];
    const buf = Buffer.alloc(65536);
    let n;
    while ((n = fs.readSync(0, buf, 0, buf.length, null)) > 0) {
      chunks.push(Buffer.from(buf.subarray(0, n)));
    }
    const raw = Buffer.concat(chunks).toString('utf8').trim();
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function main() {
  try {
    readInput();
    if (process.env.CPC_TOOLBELT_DOCTOR_ON_STOP === '1') {
      process.stdout.write(
        JSON.stringify({
          followup_message:
            'Run the toolbelt-doctor skill to verify hands.exe under CPC_ROOT/servers and that CPC_CACHE exists.',
        }) + '\n'
      );
      return;
    }
    process.stdout.write('{}\n');
  } catch {
    process.stdout.write('{}\n');
  }
}

main();
