const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// SVGファイルを読み込み
const svgBuffer = fs.readFileSync(path.join(__dirname, 'icons', 'icon.svg'));

// 異なるサイズのアイコンを生成
const sizes = [16, 48, 128];

async function generateIcons() {
    for (const size of sizes) {
        try {
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(path.join(__dirname, 'icons', `icon${size}.png`));
            
            console.log(`✅ ${size}x${size} アイコンを生成しました`);
        } catch (error) {
            console.error(`❌ ${size}x${size} アイコンの生成に失敗しました:`, error);
        }
    }
}

generateIcons(); 