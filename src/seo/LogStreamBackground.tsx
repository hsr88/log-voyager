import React from 'react';

const leftTrace = [
  '09:42:11.084 INFO  api.request route=/checkout status=202',
  '09:42:11.193 DEBUG cache.lookup key=session:7b2 result=hit',
  '09:42:12.007 INFO  worker.start queue=payments attempt=1',
  '09:42:12.884 WARN  upstream.latency service=gateway ms=1842',
  '09:42:13.016 INFO  db.query table=orders rows=1',
  '09:42:13.440 ERROR gateway.timeout trace=7fb2c1',
  '09:42:14.021 INFO  retry.scheduled delay=500ms',
  '09:42:14.608 DEBUG request.context region=eu-central',
];

const rightTrace = [
  '{"level":"info","service":"catalog","event":"sync.complete"}',
  '172.18.0.3 GET /health 200 3ms',
  'container/web.1 stdout ready on :8080',
  '{"level":"warn","service":"search","took_ms":927}',
  'nginx access 10.0.3.14 POST /api/logs 204',
  'syslog app[2184]: connection restored',
  '{"level":"error","code":"UPSTREAM_TIMEOUT","retry":true}',
  'docker worker.2 exited code=0',
];

const TraceColumn: React.FC<{ lines: string[]; side: 'left' | 'right' }> = ({ lines, side }) => (
  <div className={`log-stream__column log-stream__column--${side}`}>
    {[...lines, ...lines].map((line, index) => (
      <span key={`${side}-${index}`} className={line.includes('ERROR') || line.includes('"error"') ? 'is-error' : line.includes('WARN') || line.includes('"warn"') ? 'is-warning' : ''}>
        {line}
      </span>
    ))}
  </div>
);

export const LogStreamBackground: React.FC = () => (
  <div className="log-stream" aria-hidden="true">
    <TraceColumn lines={leftTrace} side="left" />
    <TraceColumn lines={rightTrace} side="right" />
    <div className="log-stream__scan" />
  </div>
);
