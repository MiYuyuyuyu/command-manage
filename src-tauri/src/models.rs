use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProcessInfo {
    pub pid: u32,
    pub name: String,
    pub exe: String,
    pub cmd: Vec<String>,
    pub status: String,
    pub cpu_usage: f32,
    pub memory: u64,
    pub start_time: u64,
    pub parent_pid: Option<u32>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ProcessTreeNode {
    pub process: ProcessInfo,
    pub children: Vec<ProcessTreeNode>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SpawnResult {
    pub success: bool,
    pub pid: Option<u32>,
    pub error: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct SystemInfo {
    pub total_memory: u64,
    pub used_memory: u64,
    pub total_swap: u64,
    pub used_swap: u64,
    pub cpu_count: usize,
    pub os_name: String,
    pub os_version: String,
    pub host_name: String,
}

#[derive(Debug, Serialize, Clone)]
pub struct ProcessUpdate {
    pub processes: Vec<ProcessInfo>,
    pub system: SystemInfo,
}
