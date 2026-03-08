import { useState } from 'react';
import type { SpawnResult } from '../types';
import { invoke } from '@tauri-apps/api/core';

function SpawnForm() {
  const [program, setProgram] = useState('');
  const [args, setArgs] = useState('');
  const [cwd, setCwd] = useState('');
  const [result, setResult] = useState<SpawnResult | null>(null);
  const [expanded, setExpanded] = useState(false);

  const handleSpawn = async () => {
    if (!program.trim()) return;
    setResult(null);
    try {
      const argList = args.split(' ').filter((a) => a.trim());
      const res = await invoke<SpawnResult>('spawn_process', {
        program: program.trim(),
        args: argList,
        cwd: cwd.trim() || undefined,
      });
      setResult(res);
      if (res.success) {
        setProgram('');
        setArgs('');
        setCwd('');
      }
    } catch (e) {
      setResult({ success: false, pid: null, error: String(e) });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSpawn();
  };

  return (
    <div className="spawn-form">
      <button
        className="spawn-toggle"
        onClick={() => setExpanded(!expanded)}
      >
        <span className={`toggle-arrow ${expanded ? 'open' : ''}`}>&#9654;</span>
        启动新进程
      </button>
      {expanded && (
        <div className="spawn-body">
          <div className="spawn-fields">
            <input
              type="text"
              className="input"
              placeholder="程序路径，如 notepad.exe"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <input
              type="text"
              className="input"
              placeholder="参数（空格分隔）"
              value={args}
              onChange={(e) => setArgs(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <input
              type="text"
              className="input input-sm"
              placeholder="工作目录（可选）"
              value={cwd}
              onChange={(e) => setCwd(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn btn-primary" onClick={handleSpawn}>
              启动
            </button>
          </div>
          {result && (
            <div className={`toast ${result.success ? 'toast-success' : 'toast-error'}`}>
              {result.success
                ? `启动成功，PID: ${result.pid}`
                : `启动失败: ${result.error}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SpawnForm;
