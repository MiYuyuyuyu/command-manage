export interface ProcessInfo {
  pid: number;
  name: string;
  exe: string;
  cmd: string[];
  status: string;
  cpu_usage: number;
  memory: number;
  start_time: number;
  parent_pid: number | null;
}

export interface ProcessTreeNode {
  process: ProcessInfo;
  children: ProcessTreeNode[];
}

export interface SpawnResult {
  success: boolean;
  pid: number | null;
  error: string | null;
}

export interface SystemInfo {
  total_memory: number;
  used_memory: number;
  total_swap: number;
  used_swap: number;
  cpu_count: number;
  os_name: string;
  os_version: string;
  host_name: string;
}

export interface ProcessUpdate {
  processes: ProcessInfo[];
  system: SystemInfo;
}

export type TabType = 'list' | 'tree' | 'system';

export type SortField = 'pid' | 'name' | 'cpu_usage' | 'memory' | 'status';
export type SortDirection = 'asc' | 'desc';
