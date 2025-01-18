public function index() {
    $id_pasien = $this->session->userdata('id_pasien');
    $data['konsultasi'] = $this->Konsultasi_model->get_konsultasi_by_pasien($id_pasien);
    $data['dokter'] = $this->Dokter_model->get_all_dokter();

    // Cek apakah request berasal dari AJAX
    if ($this->input->is_ajax_request()) {
        $this->load->view('dashboard_pasien/konsultasi', $data);
    } else {
        $this->load->view('dashboard_pasien/header');
        $this->load->view('dashboard_pasien/konsultasi', $data);
        $this->load->view('dashboard_pasien/footer');
    }
}
