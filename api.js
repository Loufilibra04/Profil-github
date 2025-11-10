document.addEventListener('DOMContentLoaded', () => {

    const inputUsername = document.getElementById('input-username');
    const tombolHasilkan = document.getElementById('tombol-hasilkan');
    const wadahKartu = document.getElementById('wadah-kartu');
    const pesanStatus = document.getElementById('pesan-status');

    tombolHasilkan.addEventListener('click', ambilDataGitHub);

    inputUsername.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            ambilDataGitHub();
        }
    });

    async function ambilDataGitHub() {
        const namaPengguna = inputUsername.value; 

        if (!namaPengguna) {
            pesanStatus.textContent = 'Harap masukkan username!';
            pesanStatus.style.color = 'red';
            return; 
        }

        wadahKartu.innerHTML = '<div id="pesan-status">Mencari data...</div>';

        try {
            const linkApi = `https://api.github.com/users/${namaPengguna}`;
            const respon = await fetch(linkApi);

            if (!respon.ok) {
                throw new Error('Username tidak ditemukan!');
            }

            const data = await respon.json();

            buatKartuProfil(data);

        } catch (error) {
            wadahKartu.innerHTML = `<div id="pesan-status" style="color: red;">Error: ${error.message}</div>`;
        }
    }

    function buatKartuProfil(data) {
        wadahKartu.innerHTML = '';

        const fotoProfil = data.avatar_url;
        const nama = data.name || data.login; 
        const username = `@${data.login}`;
        const followers = data.followers;
        const following = data.following;
        const repos = data.public_repos;
        const linkProfil = data.html_url;

        const htmlKartu = `
            <div class="kartu-profil">
                <img src="${fotoProfil}" alt="Foto Profil ${nama}">
                <h2>${nama}</h2>
                <p class="username">${username}</p>
                
                <div class="area-statistik">
                    <div class="stat-item">
                        <span class="angka">${repos}</span>
                        <span class="label">Repo</span>
                    </div>
                    <div class="stat-item">
                        <span class="angka">${followers}</span>
                        <span class="label">Followers</span>
                    </div>
                    <div class="stat-item">
                        <span class="angka">${following}</span>
                        <span class="label">Following</span>
                    </div>
                </div>
                
                <a href="${linkProfil}" class="link-follow" target="_blank">
                    Follow
                </a>
            </div>
        `;

        wadahKartu.innerHTML = htmlKartu;
    }

});