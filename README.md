<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Konsultasi extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('Konsultasi_model');
        $this->load->model('Pasien_model');
        $this->load->model('Dokter_model');
        $this->load->library('session');
        if (!$this->session->userdata('id_pasien')) {
            redirect('auth/login'); // Sesuaikan dengan sistem login Anda
        }
    }

    public function index() {
        $id_pasien = $this->session->userdata('id_pasien');
        $data['konsultasi'] = $this->Konsultasi_model->get_konsultasi_by_pasien($id_pasien);
        $data['dokter'] = $this->Dokter_model->get_all_dokter();
        $this->load->view('dashboard_pasien/header');
        $this->load->view('dashboard_pasien/konsultasi', $data);
        $this->load->view('dashboard_pasien/footer');
    }

    public function tambah() {
        $this->form_validation->set_rules('subjek', 'Subjek', 'required');
        $this->form_validation->set_rules('pertanyaan', 'Pertanyaan', 'required');

        if ($this->form_validation->run() === FALSE) {
            $this->session->set_flashdata('error', 'Semua field wajib diisi!');
            redirect('konsultasi');
        } else {
            $data = [
                'subjek' => $this->input->post('subjek'),
                'pertanyaan' => $this->input->post('pertanyaan'),
                'id_pasien' => $this->session->userdata('id_pasien'),
                'id_dokter' => $this->input->post('id_dokter'),
                'tgl_konsul' => date('Y-m-d H:i:s')
            ];
            $this->Konsultasi_model->insert_konsultasi($data);
            $this->session->set_flashdata('success', 'Konsultasi berhasil ditambahkan!');
            redirect('konsultasi');
        }
    }
}


<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Konsultasi_model extends CI_Model {
    public function get_konsultasi_by_pasien($id_pasien) {
        $this->db->select('konsultasi.*, dokter.nama as nama_dokter, pasien.nama as nama_pasien');
        $this->db->from('konsultasi');
        $this->db->join('dokter', 'dokter.id = konsultasi.id_dokter');
        $this->db->join('pasien', 'pasien.id = konsultasi.id_pasien');
        $this->db->where('konsultasi.id_pasien', $id_pasien);
        return $this->db->get()->result_array();
    }

    public function insert_konsultasi($data) {
        $this->db->insert('konsultasi', $data);
    }
}

<div class="container">
    <h2>Konsultasi dengan Dokter</h2>
    
    <?php if ($this->session->flashdata('success')): ?>
        <div class="alert alert-success"><?= $this->session->flashdata('success'); ?></div>
    <?php elseif ($this->session->flashdata('error')): ?>
        <div class="alert alert-danger"><?= $this->session->flashdata('error'); ?></div>
    <?php endif; ?>

    <form action="<?= base_url('konsultasi/tambah'); ?>" method="post">
        <div class="form-group">
            <label for="subjek">Subjek</label>
            <input type="text" name="subjek" id="subjek" class="form-control" required>
        </div>
        <div class="form-group">
            <label for="pertanyaan">Pertanyaan</label>
            <textarea name="pertanyaan" id="pertanyaan" rows="5" class="form-control" required></textarea>
        </div>
        <div class="form-group">
            <label for="id_dokter">Pilih Dokter</label>
            <select name="id_dokter" id="id_dokter" class="form-control" required>
                <option value="">Pilih Dokter</option>
                <?php foreach ($dokter as $d): ?>
                    <option value="<?= $d['id']; ?>"><?= $d['nama']; ?> (<?= $d['spesialis']; ?>)</option>
                <?php endforeach; ?>
            </select>
        </div>
        <button type="submit" class="btn btn-primary">Kirim</button>
    </form>

    <hr>

    <h3>Riwayat Konsultasi</h3>
    <table class="table table-striped">
        <thead>
            <tr>
                <th>No</th>
                <th>Subjek</th>
                <th>Pertanyaan</th>
                <th>Jawaban</th>
                <th>Dokter</th>
                <th>Tanggal</th>
            </tr>
        </thead>
        <tbody>
            <?php $no = 1; foreach ($konsultasi as $k): ?>
                <tr>
                    <td><?= $no++; ?></td>
                    <td><?= $k['subjek']; ?></td>
                    <td><?= $k['pertanyaan']; ?></td>
                    <td><?= $k['jawaban'] ?: 'Belum dijawab'; ?></td>
                    <td><?= $k['nama_dokter']; ?></td>
                    <td><?= date('d-m-Y H:i', strtotime($k['tgl_konsul'])); ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>
