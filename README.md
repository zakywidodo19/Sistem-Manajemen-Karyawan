# Sistem Manajemen Karyawan

Aplikasi frontend untuk manajemen data karyawan yang dibangun menggunakan React, Vite, Tailwind CSS, dan Redux Toolkit. Aplikasi ini menyediakan fitur autentikasi, dashboard statistik, serta CRUD (Create, Read, Update, Delete) untuk data karyawan.

---

## 🚀 Fitur Utama

- Autentikasi JWT (Login/Logout)
- Proteksi route berdasarkan role (Admin, HR Manager)
- Dashboard dengan statistik (total karyawan, aktif, non-aktif, total gaji, rata-rata gaji)
- Visualisasi statistik departemen (menggunakan Recharts)
- Manajemen karyawan: daftar, detail, tambah, edit, hapus
- Pencarian, filter (departemen, status), pengurutan, dan paginasi
- Penanganan error, loading, dan empty state
- Notifikasi toast untuk operasi sukses/gagal
- Axios interceptor untuk menangani 401 dan refresh token (jika diimplementasikan)

---

## 🛠 Teknologi

- React 19 + Vite
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- React Hook Form
- Axios
- Recharts
- React Toastify

---

## 📦 Cara Menjalankan (Development)

1. Clone repository

```bash
git clone https://github.com/zakywidodo19/Sistem-Manajemen-Karyawan.git
cd Sistem-Manajemen-Karyawan
```

2. Install dependencies

```bash
npm install
```

3. Buat file environment

Buat file `.env` di root (sesuaikan URL API Anda):

```env
VITE_API_URL=https://API_YANG_DIGUNAKAN
```

4. Jalankan server development

```bash
npm run dev
```

5. Build untuk production

```bash
npm run build
```

---

## ⚙️ Script NPM

- npm run dev — jalankan development server (Vite)
- npm run build — build produksi
- npm run preview — preview build produksi
- npm run lint — jalankan ESLint

---

## 🔐 Akun Tes (Contoh)

Gunakan kredensial ini hanya sebagai contoh jika backend mendukungnya:

- Admin
  - Email: admin@gmail.com
  - Password: Admin123456

- HR Manager
  - Email: hr@gmail.com
  - Password: Hr123456

Jika aplikasi Anda menggunakan akun berbeda, sesuaikan bagian ini.

---

## 📁 Struktur Proyek (Singkat)

src/
├── api/ (axios instance & modul API)
├── components/ (komponen UI, layout, form, table)
├── pages/ (Login, Dashboard, EmployeeList, EmployeeDetail, Create/Edit)
├── routes/ (ProtectedRoute, AppRoutes)
├── store/ (Redux Toolkit slices & store)
├── hooks/ (custom hooks)
├── utils/ (helper & formatter)
└── main.jsx, App.jsx

---

## 🔗 Endpoint API (Contoh)

- POST /api/auth/login — login
- GET /api/dashboard — data dashboard
- GET /api/employees — daftar karyawan
- GET /api/employees/:id — detail karyawan
- POST /api/employees — buat karyawan
- PUT /api/employees/:id — update karyawan
- DELETE /api/employees/:id — hapus karyawan

Sesuaikan path endpoint dengan backend yang Anda gunakan.

---

## ✅ Catatan

- Periksa file `package.json` untuk melihat dependensi dan script.
- Jika ada fitur tambahan (dark mode, TanStack Query, unit test), tambahkan dokumentasinya di README ini.

---

## 👨‍💻 Author

Dikembangkan oleh zakywidodo19 untuk aplikasi Sistem Manajemen Karyawan.
