mod commands;
mod models;
mod monitor;
mod sysinfo_utils;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::spawn_process,
            commands::kill_process,
            commands::list_processes,
            commands::get_process_info,
            commands::get_process_tree,
            commands::set_process_priority,
            commands::get_system_info_cmd,
            monitor::start_process_updates,
            monitor::stop_process_updates,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
