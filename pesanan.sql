-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 11 Jun 2024 pada 08.59
-- Versi server: 10.4.24-MariaDB
-- Versi PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pesanan`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nomorHp` varchar(15) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `waktu` time DEFAULT NULL,
  `total_orang` int(11) DEFAULT NULL,
  `harga_total` decimal(10,2) DEFAULT NULL,
  `metode_pembayaran` varchar(50) DEFAULT NULL,
  `user_email` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `orders`
--

INSERT INTO `orders` (`id`, `nama`, `email`, `nomorHp`, `alamat`, `tanggal`, `waktu`, `total_orang`, `harga_total`, `metode_pembayaran`, `user_email`, `status`) VALUES
(1, 'Rafi Amir', 'hayya@gmail.com', '088980117450', 'Semarang', '2024-06-11', '12:00:00', 2, '102000.00', 'BNI', 'hayya@gmail.com', 'Confirmed'),
(2, 'Rafi Amir', 'rafiamir@gmail.com', '088980117450', 'Semarang', '2024-07-26', '15:00:00', 2, '102000.00', 'BNI', 'rafiamir@gmail.com', 'Confirmed');

-- --------------------------------------------------------

--
-- Struktur dari tabel `receipts`
--

CREATE TABLE `receipts` (
  `id` int(11) NOT NULL,
  `user_email` varchar(100) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `receipt_data` longtext DEFAULT NULL,
  `rating` int(11) DEFAULT 0,
  `description` text DEFAULT NULL,
  `kebersihan` int(11) DEFAULT 0,
  `pelayanan` int(11) DEFAULT 0,
  `kecepatan` int(11) DEFAULT 0,
  `profesional` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `receipts`
--

INSERT INTO `receipts` (`id`, `user_email`, `order_id`, `receipt_data`, `rating`, `description`, `kebersihan`, `pelayanan`, `kecepatan`, `profesional`) VALUES
(1, 'hayya@gmail.com', 1, '{\"waktu_pembayaran\":\"6/11/2024, 12:02:27 PM\",\"total_pembayaran\":102000,\"rincian_pembayaran\":{\"subtotal_pembersihan\":120000,\"biaya_jasa_aplikasi\":2000,\"diskon\":20000,\"total_pembayaran\":102000},\"metode_pembayaran\":\"BNI\",\"alamat\":\"Semarang\"}', 4, 'Sudah bagus, saya suka dengan kinerja nya namun untuk webnya klo bisa lebih bagus dan disediakan pembayaran qris', 5, 3, 4, 4),
(2, 'rafiamir@gmail.com', 2, '{\"waktu_pembayaran\":\"6/11/2024, 1:44:43 PM\",\"total_pembayaran\":102000,\"rincian_pembayaran\":{\"subtotal_pembersihan\":120000,\"biaya_jasa_aplikasi\":2000,\"diskon\":20000,\"total_pembayaran\":102000},\"metode_pembayaran\":\"BNI\",\"alamat\":\"Semarang\"}', 1, 'Nggak bersih', 1, 1, 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `receipts`
--
ALTER TABLE `receipts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
