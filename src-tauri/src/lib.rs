// The `mobile_entry_point` macro wires this up as the entry point on iOS/Android,
// while `main.rs` calls it on desktop. One function, every platform.
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default().plugin(tauri_plugin_opener::init());

    // The Playwright E2E plugin is compiled and registered only under the
    // `e2e-testing` feature, so it never ships in production builds. The matching
    // capability lives in `tauri.e2e.conf.json` (merged via --config for tests),
    // not in the always-loaded `capabilities/` dir.
    #[cfg(feature = "e2e-testing")]
    {
        builder = builder.plugin(tauri_plugin_playwright::init());
    }

    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
