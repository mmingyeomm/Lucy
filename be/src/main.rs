use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use std::thread;

#[derive(Deserialize)]
struct ContractRequest {
    contract_code: String,
}

#[derive(Serialize)]
struct DeployResponse {
    contract_address: String,
    status: String,
}

async fn deploy_contract(contract: web::Json<ContractRequest>) -> impl Responder {
    println!("Received contract to deploy: {}", contract.contract_code);
    
    // Simulate deployment process with a delay
    thread::sleep(Duration::from_secs(2));
    
    // In a real implementation, this would actually deploy the contract to Solana
    // For now, we're just returning a mock address
    let mock_address = "CgaTAMXGKEWPVWuSqFfWKhFJpZ7TxU2YpwvDMZVt8Zhb";
    
    HttpResponse::Ok().json(DeployResponse {
        contract_address: mock_address.to_string(),
        status: "success".to_string(),
    })
}

async fn health_check() -> impl Responder {
    HttpResponse::Ok().body("Service is running")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting Solana contract deployment backend server...");
    
    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
            
        App::new()
            .wrap(cors)
            .route("/health", web::get().to(health_check))
            .route("/deploy", web::post().to(deploy_contract))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
