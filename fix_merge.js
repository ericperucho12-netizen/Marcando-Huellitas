const fs = require('fs');

// Fix donaciones.html
let donacionesPath = 'src/pages/community/donaciones.html';
let donacionesHtml = fs.readFileSync(donacionesPath, 'utf8');

const videoBlock = `                    <video id="donationVideo"
                            class="donation-video"
                            autoplay
                            muted
                            playsinline>
                            <source src="../../assets/donaciones/video1.mp4" type="video/mp4">
                    </video>`;

// Replace conflict 1
const conflict1Regex = /<<<<<<< HEAD:src\/pages\/community\/donaciones\.html[\s\S]+?=======[\s\S]+?>>>>>>> [a-f0-9]+:src\/pages\/donaciones\.html/;
donacionesHtml = donacionesHtml.replace(conflict1Regex, videoBlock);

// Replace script section (conflict 2)
const scriptsBlock = `    <!-- Bundler JS -->
    <script src="../../scripts/main.js"></script>
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Cart Script -->
    <script src="../../scripts/shop/cart.js"></script>
    <!-- Donation Script -->
    <script src="../../scripts/community/donacion.js"></script>
</body>`;

donacionesHtml = donacionesHtml.replace(/<!-- Layout JS -->[\s\S]*?<\/body>/, scriptsBlock);

fs.writeFileSync(donacionesPath, donacionesHtml, 'utf8');

// Fix form-donacion.html paths
let formPath = 'src/pages/community/form-donacion.html';
let formHtml = fs.readFileSync(formPath, 'utf8');

formHtml = formHtml.replace(/href="\.\.\/styles\//g, 'href="../../styles/');
formHtml = formHtml.replace(/src="\.\.\/scripts\//g, 'src="../../scripts/');
formHtml = formHtml.replace(/src="\.\.\/assets\//g, 'src="../../assets/');

// Replace layout logic in form-donacion.html
const formScripts = `    <!-- Bundler JS -->
    <script src="../../scripts/main.js"></script>
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <!-- Cart Script -->
    <script src="../../scripts/shop/cart.js"></script>
    <!-- Donation Script -->
    <script src="../../scripts/community/donacion.js"></script>
</body>`;
formHtml = formHtml.replace(/<!-- Layout JS -->[\s\S]*?<\/body>/, formScripts);
formHtml = formHtml.replace(/data-template="\.\.\/layout\/navbar\.html"/g, 'data-template="../../layout/navbar.html" data-root="../../.." data-src="../.."');
formHtml = formHtml.replace(/data-template="\.\.\/layout\/footer\.html"/g, 'data-template="../../layout/footer.html" data-root="../../.." data-src="../.."');

fs.writeFileSync(formPath, formHtml, 'utf8');
console.log('Conflicts resolved and paths fixed!');
