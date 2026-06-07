# Rullst ORM 🦀

[![Crates.io](https://img.shields.io/crates/v/rullst.svg)](https://crates.io/crates/rullst)
[![Documentation](https://docs.rs/rullst/badge.svg)](https://docs.rs/rullst)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE)

An elegant, async-first **ActiveRecord ORM** for Rust, bringing the intuitive design, developer experience (DX), and fluent expressiveness of Laravel Eloquent to the high-performance Rust ecosystem. Built on top of `SQLx` and fully integrated with `Redis` for automatic caching.

---

## ✨ Features

- **ActiveRecord Pattern**: Manage database records directly using intuitive struct methods (`::find()`, `.save()`, `.delete()`).
- **Fluent Query Builder**: Build complex, safe queries via a descriptive chainable DSL with compile-time type validation.
- **Under-the-Hood Parameterization**: Built-in protection against SQL Injection using fully prepared statements (`$1`, `$2`...).
- **Automatic Redis Caching Layer**: Direct intercept caching via `.cache(seconds)` to read from memory in microseconds.
- **Connection Pool Splitting**: Seamless routing directing write operations to your primary master db and read operations to fail-safe replicas.
- **Memory-Safe Chunks**: Easily process millions of rows in small lazy batches with `chunk` loops to prevent RAM overhead.
- **Artisan-Style CLI Tools**: Scaffolder CLI to create models, write migrations, seed tables, and check database driver status.

---

## 🛠️ Installation

Add `rullst` to your Cargo.toml dependencies. Rullst integrates cleanly with asynchronous runtimes like `tokio`:

```toml
[dependencies]
rullst = "0.1.0"
tokio = { version = "1.0", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
```

---

## 🚀 Quick Start

### 1. Configure Your Database URL
Create a `.env` configuration file at the root of your workspace:

```bash
# PostgreSQL Connection pool (Master write-pool)
DATABASE_URL="postgres://postgres:secure_password@localhost:5432/my_app"

# (Optional) Redis Cache Host
REDIS_URL="redis://127.0.0.1:6379"
```

### 2. Connect Your App Pool
Initialize connection pools dynamically at your application's entrypoint:

```rust
use rullst::prelude::*;

#[tokio::main]
async fn main() -> Result<(), RullstError> {
    // Automatically configures PostgreSQL/MySQL/SQLite and Redis pools
    Rullst::connect().await?;
    
    println!("🚀 Rullst ORM successfully connected to database driver pool!");
    Ok(())
}
```

### 3. Declare Your ActiveRecord Struct
Use procedural macro attributes to model your schemas:

```rust
use rullst::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(ActiveRecord, Serialize, Deserialize, Debug, Clone)]
#[table = "users"]                   // Table name (defaults to pluralized struct name)
#[primary_key = "id"]                // Primary key column
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub active: bool,
}
```

---

## 🧑‍💻 Usage Examples

### Easy CRUD Operations
```rust
// 1. SELECT (Fetch by Primary Key)
let mut user = User::find(12).await?;

// 2. UPDATE (Mutate and persist)
user.name = "Venelouis".to_string();
user.save().await?;

// 3. CREATE (Instantiate and insert)
let mut new_profile = User::new();
new_profile.name = "John Doe".to_string();
new_profile.email = "john@rullst.dev".to_string();
new_profile.save().await?; // Schema will auto-populate the incremental primary key

// 4. DELETE (Remove record)
new_profile.delete().await?;
```

### Chained Query Builder (Fluent DSL)
```rust
let active_posts = Post::query()
    .where("status", "=", "published")
    .where_not_null("published_at")
    .where_in("category_id", vec![1, 5, 12])
    .order_by("published_at", "DESC")
    .limit(10)
    .get()
    .await?;
```

### Instant Redis Caching
Avoid overloading your main SQL database pools for heavy repetitive reads:

```rust
// The query is cached in Redis for 120 seconds. 
// Consecutive reads bypass database lookups entirely!
let app_settings = Config::query()
    .where("group", "=", "features")
    .cache(120)
    .first()
    .await?;
```

---

## 🛠️ CLI Interface Commands

Manage your development cycle through direct artisan command hooks:

```bash
# Apply pending schemas and migrations
rullst migrate

# Generate a new clean SQL schema migration
rullst make:migration create_users_table

# Scaffold a database model blueprint
rullst make:model Post

# Seed realistic tables mock data
rullst db:seed

# Review driver connectivity (PostgreSQL, MySQL, SQLite, Redis)
rullst status
```

---

## 🤝 Contributing

We welcome contributions to the **Rullst** project of all levels! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork this Repository
2. Create your Feature Branch (`git checkout -b feature/cool-orm-extension`)
3. Commit your changes (`git commit -m 'feat: Add advanced group_by support'`)
4. Push to the Branch (`git push origin feature/cool-orm-extension`)
5. Open a Pull Request

---

## 📄 License

This library is licensed under the [MIT License](LICENSE).
