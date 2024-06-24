-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 11 Jun 2024 pada 09.00
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
-- Database: `user_auth`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `address`, `phone`, `profile_image`) VALUES
(4, 'Thierry', 'Widyatama', 'thie12@gmail.com', '12345', 'Sampangan Menoreh Semarang, Jawa Tengah', '1234567890', '/uploads/1717547022927'),
(5, 'Awikwok', 'Awikwok', 'awikwok@gmail.com', '12345', 'Semarang Sampangan Jawa Tengah', '1234567890', '/uploads/1717553093162'),
(6, 'Rafiiiiiii', 'Amirrrrrrr', 'rafiamir@gmail.com', '12345', 'Semarang Tembalang Jawa Tengah', '1234567890', '/uploads/1717996717092'),
(7, 'Hehe', 'Hehe', 'hayya@gmail.com', '12345', 'Semarang Jawa Tengah Sampangan Gajah Mungkur dekat UNNES', '0890890890890', '/uploads/1717968198337'),
(8, 'Apa', 'Ini', 'Woe@gmail.com', '$2b$10$EQQq2JmZ5SvsAcAg4n3THecKnuX6TGerHdVapRM0e4a2Y1FzyXJi6', 'Kudus', '989089089089089', NULL);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
