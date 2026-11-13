# Sistem Inventaris & Peminjaman Alat Laboratorium (MVP)

Aplikasi berbasis web sederhana untuk manajemen inventaris alat/barang laboratorium serta pencatatan transaksi dan riwayat peminjaman.

## Fitur Utama

1. **Katalog & Stok Barang (CRUD Inventaris)**:
   - Melihat daftar inventaris laboratorium lengkap dengan kode, kategori, lokasi rak/meja, kondisi fisik, total stok, dan stok tersedia.
   - Indikator status stok dinamis (*Tersedia*, *Stok Tipis*, *Habis*).
   - **Formulir & Tombol CRUD Lengkap pada Halaman Tambah Alat / Barang Baru**:
     - **Mode Switcher**: Beralih antara mode *Input Baru (Create)* dan mode *Pilih Barang (Read / Update / Delete)* dengan dropdown pemilih alat.
     - **Tombol Create** (`Simpan Baru`): Menyimpan data alat baru ke katalog laboratorium dengan ID unik otomatis.
     - **Tombol Read** (`Lihat Tabel / Muat Data`): Menutup form dan langsung menampilkan item di tabel inventaris dengan pencarian otomatis, serta dapat memuat data item apa pun langsung ke dalam form.
     - **Tombol Update** (`Perbarui`): Memperbarui data instrumen yang sedang dipilih dengan proteksi validasi stok.
     - **Tombol Delete** (`Hapus`): Menghapus data barang dengan dialog konfirmasi keamanan (terproteksi jika alat sedang dipinjam).
     - **Tombol Reset** (`Reset Form`): Mengosongkan form input seketika untuk persiapan input baru.
   - Tersedia baik di dalam **Modal Dialog Popup** maupun sebagai **Tab Khusus Halaman (Kelola Barang CRUD)**.

2. **Transaksi & Peminjaman (CRUD Peminjaman)**:
   - Formulir peminjaman alat dengan seleksi barang otomatis dan batas kuantitas sesuai sisa stok riil.
   - Pengurangan stok tersedia secara otomatis saat peminjaman dicatat.
   - Tombol shortcut "Pinjam" langsung dari baris tabel stok barang.
   - Pengelompokan peminjam (Mahasiswa, Dosen/Peneliti, Asisten Lab, Staf).
   - Peringatan keterlambatan (label *Terlambat*) jika batas pengembalian terlewati.
   - Edit rincian peminjaman jika terdapat kekeliruan data kontak/keperluan.

3. **Pengembalian & Riwayat (Return Flow & History)**:
   - Alur pengembalian alat dengan pencatatan tanggal kembali aktual, kondisi fisik saat barang kembali (*Lengkap & Baik*, *Ada Kerusakan*, *Aksesoris Kurang*), dan catatan petugas lab.
   - Pemulihan kuantitas stok barang secara otomatis saat pengembalian diselesaikan.
   - Tabel riwayat lengkap dengan filter status (*Sedang Dipinjam*, *Sudah Dikembalikan*).
   - Opsi penghapusan catatan transaksi dengan konfirmasi modal.

4. **Desain & Antarmuka**:
   - **Tech Stack**: Murni HTML5, CSS3, dan Vanilla JavaScript (ES6+).
   - **Font**: Google Fonts - Poppins (300, 400, 500, 600, 700).
   - **Theme**: Light Professional Slate (gaya antarmuka sistem administrasi kelembagaan/kampus yang bersih, rapi, dan mudah dibaca).
   - **Bebas AI Slop**: Tanpa emoji kartun, tanpa ikon berwarna-warni norak; menggunakan ikon vektor SVG monokromatik presisi dengan `currentColor`.
   - **Penyimpanan**: Browser `localStorage` otomatis menyimpan setiap perubahan sehingga data tetap tersimpan saat halaman dimuat ulang. Terdapat tombol *Reset Data* untuk mengembalikan data awal bawaan pengujian.

## Struktur Berkas

```
d:/project/
├── index.html          # Halaman utama aplikasi dan struktur antarmuka
├── css/
│   └── style.css       # Skema warna light slate, tipografi Poppins, dan layout responsif
├── js/
│   ├── data.js         # Inisialisasi seed data default dan helper LocalStorage
│   └── app.js          # Logika aplikasi, state management, manipulasi DOM & CRUD
└── README.md           # Dokumentasi teknis proyek
```

## Cara Menjalankan

Cukup buka berkas `index.html` langsung di browser modern mana saja (Chrome, Edge, Firefox, Safari) dengan salah satu cara berikut:
- Klik ganda pada berkas `index.html` di File Explorer, **atau**
- Buka terminal PowerShell di folder ini lalu jalankan:
  ```powershell
  Start-Process index.html
  ```
- Atau jika menggunakan ekstensi Live Server di editor / server lokal sederhana:
  ```powershell
  python -m http.server 8080
  ```
  Lalu buka `http://localhost:8080` di browser Anda.

