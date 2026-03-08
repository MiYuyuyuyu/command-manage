use std::sync::atomic::{AtomicBool, Ordering};
use std::thread;
use std::time::Duration;
use sysinfo::System;
use tauri::{AppHandle, Emitter};

use crate::models::{ProcessInfo, ProcessUpdate};
use crate::sysinfo_utils;

static RUNNING: AtomicBool = AtomicBool::new(false);

fn start_update_loop(app_handle: AppHandle) {
    thread::spawn(move || {
        while RUNNING.load(Ordering::SeqCst) {
            let mut system = System::new_all();
            system.refresh_all();

            let processes: Vec<ProcessInfo> = system
                .processes()
                .iter()
                .map(|(_, process)| sysinfo_utils::process_to_info(process, &system))
                .collect();

            let system_info = sysinfo_utils::collect_system_info();

            let update = ProcessUpdate {
                processes,
                system: system_info,
            };

            let _ = app_handle.emit("process-update", update);
            thread::sleep(Duration::from_secs(2));
        }
    });
}

#[tauri::command]
pub fn start_process_updates(app_handle: AppHandle) -> bool {
    if RUNNING.load(Ordering::SeqCst) {
        return true;
    }
    RUNNING.store(true, Ordering::SeqCst);
    start_update_loop(app_handle);
    true
}

#[tauri::command]
pub fn stop_process_updates() -> bool {
    RUNNING.store(false, Ordering::SeqCst);
    true
}
