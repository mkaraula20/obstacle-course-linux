// The `mobile_entry_point` macro wires this up as the entry point on iOS/Android,
// while `main.rs` calls it on desktop. One function, every platform.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // The Playwright plugin bridges automation over a Unix socket, since
    // WebKitGTK on Linux has no CDP support. This is a test app, so it is
    // registered unconditionally.
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_playwright::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
