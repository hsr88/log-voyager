import assert from 'node:assert/strict';
import {
  buildTimeline,
  detectLogFormat,
  groupSimilarErrors,
  parseLogTimestamp,
} from '../src/utils/logAnalysis.ts';

const jsonLines = [
  JSON.stringify({ timestamp: '2026-08-02T10:00:00Z', level: 'error', message: 'gateway timeout request_id=abc123' }),
  JSON.stringify({ timestamp: '2026-08-02T10:01:00Z', level: 'error', message: 'gateway timeout request_id=xyz987' }),
];

assert.equal(detectLogFormat(jsonLines, 'app.jsonl').id, 'jsonl');
assert.equal(detectLogFormat([
  JSON.stringify({ log: 'ready', stream: 'stdout', time: '2026-08-02T10:00:00.123456789Z' }),
  JSON.stringify({ log: 'failed', stream: 'stderr', time: '2026-08-02T10:01:00.123456789Z' }),
], 'container.log').id, 'docker-json');
assert.equal(detectLogFormat([
  '2026-08-02T10:00:00.123456789Z stdout F service ready',
  '2026-08-02T10:01:00.123456789Z stderr F service failed',
], 'pod.log').id, 'kubernetes-cri');
assert.equal(detectLogFormat([
  '127.0.0.1 - - [02/Aug/2026:10:00:00 +0200] "GET /api HTTP/1.1" 500 12',
  '127.0.0.1 - - [02/Aug/2026:10:01:00 +0200] "GET /ok HTTP/1.1" 200 8',
], 'access.log').id, 'nginx-access');
assert.equal(detectLogFormat([
  'Aug  2 10:00:00 host app: error timeout',
  'Aug  2 10:01:00 host app: warning retry',
], 'syslog').id, 'syslog');

assert.ok(parseLogTimestamp('2026-08-02T10:00:00.123456789Z stdout F ready'));
const timeline = buildTimeline(jsonLines);
assert.equal(timeline.reduce((total, bucket) => total + bucket.count, 0), 2);
assert.equal(timeline.reduce((total, bucket) => total + bucket.errors, 0), 2);

const groups = groupSimilarErrors(jsonLines);
assert.equal(groups.length, 1);
assert.equal(groups[0].count, 2);
assert.match(groups[0].key, /id=<ID>/);

console.log('log analysis tests passed');
