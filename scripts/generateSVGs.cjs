const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public/assets');

const svgs = {
  'plastico_botella.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="10" y="8" width="12" height="20" rx="2" fill="#00ffff" /><rect x="13" y="4" width="6" height="4" fill="#00cccc" /><rect x="12" y="2" width="8" height="2" fill="#009999" /></svg>`,
  'bolsa.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M 6 14 Q 16 28 26 14 C 28 10 24 8 20 8 Q 16 16 12 8 C 8 8 4 10 6 14 Z" fill="#b3ffff" /><path d="M 12 8 C 12 4 14 2 16 2 C 18 2 20 4 20 8" fill="none" stroke="#b3ffff" stroke-width="2" /></svg>`,
  'vidrio_botella.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M 10 14 L 10 28 A 2 2 0 0 0 12 30 L 20 30 A 2 2 0 0 0 22 28 L 22 14 L 18 6 L 18 2 L 14 2 L 14 6 Z" fill="#2e8b57" /><rect x="10" y="16" width="12" height="8" fill="#e6f2eb" /></svg>`,
  'papel_hoja.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="6" y="4" width="20" height="24" fill="#ffffff" stroke="#cccccc" stroke-width="1" /><line x1="10" y1="10" x2="22" y2="10" stroke="#cccccc" stroke-width="1" /><line x1="10" y1="14" x2="22" y2="14" stroke="#cccccc" stroke-width="1" /><line x1="10" y1="18" x2="18" y2="18" stroke="#cccccc" stroke-width="1" /></svg>`,
  'papel_diario.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="20" fill="#e6e6e6" /><rect x="6" y="8" width="8" height="6" fill="#999999" /><line x1="16" y1="10" x2="26" y2="10" stroke="#666666" stroke-width="2" /><line x1="16" y1="14" x2="26" y2="14" stroke="#666666" stroke-width="2" /><line x1="6" y1="18" x2="26" y2="18" stroke="#666666" stroke-width="2" /><line x1="6" y1="22" x2="20" y2="22" stroke="#666666" stroke-width="2" /></svg>`,
  'papel_servilleta.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><polygon points="16,4 28,16 16,28 4,16" fill="#ffffff" stroke="#e0e0e0" stroke-width="1" /><polygon points="16,8 24,16 16,24 8,16" fill="#f5f5f5" /></svg>`,
  'carton_leche.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="8" y="10" width="16" height="20" fill="#f0f0f0" /><polygon points="8,10 16,2 24,10" fill="#e0e0e0" /><rect x="10" y="14" width="12" height="10" fill="#4caf50" /><circle cx="16" cy="19" r="3" fill="#ffffff" /></svg>`,
  'carton_crema.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="6" y="14" width="20" height="16" fill="#ffcc80" /><polygon points="6,14 16,8 26,14" fill="#ffb74d" /><rect x="10" y="18" width="12" height="6" fill="#ffffff" /></svg>`,
  'manzana.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M 16 10 C 24 6 30 16 24 24 C 20 28 16 26 16 26 C 16 26 12 28 8 24 C 2 16 8 6 16 10 Z" fill="#e53935" /><path d="M 16 10 Q 18 4 22 2" fill="none" stroke="#795548" stroke-width="2" /><path d="M 18 6 Q 22 4 24 8" fill="#4caf50" /></svg>`,
  'platano.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M 6 26 C 6 26 16 30 26 22 C 30 18 28 14 26 14 C 20 22 10 20 6 26 Z" fill="#ffee58" /><path d="M 26 14 L 28 12 L 30 14" fill="#795548" /></svg>`,
  'bateria.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="10" y="8" width="12" height="20" fill="#424242" /><rect x="12" y="4" width="8" height="4" fill="#bdbdbd" /><rect x="10" y="18" width="12" height="10" fill="#ef5350" /></svg>`,
  'movil.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="8" y="4" width="16" height="24" rx="2" fill="#212121" /><rect x="10" y="6" width="12" height="18" fill="#e0e0e0" /><circle cx="16" cy="26" r="1" fill="#757575" /></svg>`
};

for (const [filename, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(publicDir, filename), content);
}

console.log("SVGs generados exitosamente");
