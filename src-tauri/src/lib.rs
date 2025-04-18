// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
// Import functionalities we'll be using
// use std::sync::Mutex;
use tauri::async_runtime::spawn;
use tauri::{AppHandle, Manager};
use tauri_plugin_sql::{Migration, MigrationKind};
use tauri_plugin_store::StoreExt;

// Create a struct we'll use to track the completion of
// setup related tasks
// struct SetupState {
//     frontend_task: bool,
//     backend_task: bool,
// }

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenv::dotenv().ok();

    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "0000_solid_nova",
            sql: include_str!("../../drizzle/0000_solid_nova.sql"),
            kind: MigrationKind::Up,
        },
    ];

    tauri::Builder::default()
        // .manage(Mutex::new(SetupState {
        //     frontend_task: false,
        //     backend_task: false,
        // }))
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(
            tauri_plugin_sql::Builder::new()
                .add_migrations(get_env("DATABASE_URL").as_str(), migrations)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_env, close_init])
        .setup(|app| {
            // Spawn setup as a non-blocking task so the windows can be
            // created and ran while it executes
            spawn(setup(app.handle().clone()));
            // The hook expects an Ok result
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_env(name: &str) -> String {
    std::env::var(String::from(name)).unwrap_or(String::from(""))
}

// A custom task for setting the state of a setup task
#[tauri::command]
fn close_init(app: AppHandle) -> String {
    let init_window = app.get_webview_window("init").unwrap();
    let main_window = app.get_webview_window("main").unwrap();
    init_window.close().unwrap();
    main_window.show().unwrap();
    format!("Hello, {}! You've been greeted from Rust!", "Rayat")
}

// An async function that does some heavy setup task
async fn setup(app: AppHandle) -> Result<(), ()> {
    let store = app.store(get_env("STORE_URL")).map_err(|_| ())?;
    // store.clear();
    // Note that values must be serde_json::Value instances,
    // otherwise, they will not be compatible with the JavaScript bindings.
    if store.has("productKey") {
        // If the product key is already set, we can skip the setup
        // and just show the main window
        close_init(app.clone());
        // Remove the store from the resource table
        store.close_resource();
        return Ok(());
    }
    // Remove the store from the resource table
    store.close_resource();
    // Fake performing some heavy action for 3 seconds
    println!("Performing really heavy backend setup task...");
    println!("Backend setup task completed!");
    // Set the backend task as being completed
    // Commands can be ran as regular functions as long as you take
    // care of the input arguments yourself
    // close_init(app.clone());
    Ok(())
}
