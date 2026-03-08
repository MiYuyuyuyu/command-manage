import type { ProcessInfo } from '../types';
import { formatMemory, formatUptime, getStatusLabel, getStatusClass } from '../utils';

interface ProcessDetailProps {
  process: ProcessInfo;
  onClose: () => void;
  onKill: (pid: number) => void;
}

function ProcessDetail({ process, onClose, onKill }: ProcessDetailProps) {
  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="detail-header">
          <h3>{process.name}</h3>
          <button className="btn-close" onClick={onClose}>&#10005;</button>
        </div>
        <div className="detail-body">
          <div className="detail-grid">
            <div className="detail-item">
              <label>PID</label>
              <span className="mono">{process.pid}</span>
            </div>
            <div className="detail-item">
              <label>状态</label>
              <span className={`badge badge-${getStatusClass(process.status)}`}>
                {getStatusLabel(process.status)}
              </span>
            </div>
            <div className="detail-item">
              <label>CPU 使用率</label>
              <span>{process.cpu_usage.toFixed(1)}%</span>
            </div>
            <div className="detail-item">
              <label>内存占用</label>
              <span>{formatMemory(process.memory)}</span>
            </div>
            <div className="detail-item">
              <label>父进程 PID</label>
              <span className="mono">{process.parent_pid ?? '-'}</span>
            </div>
            <div className="detail-item">
              <label>运行时间</label>
              <span>{process.start_time > 0 ? formatUptime(process.start_time) : '-'}</span>
            </div>
          </div>
          <div className="detail-section">
            <label>可执行文件路径</label>
            <div className="detail-path">{process.exe || '-'}</div>
          </div>
          {process.cmd.length > 0 && (
            <div className="detail-section">
              <label>启动命令</label>
              <div className="detail-cmd">{process.cmd.join(' ')}</div>
            </div>
          )}
        </div>
        <div className="detail-footer">
          <button className="btn btn-danger" onClick={() => onKill(process.pid)}>
            终止进程
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProcessDetail;
