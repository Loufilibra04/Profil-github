document.addEventListener('DOMContentLoaded', () => {

    const inputUsername = document.getElementById('input-username');
    const tombolHasilkan = document.getElementById('tombol-hasilkan');
    const wadahKontenKartu = document.getElementById('wadah-konten-kartu');
    const pesanStatus = document.getElementById('pesan-status');
    const tombolUnduhPNG = document.getElementById('tombol-unduh-png');

    tombolHasilkan.addEventListener('click', ambilDataGitHub);

    inputUsername.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            ambilDataGitHub();
        }
    });

    tombolUnduhPNG.addEventListener('click', unduhKartuPNG);

    async function ambilDataGitHub() {
        const namaPengguna = inputUsername.value;

        if (!namaPengguna) {
            tampilkanPesanStatus('Harap masukkan username!', 'red');
            tombolUnduhPNG.style.display = 'none';
            return;
        }

        tampilkanPesanStatus('Mencari data...', '#8d6e63');
        tombolUnduhPNG.style.display = 'none';

        try {
            const linkApi = `https://api.github.com/users/${namaPengguna}`;
            const respon = await fetch(linkApi);

            if (!respon.ok) {
                if (respon.status === 404) {
                    throw new Error('Username GitHub tidak ditemukan!');
                } else {
                    throw new Error(`Gagal mengambil data: ${respon.statusText}`);
                }
            }

            const data = await respon.json();

            buatKartuProfil(data);
            tombolUnduhPNG.style.display = 'inline-flex';
            tampilkanPesanStatus('', 'transparent');

        } catch (error) {
            tampilkanPesanStatus(`Error: ${error.message}`, 'red');
            tombolUnduhPNG.style.display = 'none';
        }
    }

    function tampilkanPesanStatus(pesan, warna) {
        wadahKontenKartu.innerHTML = `<div id="pesan-status" style="color: ${warna};">${pesan}</div>`;
    }

    function buatKartuProfil(data) {
        wadahKontenKartu.innerHTML = '';

        const fotoProfil = data.avatar_url;
        const namaLengkap = data.name || data.login;
        const usernameGithub = `@${data.login}`;
        const bio = data.bio || 'Tidak ada bio.';
        const lokasi = data.location || null;
        const email = data.email || null;
        const blog = data.blog || null;
        const followers = data.followers;
        const linkProfilGithub = data.html_url;

        let blogHostname = '';
        if (blog) {
            try {
                let urlLengkap = blog.startsWith('http') ? blog : `https://${blog}`;
                blogHostname = new URL(urlLengkap).hostname;
            } catch (_) {
                blogHostname = blog;
            }
        }

        const htmlKartu = `
            <div class="kartu-profil-profesional" id="kartu-untuk-unduh">
                <div class="area-kiri-kartu">
                    <span class="logo">GITHUB PROFILE</span>
                    <h2>${namaLengkap}</h2>
                    <p class="bio-singkat">${bio}</p>
                    <ul class="detail-kontak">
                        <li><i class="fas fa-user-friends"></i> ${followers} Followers</li>
                        ${lokasi ? `<li><i class="fas fa-map-marker-alt"></i> ${lokasi}</li>` : ''}
                        ${email ? `<li><i class="fas fa-envelope"></i> ${email}</li>` : ''}
                        ${blog ? `<li><i class="fas fa-globe"></i> <a href="${blog.startsWith('http') ? blog : `https://${blog}`}" target="_blank" style="color: inherit; text-decoration: none;">${blogHostname}</a></li>` : ''}
                        <li><i class="fab fa-github"></i> <a href="${linkProfilGithub}" target="_blank" style="color: inherit; text-decoration: none;">${usernameGithub}</a></li>
                    </ul>
                </div>
                <div class="area-kanan-kartu">
                    <img src="${fotoProfil}" alt="Foto Profil ${namaLengkap}">
                </div>
            </div>
        `;
        wadahKontenKartu.innerHTML = htmlKartu;
    }

    async function unduhKartuPNG() {
        const elemenKartu = document.getElementById('kartu-untuk-unduh');
        if (!elemenKartu) {
            alert('Tidak ada kartu untuk diunduh. Harap hasilkan kartu terlebih dahulu.');
            return;
        }

        const semuaLink = elemenKartu.querySelectorAll('a');
        semuaLink.forEach(link => link.style.pointerEvents = 'none');

        html2canvas(elemenKartu, {
            scale: 2,
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `kartu-${inputUsername.value}.png`;
            link.href = canvas.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            semuaLink.forEach(link => link.style.pointerEvents = 'auto');
        }).catch(error => {
            alert('Terjadi kesalahan saat mengunduh kartu. Coba lagi.');
            semuaLink.forEach(link => link.style.pointerEvents = 'auto');
        });
    }

});