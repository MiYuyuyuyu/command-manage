import { useState, useMemo } from 'react';
import type { ProcessInfo, SortField, SortDirection } from '../types';
import { formatMemory, formatUptime, getStatusLabel, getStatusClass } from '../utils';

interface ProcessTableProps {
  processes: ProcessInfo[];
  searchTerm: string;
  onKill: (pid: number) => void;
  onPriorityUp: (pid: number) => void;
  onPriorityDown: (pid: number) => void;
  onSelect: (process: ProcessInfo) => void;
}

function ProcessTable({
  processes,
  searchTerm,
  onKill,
  onPriorityUp,
  onPriorityDown,
  onSelect,
}: ProcessTableProps) {
  const [sortField, setSortField] = useState<SortField>('memory');
  const [sortDir, setSortDir] = useState<SortDirection>('desc');
  const [confirmKill, setConfirmKill] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return processes.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.pid.toString().includes(term) ||
        p.exe.toLowerCase().includes(term)
    );
  }, [processes, searchTerm]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'pid': cmp = a.pid - b.pid; break;
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'cpu_usage': cmp = a.cpu_usage - b.cpu_usage; break;
        case 'memory': cmp = a.memory - b.memory; break;
        case 'status': cmp = a.status.localeCompare(b.status); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return ' ';
    return sortDir === 'asc' ? ' ▲' : ' ▼';
  };

  const handleKillClick = (pid: number) => {
    if (confirmKill === pid) {
      onKill(pid);
      setConfirmKill(null);
    } else {
      setConfirmKill(pid);
      setTimeout(() => setConfirmKill(null), 3000);
    }
  };

  const getCpuColor = (usage: number): string => {
    if (usage > 80) return 'var(--color-danger)';
    if (usage > 40) return 'var(--color-warning)';
    if (usage > 0) return 'var(--color-success)';
    return 'var(--text-muted)';
  };

  return (
    <div className="process-table-wrap">
      <table className="process-table">
        <thead>
          <tr>
            <th className="col-pid sortable" onClick={() => handleSort('pid')}>
              PID{getSortIcon('pid')}
            </th>
            <th className="col-name sortable" onClick={() => handleSort('name')}>
              名称{getSortIcon('name')}
            </th>
            <th className="col-path">路径</th>
            <th className="col-status sortable" onClick={() => handleSort('status')}>
              状态{getSortIcon('status')}
            </th>
            <th className="col-cpu sortable" onClick={() => handleSort('cpu_usage')}>
              CPU{getSortIcon('cpu_usage')}
            </th>
            <th className="col-mem sortable" onClick={() => handleSort('memory')}>
              内存{getSortIcon('memory')}
            </th>
            <th className="col-uptime">运行时间</th>
            <th className="col-actions">操作</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr key={p.pid} onClick={() => onSelect(p)} className="process-row">
              <td className="cell-pid">{p.pid}</td>
              <td className="cell-name">{p.name}</td>
              <td className="cell-path" title={p.exe}>{p.exe || '-'}</td>
              <td>
                <span className={`badge badge-${getStatusClass(p.status)}`}>
                  {getStatusLabel(p.status)}
                </span>
              </td>
              <td>
                <span className="cell-cpu" style={{ color: getCpuColor(p.cpu_usage) }}>
                  {p.cpu_usage.toFixed(1)}%
                </span>
              </td>
              <td className="cell-mem">{formatMemory(p.memory)}</td>
              <td className="cell-uptime">{p.start_time > 0 ? formatUptime(p.start_time) : '-'}</td>
              <td className="cell-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className={`btn btn-xs ${confirmKill === p.pid ? 'btn-danger-solid' : 'btn-danger'}`}
                  onClick={() => handleKillClick(p.pid)}
                  title={confirmKill === p.pid ? '再次点击确认终止' : '终止进程'}
                >
                  {confirmKill === p.pid ? '确认?' : '终止'}
                </button>
                <button
                  className="btn btn-xs btn-ghost"
                  onClick={() => onPriorityDown(p.pid)}
                  title="提高优先级"
                >
                  ▲ 优先
                </button>
                <button
                  className="btn btn-xs btn-ghost"
                  onClick={() => onPriorityUp(p.pid)}
                  title="降低优先级"
                >
                  ▼ 降级
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="empty-state">没有匹配的进程</div>
      )}
    </div>
  );
}

export default ProcessTable;
