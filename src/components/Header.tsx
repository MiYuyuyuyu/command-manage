import type { SystemInfo } from '../types';
import { formatMemory } from '../utils';

interface HeaderProps {
  systemInfo: SystemInfo | null;
  lastUpdate: Date | null;
  processCount: number;
}

function Header({ systemInfo, lastUpdate, processCount }: HeaderProps) {
  const memPercent = systemInfo
    ? (systemInfo.used_memory / systemInfo.total_memory) * 100
    : 0;

  const getMemColor = (pct: number) => {
    if (pct > 85) return 'var(--color-danger)';
    if (pct > 60) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="app-title">Process Manager</h1>
        {lastUpdate && (
          <span className="update-badge">
            <span className="pulse-dot" />
            {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>
      {systemInfo && (
        <div className="header-metrics">
          <div className="metric">
            <span className="metric-label">进程</span>
            <span className="metric-value">{processCount}</span>
          </div>
          <div className="metric">
            <span className="metric-label">CPU</span>
            <span className="metric-value">{systemInfo.cpu_count} 核</span>
          </div>
          <div className="metric">
            <span className="metric-label">内存</span>
            <span className="metric-value">
              {formatMemory(systemInfo.used_memory)} / {formatMemory(systemInfo.total_memory)}
            </span>
            <div className="metric-bar">
              <div
                className="metric-bar-fill"
                style={{
                  width: `${memPercent}%`,
                  background: getMemColor(memPercent),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
