# Sistem Manajemen Karyawan

Aplikasi frontend untuk manajemen data karyawan yang dibangun menggunakan React, Vite, Tailwind CSS, dan Redux Toolkit. Aplikasi ini menyediakan fitur autentikasi, dashboard statistik, CRUD karyawan, serta manajemen cuti dengan alur pengajuan dan persetujuan.

---

## 🚀 Fitur Utama

- Autentikasi JWT (Login/Logout)
- Proteksi route berdasarkan role (Admin, HR Manager)
- Dashboard dengan statistik (total karyawan, aktif, non-aktif, total gaji, rata-rata gaji)
- Visualisasi statistik departemen (menggunakan Recharts)
- Manajemen karyawan: daftar, detail, tambah, edit, hapus
- Manajemen cuti: pengajuan cuti, approval/reject, riwayat cuti, sisa cuti
- Pencarian, filter (departemen, status, tipe cuti), pengurutan, dan paginasi
- Penanganan error, loading, dan empty state
- Notifikasi toast untuk operasi sukses/gagal
- Axios interceptor untuk menangani 401 dan refresh token (jika diimplementasikan)

---

## ✈️ Fitur Cuti (Leave Management)

- Pengguna dapat mengajukan cuti dengan memilih tipe (Tahunan, Sakit, Izin, dll.), rentang tanggal, dan keterangan
- HR / Manager dapat melihat daftar pengajuan cuti dan melakukan Approve / Reject
- Status cuti: Pending, Approved, Rejected, Cancelled
- Riwayat cuti per karyawan dan laporan sisa cuti
- Validasi tumpang tindih tanggal dan batasan sisa cuti
- Upload lampiran (mis. surat sakit) pada pengajuan cuti

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
│   ├── authApi.js
│   ├── dashboardApi.js
│   ├── employeeApi.js
│   └── leaveApi.js  <-- modul API untuk cuti
├── components/ (komponen UI, layout, form, table)
├── pages/ (Login, Dashboard, EmployeeList, EmployeeDetail, Create/Edit, Leaves)
│   └── leaves/
│       ├── LeaveList.jsx
│       ├── LeaveDetail.jsx
│       ├── CreateLeave.jsx
│       └── ApproveLeave.jsx
├── routes/ (ProtectedRoute, AppRoutes)
├── store/ (Redux Toolkit slices & store)
│   └── slices/
│       ├── authSlice.js
│       ├── employeeSlice.js
│       ├── dashboardSlice.js
│       └── leaveSlice.js  <-- state untuk cuti
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

### Endpoint Cuti
- GET    /api/leaves — daftar pengajuan cuti (filterable)
- GET    /api/leaves/:id — detail pengajuan cuti
- GET    /api/leaves/my — daftar pengajuan cuti milik pengguna saat ini
- POST   /api/leaves — ajukan cuti (body termasuk tipe, startDate, endDate, reason, attachment)
- PUT    /api/leaves/:id — update pengajuan (jika diizinkan)
- DELETE /api/leaves/:id — batalkan pengajuan
- POST   /api/leaves/:id/approve — approve pengajuan (role: HR/Manager)
- POST   /api/leaves/:id/reject — reject pengajuan (role: HR/Manager)

Sesuaikan path endpoint dengan backend yang Anda gunakan.

---

## 🗂 State Management (Redux)

Slice tambahan untuk cuti:

- leaveSlice.js
  - State: list, detail, myLeaves, pendingApprovals, loading, error
  - Actions: fetchLeaves, fetchLeaveById, createLeave, updateLeave, deleteLeave, approveLeave, rejectLeave

### Managed States (ringkasan)

- Authentication Token
- Logged-in User Information
- Employee Data
- Dashboard Statistics
- Leave Data & Approval Requests
- Global Loading State
- Global Error State

---

## ⚠️ Praktik & Catatan

- Validasi sisi-klien untuk tanggal cuti (start <= end) dan batasan sisa cuti.
- Cegah pengajuan tumpang tindih jika kebijakan mengharuskan.
- Tampilkan notifikasi / toast saat pengajuan berhasil atau ditolak.
- Untuk berkas lampiran, pastikan backend mendukung multipart/form-data.

---

## ✅ Catatan

- Periksa file `package.json` untuk melihat dependensi dan script.
- Jika ada fitur tambahan (dark mode, TanStack Query, unit test), tambahkan dokumentasinya di README ini.

---

## 👨‍💻 Author

Dikembangkan oleh zakywidodo19 untuk aplikasi Sistem Manajemen Karyawan.
