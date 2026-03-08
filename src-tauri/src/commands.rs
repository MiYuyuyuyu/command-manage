use std::collections::HashMap;
use std::process::Command;
use sysinfo::{Pid, System};

use crate::models::{ProcessInfo, ProcessTreeNode, SpawnResult, SystemInfo};
use crate::sysinfo_utils;

#[tauri::command]
pub fn spawn_process(program: String, args: Vec<String>, cwd: Option<String>) -> SpawnResult {
    let mut cmd = Command::new(&program);
    cmd.args(&args);
    if let Some(work_dir) = cwd {
        cmd.current_dir(work_dir);
    }

    match cmd.spawn() {
        Ok(child) => SpawnResult {
            success: true,
            pid: Some(child.id()),
            error: None,
        },
        Err(e) => SpawnResult {
            success: false,
            pid: None,
            error: Some(e.to_string()),
        },
    }
}

#[tauri::command]
pub fn kill_process(pid: u32) -> Result<bool, String> {
    let system = System::new_all();
    if let Some(process) = system.process(Pid::from_u32(pid)) {
        Ok(process.kill())
    } else {
        Err(format!("PID {} 对应的进程未找到", pid))
    }
}

#[tauri::command]
pub fn list_processes() -> Vec<ProcessInfo> {
    let system = System::new_all();
    system
        .processes()
        .iter()
        .map(|(_, process)| sysinfo_utils::process_to_info(process, &system))
        .collect()
}

#[tauri::command]
pub fn get_process_info(pid: u32) -> Result<ProcessInfo, String> {
    let system = System::new_all();
    system
        .process(Pid::from_u32(pid))
        .map(|p| sysinfo_utils::process_to_info(p, &system))
        .ok_or_else(|| format!("PID {} 对应的进程未找到", pid))
}

#[tauri::command]
pub fn get_process_tree() -> Vec<ProcessTreeNode> {
    let system = System::new_all();
    let processes: HashMap<u32, ProcessInfo> = system
        .processes()
        .iter()
        .map(|(_, p)| (p.pid().as_u32(), sysinfo_utils::process_to_info(p, &system)))
        .collect();

    let mut children_map: HashMap<Option<u32>, Vec<u32>> = HashMap::new();
    for info in processes.values() {
        children_map
            .entry(info.parent_pid)
            .or_default()
            .push(info.pid);
    }

    fn build_tree(
        pid: Option<u32>,
        processes: &HashMap<u32, ProcessInfo>,
        children_map: &HashMap<Option<u32>, Vec<u32>>,
    ) -> Option<ProcessTreeNode> {
        let current_pid = pid?;
        let process_info = processes.get(&current_pid)?.clone();
        let children_pids = children_map
            .get(&Some(current_pid))
            .cloned()
            .unwrap_or_default();

        let children: Vec<ProcessTreeNode> = children_pids
            .iter()
            .filter_map(|&cpid| build_tree(Some(cpid), processes, children_map))
            .collect();

        Some(ProcessTreeNode {
            process: process_info,
            children,
        })
    }

    let root_pids = children_map.get(&None).cloned().unwrap_or_default();
    root_pids
        .iter()
        .filter_map(|&pid| build_tree(Some(pid), &processes, &children_map))
        .collect()
}

#[tauri::command]
pub fn set_process_priority(pid: u32, priority: i32) -> Result<bool, String> {
    #[cfg(target_os = "windows")]
    {
        let output = Command::new("wmic")
            .args([
                "process",
                "where",
                &format!("ProcessId={}", pid),
                "CALL",
                "setpriority",
                &priority.to_string(),
            ])
            .output()
            .map_err(|e| e.to_string())?;
        Ok(output.status.success())
    }

    #[cfg(not(target_os = "windows"))]
    {
        let pid_nice = match priority {
            -20..=-1 => priority,
            0..=19 => priority + 20,
            _ => return Err("优先级必须在 -20 到 19 之间".to_string()),
        };

        let output = Command::new("nice")
            .arg("-n")
            .arg(pid_nice.to_string())
            .arg("-p")
            .arg(pid.to_string())
            .output()
            .map_err(|e| e.to_string())?;

        Ok(output.status.success())
    }
}

#[tauri::command]
pub fn get_system_info_cmd() -> SystemInfo {
    sysinfo_utils::collect_system_info()
}
