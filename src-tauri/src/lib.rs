// The `mobile_entry_point` macro wires this up as the entry point on iOS/Android,
// while `main.rs` calls it on desktop. One function, every platform.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
