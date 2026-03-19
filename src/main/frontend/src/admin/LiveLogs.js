import React, { useEffect, useMemo, useRef, useState } from 'react';
import { apiFetch } from '../utils/api';

/**
 * Minimal live log viewer for the backend SSE endpoint.
 *
 * Backend endpoint: /api/admin/logs/stream
 * Events:
 *  - hello: string
 *  - log: { id, timestamp, level, logger, thread, message, throwable }
 */
const LiveLogs = () => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [paused, setPaused] = useState(false);
  const [level, setLevel] = useState('ALL');
  const [contains, setContains] = useState('');
  const [maxLines, setMaxLines] = useState(500);

  const [events, setEvents] = useState([]);

  const lastEventIdRef = useRef(0);
  const esRef = useRef(null);
  const reconnectTimerRef = useRef(null);

  const clearReconnectTimer = () => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const closeEventSource = () => {
    if (esRef.current) {
      try { esRef.current.close(); } catch (_) {}
      esRef.current = null;
    }
  };

  const scheduleReconnect = (reason) => {
    clearReconnectTimer();

    reconnectTimerRef.current = setTimeout(() => {
      connect({ reason });
    }, 5000);
  };

  const connect = async ({ reason } = {}) => {
    clearReconnectTimer();
    closeEventSource();

    setError(null);

    const sinceId = lastEventIdRef.current || 0;
    const backendOrigin = 'http://localhost:8080';
    const url = `${backendOrigin}/api/admin/logs/stream-raw?sinceId=${encodeURIComponent(sinceId)}`;

    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => {
      setConnected(true);
      setError(null);
      if (reason) {
        setEvents((prev) => [...prev, { kind: 'hello', data: `reconnected (${reason})`, ts: new Date().toISOString() }].slice(-maxLines));
      }
    };

    es.onerror = () => {
      // readyState: 0 CONNECTING, 1 OPEN, 2 CLOSED
      setConnected(false);

      // Browser doesn't expose the underlying error; show likely causes.
      setError('Disconnected. Check that /api/admin/logs/stream is reachable and not blocked by CORS/reverse proxy.');

      // Let EventSource attempt its own reconnect, but also force ours if it goes CLOSED.
      if (es.readyState === 2) {
        scheduleReconnect('readyState=CLOSED');
      }
    };

    es.addEventListener('hello', (e) => {
      if (paused) return;
      setEvents((prev) => {
        const next = [...prev, { kind: 'hello', data: e.data, ts: new Date().toISOString() }];
        return next.slice(-maxLines);
      });
    });

    es.addEventListener('log', (e) => {
      if (paused) return;

      if (e.lastEventId) {
        const n = Number(e.lastEventId);
        if (!Number.isNaN(n) && n > lastEventIdRef.current) {
          lastEventIdRef.current = n;
        }
      }

      let parsed;
      try {
        parsed = JSON.parse(e.data);
      } catch (_) {
        parsed = { message: e.data };
      }

      setEvents((prev) => {
        const next = [...prev, { kind: 'log', data: parsed }];
        return next.slice(-maxLines);
      });
    });
  };

  const disconnect = () => {
    clearReconnectTimer();
    closeEventSource();
    setConnected(false);
  };

  useEffect(() => {
    connect({ reason: 'mount' });
    return () => disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If maxLines changes, trim current buffer.
  useEffect(() => {
    setEvents((prev) => prev.slice(-maxLines));
  }, [maxLines]);

  const filtered = useMemo(() => {
    const needle = contains.trim().toLowerCase();
    return events.filter((evt) => {
      if (evt.kind !== 'log') return true;
      const d = evt.data || {};

      if (level !== 'ALL') {
        if ((d.level || '').toUpperCase() !== level) return false;
      }

      if (needle) {
        const hay = JSON.stringify(d).toLowerCase();
        if (!hay.includes(needle)) return false;
      }

      return true;
    });
  }, [events, level, contains]);

  const clear = () => setEvents([]);

  const formatLine = (evt) => {
    if (evt.kind === 'hello') {
      return `[hello] ${evt.data}`;
    }
    const d = evt.data || {};
    const ts = d.timestamp || '';
    const lvl = d.level || '';
    const logger = d.logger || '';
    const msg = d.message || '';
    const thr = d.throwable ? ` | ${d.throwable}` : '';
    return `${ts} ${lvl} ${logger} - ${msg}${thr}`;
  };

  return (
    <div>
      <h3>Live Backend Logs</h3>

      <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
        <div>
          <span className={connected ? 'text-success' : 'text-muted'}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
          {error && <span className="text-danger ms-2">{error}</span>}
        </div>

        { connected &&
            <button className="btn btn-sm btn-outline-secondary" onClick={disconnect}>Disconnect</button>
        }
        { !connected &&
            <button className="btn btn-sm btn-outline-primary" onClick={() => connect({ reason: 'manual reconnect' })}>Reconnect</button>
        }
        <button
          className="btn btn-sm btn-outline-warning"
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? 'Resume' : 'Pause'}
        </button>

        <button className="btn btn-sm btn-outline-danger" onClick={() => setEvents([])}>Clear</button>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <label className="mb-0">Level</label>
        <select
          className="form-select form-select-sm"
          style={{ width: '120px' }}
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="ALL">ALL</option>
          <option value="ERROR">ERROR</option>
          <option value="WARN">WARN</option>
          <option value="INFO">INFO</option>
          <option value="DEBUG">DEBUG</option>
          <option value="TRACE">TRACE</option>
        </select>

        <label className="mb-0">Contains</label>
        <input
          className="form-control form-control-sm"
          style={{ width: '220px' }}
          value={contains}
          onChange={(e) => setContains(e.target.value)}
          placeholder="Search..."
        />

        <label className="mb-0">Max</label>
        <input
          type="number"
          className="form-control form-control-sm"
          style={{ width: '110px' }}
          value={maxLines}
          min={50}
          max={10000}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            setMaxLines(Number.isNaN(v) ? 500 : v);
          }}
        />
      </div>

      <pre
        style={{
          height: '70vh',
          overflow: 'auto',
          background: '#222',
          color: '#eee',
          padding: '12px',
          borderRadius: '6px',
          fontSize: '12px',
          lineHeight: 1.35,
          whiteSpace: 'pre-wrap',
        }}
      >
        {filtered.map((evt, idx) => (
          <div key={evt.kind === 'log' && evt.data && evt.data.id ? evt.data.id : idx}>
            {formatLine(evt)}
          </div>
        ))}
      </pre>
    </div>
  );
};

export default LiveLogs;

