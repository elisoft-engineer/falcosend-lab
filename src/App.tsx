import React, { useState } from 'react';
import { FalcoSend } from 'falcosend-sdk';
import './App.css';

export default function App() {
  const [key, setKey] = useState('');
  const [form, setForm] = useState('contact_v1');
  const [payload, setPayload] = useState('{\n  "email": "elkana@dev.local",\n  "subject": "Testing SDK Link",\n  "message": "Light theme looks clean!"\n}');
  const [logs, setLogs] = useState<{ id: number; text: string; type: 'cmd' | 'err' | 'ok' }[]>([]);
  const [isSending, setIsSending] = useState(false);

  const addLog = (text: string, type: 'cmd' | 'err' | 'ok' = 'cmd') => {
    setLogs(prev => [{ id: Date.now(), text, type }, ...prev].slice(0, 10));
  };

  const handleSend = async () => {
    if (!key) return addLog('WARNING: Enter a submission key', 'err');
    setIsSending(true);
    addLog(`INIT: Transmitting to [${form}]...`);

    try {
      const sdk = new FalcoSend({ submissionKey: key });
      const data = JSON.parse(payload);
      const res = await sdk.submit({ form_name: form, data });
      addLog(`SUCCESS: Data accepted. ID: ${res.id || 'OK'}`, 'ok');
    } catch (err: any) {
      addLog(`ERROR: ${err.message}`, 'err');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="app-container">
      <header className="glass-header">
        <div className="logo">FALCO<span>SEND</span> <small>LABS</small></div>
        <div className="status-bit">GATEWAY ACTIVE</div>
      </header>

      <main className="dashboard">
        <section className="config-panel glass">
          <div className="panel-label">SETTINGS</div>
          <div className="input-group">
            <label>API Key</label>
            <input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="fs_..." />
          </div>
          <div className="input-group">
            <label>Form Name</label>
            <input type="text" value={form} onChange={e => setForm(e.target.value)} />
          </div>
          
          <div className="terminal-log">
            {logs.length === 0 && <div className="log-entry cmd">Waiting for transmission...</div>}
            {logs.map(log => (
              <div key={log.id} className={`log-entry ${log.type}`}>
                {log.text}
              </div>
            ))}
          </div>
        </section>

        <section className="editor-panel glass">
          <div className="panel-label">JSON PAYLOAD</div>
          <textarea 
            value={payload} 
            onChange={e => setPayload(e.target.value)} 
            spellCheck="false"
          />
          <button 
            className={`launch-btn ${isSending ? 'pulse' : ''}`} 
            onClick={handleSend}
            disabled={isSending}
          >
            {isSending ? 'Sending Request...' : 'Send Test Submission'}
          </button>
        </section>
      </main>
    </div>
  );
}