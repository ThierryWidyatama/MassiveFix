CREATE TABLE `konsultasi` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `subjek` VARCHAR(255) NOT NULL,
    `pertanyaan` TEXT NOT NULL,
    `jawaban` TEXT DEFAULT NULL,
    `tgl_konsul` DATETIME NOT NULL,
    `id_pasien` INT NOT NULL,
    `id_dokter` INT NOT NULL,
    FOREIGN KEY (`id_pasien`) REFERENCES `pasien`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (`id_dokter`) REFERENCES `dokter`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);
