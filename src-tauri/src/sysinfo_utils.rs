use sysinfo::{Process, System};

use crate::models::{ProcessInfo, SystemInfo};

pub fn process_to_info(process: &Process, _system: &System) -> ProcessInfo {
    ProcessInfo {
        pid: process.pid().as_u32(),
        name: process.name().to_string_lossy().to_string(),
        exe: process
            .exe()
            .map(|e| e.to_string_lossy().to_string())
            .unwrap_or_default(),
        cmd: process
            .cmd()
            .iter()
            .map(|s| s.to_string_lossy().to_string())
            .collect(),
        status: format!("{:?}", process.status()),
        cpu_usage: process.cpu_usage(),
        memory: process.memory(),
        start_time: process.start_time(),
        parent_pid: process.parent().map(|p| p.as_u32()),
    }
}

pub fn collect_system_info() -> SystemInfo {
    let mut system = System::new_all();
    system.refresh_all();

    SystemInfo {
        total_memory: system.total_memory(),
        used_memory: system.used_memory(),
        total_swap: system.total_swap(),
        used_swap: system.used_swap(),
        cpu_count: system.cpus().len(),
        os_name: System::name().unwrap_or_default(),
        os_version: System::os_version().unwrap_or_default(),
        host_name: System::host_name().unwrap_or_default(),
    }
}
