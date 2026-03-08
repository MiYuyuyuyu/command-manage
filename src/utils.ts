export function formatMemory(bytes: number): string {
  if (bytes === 0) return '0 B';
  const gb = bytes / (1024 * 1024 * 1024);
  if (gb >= 1) return `${gb.toFixed(1)} GB`;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${kb.toFixed(1)} KB`;
}

export function formatUptime(seconds: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - seconds;
  if (diff < 60) return `${diff}秒`;
  if (diff < 3600) return `${Math.floor(diff / 60)}分钟`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}小时`;
  return `${Math.floor(diff / 86400)}天`;
}

export function getStatusLabel(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('run')) return '运行中';
  if (s.includes('sleep')) return '休眠';
  if (s.includes('stop')) return '已停止';
  if (s.includes('zombie')) return '僵尸';
  if (s.includes('idle')) return '空闲';
  return status;
}

export function getStatusClass(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('run')) return 'running';
  if (s.includes('sleep')) return 'sleeping';
  if (s.includes('stop')) return 'stopped';
  if (s.includes('zombie')) return 'zombie';
  return 'other';
}
