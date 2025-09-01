# Expensee App

Aplikasi mobile untuk melacak pengeluaran pribadi, dibangun menggunakan React Native.

## Persyaratan Sistem

Pastikan lingkungan pengembangan Anda telah memenuhi persyaratan berikut sebelum memulai.

- **Node.js**: Versi `18` atau yang lebih baru.
- **Yarn**: Digunakan sebagai manajer paket.
- **Watchman** (untuk macOS): Direkomendasikan untuk performa yang lebih baik.
- **JDK (Java Development Kit)**: Versi 11 atau yang lebih baru.
- **Android Studio**: Untuk menjalankan aplikasi di Android (Emulator atau perangkat fisik).
- **Xcode**: Untuk menjalankan aplikasi di iOS (Simulator atau perangkat fisik).

Untuk panduan pengaturan lingkungan React Native yang lebih detail, silakan merujuk ke [dokumentasi resmi React Native](https://reactnative.dev/docs/environment-setup).

## Instalasi

1. **Clone Repositori**

    ```sh
    git clone https://github.com/nabil-devId/ExpenseeApp.git
    cd ExpenseeApp
    ```

2. **Install Dependensi**

    Gunakan `yarn` untuk menginstal semua dependensi yang diperlukan.

    ```sh
    yarn install
    ```

## Pengaturan Backend (Opsional)

Proyek ini memerlukan koneksi ke server backend. Selama pengembangan, Anda dapat menggunakan `ngrok` untuk membuat *tunnel* ke server backend lokal Anda.

1. **Jalankan Backend Lokal**
   Pastikan server backend Anda berjalan secara lokal di port `8000`.

2. **Jalankan ngrok**
   Buka terminal baru dan jalankan perintah berikut untuk mengekspos port `8000` ke internet.

   ```sh
   ngrok http 8000
   ```

3. **Perbarui URL API**
   `ngrok` akan memberikan Anda URL publik (contoh: `https://xxxx-xxxx.ngrok-free.app`). Salin URL ini dan perbarui `BASE_URL` di dalam berkas `src/constants.ts`.

   ```typescript
   // src/constants.ts
   export const API = {
     BASE_URL: 'https://xxxx-xxxx.ngrok-free.app', // Ganti dengan URL ngrok Anda
     // ...
   };
   ```

## Menjalankan Aplikasi

### 1. Jalankan Metro Bundler

Metro adalah *bundler* JavaScript untuk React Native. Jalankan Metro di terminal terpisah.

```sh
yarn start
```

Biarkan terminal ini tetap berjalan.

### 2. Jalankan di Platform Spesifik

Buka terminal baru di direktori proyek dan jalankan perintah berikut sesuai dengan platform target Anda.

#### Android

Pastikan Anda memiliki emulator Android yang sedang berjalan atau perangkat Android yang terhubung.

```sh
yarn android
```

#### iOS

Untuk iOS, Anda perlu menginstal dependensi CocoaPods terlebih dahulu.

```sh
cd ios
bundle install
bundle exec pod install
cd ..
```

Setelah itu, jalankan aplikasi di simulator iOS.

```sh
yarn ios
```

Jika semua sudah diatur dengan benar, aplikasi akan berjalan di emulator/simulator atau perangkat Anda.
