const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public/assets');

const containers = [
    { id: 'organico', color: '#4caf50', dark: '#388e3c', label: 'O' },
    { id: 'plastico', color: '#ffeb3b', dark: '#fbc02d', label: 'PL' },
    { id: 'papel', color: '#2196f3', dark: '#1976d2', label: 'PA' },
    { id: 'vidrio', color: '#9c27b0', dark: '#7b1fa2', label: 'V' },
    { id: 'ewaste', color: '#f44336', dark: '#d32f2f', label: 'E' }
];

const svgTemplate = (c) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 64">
  <ellipse cx="24" cy="60" rx="16" ry="4" fill="#000000" opacity="0.2"/>
  <path d="M 10 16 L 38 16 L 34 60 L 14 60 Z" fill="${c.color}" stroke="${c.dark}" stroke-width="1"/>
  <path d="M 10 16 L 16 16 L 18 60 L 14 60 Z" fill="#ffffff" opacity="0.2" />
  <path d="M 6 12 L 42 12 L 40 16 L 8 16 Z" fill="${c.dark}" />
  <rect x="18" y="8" width="12" height="4" rx="2" fill="${c.dark}" />
  <text x="24" y="42" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle" stroke="#000000" stroke-width="0.5">${c.label}</text>
</svg>`;

containers.forEach(c => {
    fs.writeFileSync(path.join(publicDir, `container_${c.id}.svg`), svgTemplate(c));
});

console.log("Contenedores SVG generados exitosamente");
