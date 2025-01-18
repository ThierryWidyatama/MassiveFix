$('#konsultasi').click(function() {
        $('#main-content').html('<h3>Memuat data poli...</h3>'); // Menampilkan loading

        $.ajax({
            url: '<?= site_url("dashboard_pasien/load_kelola_poli"); ?>',
            method: 'GET',
            success: function(response) {
                $('#main-content').html(response); // Ganti konten dengan data dari server
            },
            error: function() {
                $('#main-content').html('<p>Error saat memuat data. Coba lagi.</p>');
            }
        });
    });
