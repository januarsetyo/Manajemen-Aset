# 🌟 Asset Management System (AMS)

![Laravel](https://img.shields.io/badge/Laravel-10.x-red?style=for-the-badge&logo=laravel)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql)
![License](https://img.shields.io/badge/license-Internal-blue?style=for-the-badge)

Sistem **Asset Management System (AMS)** adalah aplikasi berbasis **Laravel (Backend)** dan **React.js (Frontend)** untuk memudahkan pengelolaan data **aset** dan **pegawai** secara efisien.  
Proyek ini digunakan secara **internal** oleh **Kemenko PMK**.

---

## 📂 Struktur Repository

├── backend/ # Laravel backend
├── frontend/ # React.js frontend
└── deliverables/ # File SQL database & dokumentasi tambahan


---

## 🚀 Instalasi & Persiapan

### 🔹 1. Backend (Laravel)

1. **Clone repository branch backend:**
   ```bash
   git clone -b backend https://github.com/januarsetyo/Manajemen-Aset.git backend
   cd backend

Salin file .env:

cp .env.example .env


Sesuaikan konfigurasi database:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=name_database
DB_USERNAME=root
DB_PASSWORD=

Jalankan migrasi & seeder:

php artisan migrate
php artisan db:seed


Jalankan server Laravel:

php artisan serve

## 🚀 Instalasi & Persiapan

### 🔹 2. FrontEnd (React)

1. **Clone repository branch frontend:**
   ```bash
   git clone -b frontend https://github.com/januarsetyo/Manajemen-Aset.git frontend
   cd frontend

   Install Dependencies
   npm install

   Jalankan Frontend
   npm run dev