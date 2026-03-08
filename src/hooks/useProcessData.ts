import { useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import type { ProcessInfo, SystemInfo, ProcessUpdate, ProcessTreeNode } from '../types';

export function useProcessData() {
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    invoke('start_process_updates');

    const unlisten = listen<ProcessUpdate>('process-update', (event) => {
      setProcesses(event.payload.processes);
      setSystemInfo(event.payload.system);
      setLastUpdate(new Date());
    });

    return () => {
      unlisten.then((fn) => fn());
      invoke('stop_process_updates');
    };
  }, []);

  const killProcess = useCallback(async (pid: number) => {
    try {
      await invoke('kill_process', { pid });
    } catch (e) {
      setError(String(e));
    }
  }, []);

  const spawnProcess = useCallback(async (program: string, args: string[], cwd?: string) => {
    try {
      return await invoke('spawn_process', { program, args, cwd });
    } catch (e) {
      setError(String(e));
      return null;
    }
  }, []);

  const setPriority = useCallback(async (pid: number, priority: number) => {
    try {
      await invoke('set_process_priority', { pid, priority });
    } catch (e) {
      setError(String(e));
    }
  }, []);

  const loadProcessTree = useCallback(async () => {
    try {
      return await invoke<ProcessTreeNode[]>('get_process_tree');
    } catch (e) {
      setError(String(e));
      return [];
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    processes,
    systemInfo,
    lastUpdate,
    error,
    killProcess,
    spawnProcess,
    setPriority,
    loadProcessTree,
    clearError,
  };
}
