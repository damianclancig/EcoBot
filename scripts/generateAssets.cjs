const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public/assets');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// Generar una imagen PNG simple 64x32 con 2 tiles (1 verde para Limpia, 1 marrón oscuro para Sucia)
// Un buffer PNG mínimo base64
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAEAAAAAgCAIAAADeWbwPAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH6AYBDQUZf879VwAAAGVJREFUWEft0kERAAAAA7D+vxboCxX4m5jYQ4899NhDjz302EOPPfTYQ4899NhDjz302EOPPfTYQ4899NhDjz302EOPPfTYQ4899NhDjz302EOPPfTYQ4899NhDjz302EOPPfRoAwK/AAG91LrjAAAAAElFTkSuQmCC";
fs.writeFileSync(path.join(publicDir, 'tileset.png'), Buffer.from(pngBase64, 'base64'));

// Generar un map.json (Tiled 1.10+)
// Tile 1 = Limpio, Tile 2 = Sucio
const mapData = {
    "compressionlevel": -1,
    "height": 50,
    "infinite": false,
    "layers": [
        {
            "data": Array(2500).fill(1), // 50x50
            "height": 50,
            "id": 1,
            "name": "Limpia",
            "opacity": 1,
            "type": "tilelayer",
            "visible": true,
            "width": 50,
            "x": 0,
            "y": 0
        },
        {
            "data": Array(2500).fill(2),
            "height": 50,
            "id": 2,
            "name": "Sucia",
            "opacity": 1,
            "type": "tilelayer",
            "visible": true,
            "width": 50,
            "x": 0,
            "y": 0
        },
        {
            "id": 3,
            "name": "Colisiones",
            "objects": [
                {
                    "height": 1600, "id": 1, "name": "BordeIzq", "type": "wall", "width": 32, "x": 0, "y": 0
                },
                {
                    "height": 1600, "id": 2, "name": "BordeDer", "type": "wall", "width": 32, "x": 1568, "y": 0
                },
                {
                    "height": 32, "id": 3, "name": "BordeSup", "type": "wall", "width": 1600, "x": 0, "y": 0
                },
                {
                    "height": 32, "id": 4, "name": "BordeInf", "type": "wall", "width": 1600, "x": 0, "y": 1568
                }
            ],
            "type": "objectgroup"
        }
    ],
    "nextlayerid": 4,
    "nextobjectid": 5,
    "orientation": "orthogonal",
    "renderorder": "right-down",
    "tileheight": 32,
    "tilesets": [
        {
            "firstgid": 1,
            "image": "tileset.png",
            "imageheight": 32,
            "imagewidth": 64,
            "margin": 0,
            "name": "ecosistema",
            "spacing": 0,
            "tilecount": 2,
            "tileheight": 32,
            "tilewidth": 32
        }
    ],
    "tilewidth": 32,
    "type": "map",
    "version": "1.10",
    "width": 50
};

fs.writeFileSync(path.join(publicDir, 'map.json'), JSON.stringify(mapData, null, 2));

console.log("Assets Tiled generados exitosamente en public/assets");
