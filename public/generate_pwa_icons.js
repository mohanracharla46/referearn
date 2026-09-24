const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

function createCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    table[n] = c;
  }
  return table;
}

const crcTable = createCrcTable();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'binary');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function generatePng(width, height) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // color type (RGBA)
  header[10] = 0; // compression
  header[11] = 0; // filter
  header[12] = 0; // interlace

  const ihdr = makeChunk('IHDR', header);

  // Pixel data with rounded dark square & emerald/cyan glowing logo icon
  const rawRows = [];
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;

  for (let y = 0; y < height; y++) {
    const row = Buffer.alloc(1 + width * 4);
    row[0] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const idx = 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: Sleek dark gradient (#09090b to #18181b)
      let r = 9;
      let g = 9;
      let b = 11;
      let a = 255;

      // Outer rounded icon container
      if (Math.abs(dx) < radius && Math.abs(dy) < radius) {
        r = 15;
        g = 23;
        b = 42; // #0f172a
      }

      // Emerald Glowing 'R' / Arrow Mark in center
      const inArrow = (dx > -radius * 0.3 && dx < radius * 0.3 && dy > -radius * 0.3 && dy < radius * 0.3);
      const isEmerald = (dx + dy > -radius * 0.2 && dx - dy < radius * 0.3);

      if (inArrow && isEmerald) {
        // Emerald / Teal gradient (#10b981 to #06b6d4)
        r = 16;
        g = 185;
        b = 129;
      }

      row[idx] = r;
      row[idx + 1] = g;
      row[idx + 2] = b;
      row[idx + 3] = a;
    }
    rawRows.push(row);
  }

  const rawBuffer = Buffer.concat(rawRows);
  const compressed = zlib.deflateSync(rawBuffer);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([signature, ihdr, idat, iend]);
}

const pwaDir = __dirname;
fs.writeFileSync(path.join(pwaDir, 'pwa-192x192.png'), generatePng(192, 192));
fs.writeFileSync(path.join(pwaDir, 'pwa-512x512.png'), generatePng(512, 512));
fs.writeFileSync(path.join(pwaDir, 'apple-touch-icon.png'), generatePng(180, 180));
fs.writeFileSync(path.join(pwaDir, 'maskable-icon-512x512.png'), generatePng(512, 512));

console.log('PWA Icons generated successfully!');
