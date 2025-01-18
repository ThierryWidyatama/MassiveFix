<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Konsultasi_model extends CI_Model {

    public function get_konsultasi_by_dokter($id_dokter) {
        $this->db->select('konsultasi.*, pasien.nama AS nama_pasien, dokter.nama AS nama_dokter');
        $this->db->from('konsultasi');
        $this->db->join('pasien', 'konsultasi.id_pasien = pasien.id');
        $this->db->join('dokter', 'konsultasi.id_dokter = dokter.id');
        $this->db->where('konsultasi.id_dokter', $id_dokter);
        $query = $this->db->get();
        return $query->result();
    }
}


<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Konsultasi extends CI_Controller {

    public function __construct() {
        parent::__construct();
        $this->load->model('Konsultasi_model');
    }

    public function index($id_dokter) {
        $data['konsultasi'] = $this->Konsultasi_model->get_konsultasi_by_dokter($id_dokter);
        $data['id_dokter'] = $id_dokter;

        $this->load->view('templates/header');
        $this->load->view('konsultasi/index', $data);
        $this->load->view('templates/footer');
    }
}

<div class="container">
    <h2>Daftar Konsultasi Dokter</h2>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>No</th>
                <th>Subjek</th>
                <th>Pertanyaan</th>
                <th>Jawaban</th>
                <th>Tanggal Konsul</th>
                <th>Pasien</th>
            </tr>
        </thead>
        <tbody>
            <?php if (!empty($konsultasi)) : ?>
                <?php $no = 1; foreach ($konsultasi as $k) : ?>
                    <tr>
                        <td><?= $no++; ?></td>
                        <td><?= htmlspecialchars($k->subjek); ?></td>
                        <td><?= htmlspecialchars($k->pertanyaan); ?></td>
                        <td><?= htmlspecialchars($k->jawaban); ?></td>
                        <td><?= date('d-m-Y', strtotime($k->tgl_konsul)); ?></td>
                        <td><?= htmlspecialchars($k->nama_pasien); ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php else : ?>
                <tr>
                    <td colspan="6" class="text-center">Tidak ada data konsultasi</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

CREATE TABLE `konsultasi` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `subjek` VARCHAR(255),
    `pertanyaan` TEXT,
    `jawaban` TEXT,
    `tgl_konsul` DATE,
    `id_pasien` INT,
    `id_dokter` INT,
    FOREIGN KEY (`id_pasien`) REFERENCES `pasien`(`id`),
    FOREIGN KEY (`id_dokter`) REFERENCES `dokter`(`id`)
);

