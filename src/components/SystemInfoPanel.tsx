import type { SystemInfo } from '../types';
import { formatMemory } from '../utils';

interface SystemInfoPanelProps {
  systemInfo: SystemInfo | null;
}

function SystemInfoPanel({ systemInfo }: SystemInfoPanelProps) {
  if (!systemInfo) {
    return <div className="empty-state">等待系统数据...</div>;
  }

  const memPercent = (systemInfo.used_memory / systemInfo.total_memory) * 100;
  const swapPercent = systemInfo.total_swap > 0
    ? (systemInfo.used_swap / systemInfo.total_swap) * 100
    : 0;

  return (
    <div className="sysinfo-panel">
      <div className="sysinfo-cards">
        <div className="sysinfo-card">
          <div className="sysinfo-card-header">操作系统</div>
          <div className="sysinfo-card-value">
            {systemInfo.os_name}
          </div>
          <div className="sysinfo-card-sub">{systemInfo.os_version}</div>
        </div>

        <div className="sysinfo-card">
          <div className="sysinfo-card-header">主机名</div>
          <div className="sysinfo-card-value">{systemInfo.host_name}</div>
        </div>

        <div className="sysinfo-card">
          <div className="sysinfo-card-header">CPU</div>
          <div className="sysinfo-card-value">{systemInfo.cpu_count}</div>
          <div className="sysinfo-card-sub">逻辑核心</div>
        </div>
      </div>

      <div className="sysinfo-bars">
        <div className="sysinfo-bar-group">
          <div className="sysinfo-bar-header">
            <span>内存使用</span>
            <span className="sysinfo-bar-value">
              {formatMemory(systemInfo.used_memory)} / {formatMemory(systemInfo.total_memory)}
              <span className="sysinfo-pct">({memPercent.toFixed(1)}%)</span>
            </span>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill bar-fill-mem"
              style={{ width: `${memPercent}%` }}
            />
          </div>
        </div>

        <div className="sysinfo-bar-group">
          <div className="sysinfo-bar-header">
            <span>Swap 使用</span>
            <span className="sysinfo-bar-value">
              {formatMemory(systemInfo.used_swap)} / {formatMemory(systemInfo.total_swap)}
              {systemInfo.total_swap > 0 && (
                <span className="sysinfo-pct">({swapPercent.toFixed(1)}%)</span>
              )}
            </span>
          </div>
          <div className="bar-track">
            <div
              className="bar-fill bar-fill-swap"
              style={{ width: `${swapPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemInfoPanel;
