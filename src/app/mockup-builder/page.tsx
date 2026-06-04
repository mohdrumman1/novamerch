"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Internal mockup builder tool. Ported from the standalone general.html
 * provided by the design team. Self-contained: dark internal-tool theme,
 * canvas-based product tinting, drag-and-drop logo overlay, and quote panel.
 *
 * Image assets live under /public/mockups/. Products without dedicated
 * mockup images fall back to existing /public/ promo mockups where possible.
 */

const STYLES_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
.mb-root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0f0f0f;
  color: #e0e0e0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
}
.mb-header {
  background: #1a1a1a;
  border-bottom: 1px solid #252525;
  padding: 0 28px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.mb-header h1 { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
.mb-header h1 span { color: #e86c3a; }
.mb-header small { font-size: 12px; color: #3a3a3a; }
.mb-back-link { font-size: 12px; color: #888; text-decoration: none; }
.mb-back-link:hover { color: #fff; }

.product-bar {
  background: #131313;
  border-bottom: 1px solid #252525;
  padding: 0 20px;
  display: flex;
  gap: 2px;
  overflow-x: auto;
  flex-shrink: 0;
  scrollbar-width: thin;
  scrollbar-color: #2a2a2a transparent;
  height: 46px;
  align-items: flex-end;
}
.prod-tab {
  padding: 8px 14px;
  border-radius: 6px 6px 0 0;
  border: 1px solid transparent;
  border-bottom: none;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  white-space: nowrap;
  transition: all 0.12s;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  height: 36px;
}
.prod-tab:hover:not(.active) { color: #999; background: #1a1a1a; }
.prod-tab.active { background: #1e1e1e; color: #fff; border-color: #2e2e2e; }
.prod-tab .ti { font-size: 14px; }

.mb-main {
  display: grid;
  grid-template-columns: 272px 1fr;
  flex: 1;
  min-height: 0;
}
.opts {
  background: #181818;
  border-right: 1px solid #252525;
  overflow-y: auto;
  padding: 18px 14px 24px;
  scrollbar-width: thin;
  scrollbar-color: #2a2a2a transparent;
}
.opt-sec { margin-bottom: 20px; }
.opt-lbl {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  color: #4a4a4a;
  margin-bottom: 9px;
}
.style-list { display: flex; flex-direction: column; gap: 5px; }
.style-opt {
  padding: 8px 11px;
  border-radius: 5px;
  border: 1px solid #232323;
  background: #1e1e1e;
  color: #999;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.1s;
  user-select: none;
}
.style-opt:hover { border-color: #363636; color: #ddd; }
.style-opt.sel { border-color: #e86c3a; color: #fff; background: #261206; }
.swatches { display: flex; flex-wrap: wrap; gap: 7px; }
.sw-wrap { position: relative; }
.swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.1s;
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.swatch:hover { transform: scale(1.13); }
.swatch.sel { outline-color: #e86c3a; }
.sw-tip {
  position: absolute;
  bottom: calc(100% + 5px);
  left: 50%;
  transform: translateX(-50%);
  background: #2a2a2a;
  border: 1px solid #383838;
  color: #ddd;
  font-size: 10px;
  padding: 3px 7px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.1s;
  z-index: 20;
}
.sw-wrap:hover .sw-tip { opacity: 1; }
.place-list { display: flex; flex-direction: column; gap: 4px; }
.place-btn {
  padding: 7px 10px;
  border-radius: 5px;
  border: 1px solid #232323;
  background: #1e1e1e;
  color: #888;
  font-size: 12px;
  cursor: pointer;
  text-align: left;
  transition: all 0.1s;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 7px;
}
.place-btn:hover { border-color: #363636; color: #ddd; }
.place-btn.sel { border-color: #e86c3a; color: #fff; background: #261206; }
.pi { font-size: 13px; width: 16px; text-align: center; flex-shrink: 0; }
.size-grid { display: flex; flex-wrap: wrap; gap: 5px; }
.size-btn {
  min-width: 38px;
  height: 32px;
  padding: 0 8px;
  border-radius: 4px;
  border: 1px solid #232323;
  background: #1e1e1e;
  color: #888;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.1s;
  user-select: none;
}
.size-btn:hover { border-color: #363636; color: #ddd; }
.size-btn.sel { border-color: #e86c3a; color: #fff; background: #261206; }
.qty-row {
  display: flex;
  align-items: center;
  border: 1px solid #252525;
  border-radius: 5px;
  overflow: hidden;
  width: fit-content;
}
.qty-btn {
  width: 32px;
  height: 32px;
  background: #1e1e1e;
  border: none;
  color: #999;
  font-size: 17px;
  cursor: pointer;
  transition: all 0.1s;
}
.qty-btn:hover { background: #252525; color: #fff; }
.qty-val {
  width: 48px;
  height: 32px;
  background: #161616;
  border: none;
  border-left: 1px solid #252525;
  border-right: 1px solid #252525;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
}
.notes-ta {
  width: 100%;
  background: #1e1e1e;
  border: 1px solid #252525;
  border-radius: 5px;
  color: #bbb;
  padding: 8px 10px;
  font-size: 12px;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
  line-height: 1.5;
  transition: border-color 0.1s;
}
.notes-ta:focus { outline: none; border-color: #383838; }
.notes-ta::placeholder { color: #3a3a3a; }
.divider { height: 1px; background: #202020; margin: 14px 0; }
.preview {
  display: grid;
  grid-template-rows: 1fr auto auto;
  background: #0e0e0e;
  min-height: 0;
}
.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  position: relative;
  overflow: hidden;
}
.mockup-wrap {
  position: relative;
  max-width: 430px;
  width: 100%;
  background: #f8f8f8;
  border-radius: 10px;
  overflow: hidden;
  isolation: isolate;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
}
.mockup-img {
  width: 100%;
  height: auto;
  display: block;
  max-height: calc(100vh - 265px);
}
.colour-overlay {
  position: absolute;
  inset: 0;
  mix-blend-mode: multiply;
  pointer-events: none;
  opacity: 0;
  transition: background-color 0.2s, opacity 0.2s;
  z-index: 2;
}
.mockup-ph {
  width: 100%;
  max-width: 430px;
  min-height: 340px;
  background: #171717;
  border-radius: 10px;
  border: 2px dashed #242424;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #333;
}
.ph-icon { font-size: 48px; }
.ph-msg { font-size: 13px; text-align: center; max-width: 320px; line-height: 1.6; color: #3a3a3a; padding: 0 12px; }
.colour-note {
  position: absolute;
  top: 28px;
  right: 28px;
  background: #1e1e1e;
  border: 1px solid #2a2a2a;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 11px;
  color: #555;
  display: none;
}
.colour-note.visible { display: block; }
.colour-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
  vertical-align: middle;
  border: 1px solid rgba(255,255,255,0.15);
}
.sum-bar {
  background: #141414;
  border-top: 1px solid #222;
  padding: 12px 22px;
  display: flex;
  align-items: center;
  gap: 18px;
  flex-wrap: wrap;
  flex-shrink: 0;
}
.si { display: flex; flex-direction: column; gap: 2px; }
.sk {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: #3a3a3a;
}
.sv { font-size: 12px; font-weight: 600; color: #ccc; }
.sv.dim { color: #333; font-style: italic; font-weight: 400; }
.sum-actions { margin-left: auto; display: flex; gap: 7px; }
.btn {
  padding: 7px 14px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.1s;
}
.btn-ghost { background: #1c1c1c; border: 1px solid #2a2a2a; color: #999; }
.btn-ghost:hover { background: #222; color: #fff; }
.btn-primary { background: #e86c3a; color: #fff; }
.btn-primary:hover { background: #d05c2a; }
.dual-wrap {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding: 8px 16px;
}
.view-item {
  flex: 1;
  max-width: 390px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  min-width: 0;
}
.view-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #3a3a3a;
}
.canvas-dual {
  width: 100%;
  height: auto;
  max-height: calc(100vh - 250px);
  display: block;
  border-radius: 8px;
  background: #f8f8f8;
  box-shadow: 0 6px 28px rgba(0,0,0,0.45);
}
.logo-drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 10px;
  border-radius: 6px;
  border: 1px dashed #2e2e2e;
  background: #1a1a1a;
  color: #555;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.12s;
  width: 100%;
  text-align: center;
}
.logo-drop:hover, .logo-drop.drag-over {
  border-color: #e86c3a;
  color: #e86c3a;
  background: #1e1208;
}
.logo-drop input { display: none; }
.logo-drop-icon { font-size: 22px; }
.logo-loaded {
  display: none;
  margin-top: 10px;
  flex-direction: column;
  gap: 8px;
}
.logo-loaded.show { display: flex; }
.logo-thumb {
  width: 100%;
  max-height: 72px;
  object-fit: contain;
  background: repeating-conic-gradient(#222 0% 25%, #1a1a1a 0% 50%) 0 0 / 10px 10px;
  border-radius: 4px;
  border: 1px solid #2a2a2a;
  padding: 6px;
}
.logo-size-row {
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo-size-row span {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: #4a4a4a;
  white-space: nowrap;
}
.logo-size-row input[type=range] {
  flex: 1;
  accent-color: #e86c3a;
  height: 3px;
}
.logo-size-val {
  font-size: 11px;
  color: #555;
  min-width: 30px;
  text-align: right;
}
.logo-remove {
  padding: 5px 10px;
  border-radius: 4px;
  background: transparent;
  border: 1px solid #2a2a2a;
  color: #555;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.1s;
  align-self: flex-start;
}
.logo-remove:hover { border-color: #c0392b; color: #c0392b; }
.logo-offsets { margin-top: 10px; display: flex; flex-direction: column; gap: 5px; }
.offset-row {
  display: flex;
  align-items: center;
  gap: 7px;
}
.offset-icon { font-size: 12px; color: #4a4a4a; width: 14px; flex-shrink: 0; text-align: center; }
.offset-lbl { font-size: 10px; color: #4a4a4a; width: 14px; flex-shrink: 0; }
.offset-row input[type=range] {
  flex: 1;
  accent-color: #e86c3a;
  height: 3px;
}
.offset-val { font-size: 10px; color: #555; min-width: 22px; text-align: right; }

.quote-panel {
  background: #141414;
  border-top: 1px solid #252525;
  max-height: 220px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #2a2a2a transparent;
}
.qp-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 18px;
  border-bottom: 1px solid #1e1e1e;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  color: #555;
  position: sticky;
  top: 0;
  background: #141414;
}
.qp-total-badge {
  margin-left: auto;
  font-size: 12px;
  font-weight: 700;
  color: #e86c3a;
}
.qp-clear {
  background: none;
  border: none;
  color: #444;
  font-size: 11px;
  cursor: pointer;
  padding: 2px 6px;
}
.qp-clear:hover { color: #c0392b; }
.qp-list { padding: 6px 0; }
.qp-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 18px;
  border-bottom: 1px solid #1a1a1a;
  font-size: 12px;
}
.qp-item:last-child { border-bottom: none; }
.qp-item-thumb {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}
.qp-thumb {
  width: 36px;
  height: 44px;
  object-fit: contain;
  background: #f8f8f8;
  border-radius: 3px;
}
.qp-item-info { flex: 1; min-width: 0; }
.qp-item-name { font-weight: 600; color: #ddd; }
.qp-item-desc { color: #555; font-size: 11px; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.qp-item-price {
  text-align: right;
  flex-shrink: 0;
}
.qp-item-total { font-weight: 700; color: #e0e0e0; font-size: 13px; }
.qp-item-unit  { color: #444; font-size: 10px; margin-top: 1px; }
.qp-remove {
  background: none; border: none;
  color: #333; font-size: 14px;
  cursor: pointer; padding: 2px 4px;
  flex-shrink: 0;
}
.qp-remove:hover { color: #c0392b; }

#print-quote { display: none; }
@media print {
  body > *:not(#print-quote) { display: none !important; }
  #print-quote {
    display: block !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 12px;
    color: #111;
    background: #fff;
    padding: 32px 40px;
  }
}
.pq-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid #111;
}
.pq-brand { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
.pq-brand span { color: #e86c3a; }
.pq-meta { text-align: right; }
.pq-quote-num { font-size: 15px; font-weight: 700; }
.pq-date { color: #666; margin-top: 2px; }
.pq-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.pq-table th {
  background: #111;
  color: #fff;
  padding: 8px 12px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.pq-table th:last-child,
.pq-table td:last-child { text-align: right; }
.pq-table th:nth-child(3),
.pq-table td:nth-child(3) { text-align: center; }
.pq-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: top;
}
.pq-item-label { font-weight: 700; font-size: 13px; margin-bottom: 4px; }
.pq-desc { color: #444; line-height: 1.7; font-size: 11px; }
.pq-totals {
  margin-left: auto;
  width: 240px;
  border-top: 2px solid #111;
  padding-top: 10px;
}
.pq-total-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 12px;
  color: #444;
}
.pq-grand {
  font-size: 15px;
  font-weight: 800;
  color: #111;
  border-top: 1px solid #ccc;
  margin-top: 6px;
  padding-top: 8px;
}
.pq-footer {
  margin-top: 32px;
  color: #888;
  font-size: 11px;
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
}
`;

const BUILDER_SCRIPT = String.raw`
(function(){
function hexToRgb(hex) {
    const v = hex.replace('#','');
    return { r: parseInt(v.slice(0,2),16), g: parseInt(v.slice(2,4),16), b: parseInt(v.slice(4,6),16) };
}
function rgbToHsl(r, g, b) {
    r/=255; g/=255; b/=255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b);
    let h=0, s=0, l=(max+min)/2;
    if (max !== min) {
        const d=max-min;
        s = l>0.5 ? d/(2-max-min) : d/(max+min);
        switch(max){
            case r: h=((g-b)/d+(g<b?6:0))/6; break;
            case g: h=((b-r)/d+2)/6; break;
            case b: h=((r-g)/d+4)/6; break;
        }
    }
    return [h, s, l];
}
function hslToRgb(h, s, l) {
    if (s === 0) { const v=Math.round(l*255); return [v,v,v]; }
    const q = l<0.5 ? l*(1+s) : l+s-l*s;
    const p = 2*l-q;
    const hue2 = (t) => {
        if(t<0)t+=1; if(t>1)t-=1;
        if(t<1/6)return p+(q-p)*6*t;
        if(t<1/2)return q;
        if(t<2/3)return p+(q-p)*(2/3-t)*6;
        return p;
    };
    return [Math.round(hue2(h+1/3)*255), Math.round(hue2(h)*255), Math.round(hue2(h-1/3)*255)];
}

let loadedLogoFront = null, loadedLogoBack = null;
let logoSizeFront   = 20,   logoSizeBack   = 20;
let logoFrontProduct = null, logoBackProduct = null;
let logoOffsetFrontX = 0, logoOffsetFrontY = 0;
let logoOffsetBackX  = 0, logoOffsetBackY  = 0;

window.handleLogoFile = function(side, file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
        const img = new Image();
        img.onload = () => {
            if (side === 'front') {
                loadedLogoFront = img;
                logoFrontProduct = S.product;
                document.getElementById('logo-thumb-front').src = e.target.result;
                document.getElementById('logo-loaded-front').classList.add('show');
                drawCanvas();
            } else {
                loadedLogoBack = img;
                logoBackProduct = S.product;
                document.getElementById('logo-thumb-back').src = e.target.result;
                document.getElementById('logo-loaded-back').classList.add('show');
                drawCanvasBack();
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

window.onLogoSize = function(side, val) {
    if (side === 'front') {
        logoSizeFront = parseInt(val);
        document.getElementById('logo-size-val-front').textContent = val + '%';
        drawCanvas();
    } else {
        logoSizeBack = parseInt(val);
        document.getElementById('logo-size-val-back').textContent = val + '%';
        drawCanvasBack();
    }
};

window.removeLogo = function(side) {
    if (side === 'front') {
        loadedLogoFront = null;
        document.getElementById('logo-file-front').value = '';
        document.getElementById('logo-thumb-front').src  = '';
        document.getElementById('logo-loaded-front').classList.remove('show');
        drawCanvas();
    } else {
        loadedLogoBack = null;
        document.getElementById('logo-file-back').value = '';
        document.getElementById('logo-thumb-back').src  = '';
        document.getElementById('logo-loaded-back').classList.remove('show');
        drawCanvasBack();
    }
};

function drawLogo(ctx, cw, ch, logo, sizePct, placementId, offsetX, offsetY) {
    offsetX = offsetX || 0; offsetY = offsetY || 0;
    if (!logo) return;
    let cx = cw * 0.5, cy = ch * 0.42;
    if (placementId && S.product) {
        const pl = PRODUCTS[S.product].placements.find(x => x.id === placementId);
        if (pl) {
            cx = parseFloat(pl.dot.left) / 100 * cw;
            cy = parseFloat(pl.dot.top)  / 100 * ch;
        }
    }
    cx += (offsetX / 100) * cw;
    cy += (offsetY / 100) * ch;
    const lw = (sizePct / 100) * cw;
    const lh = lw * (logo.naturalHeight / logo.naturalWidth);
    ctx.drawImage(logo, cx - lw / 2, cy - lh / 2, lw, lh);
}

window.onOffsetChange = function(side, axis, val) {
    const v = parseInt(val);
    if (side === 'front') {
        if (axis === 'x') logoOffsetFrontX = v; else logoOffsetFrontY = v;
        document.getElementById('offset-front-' + axis + '-val').textContent = v;
        drawCanvas();
    } else {
        if (axis === 'x') logoOffsetBackX = v; else logoOffsetBackY = v;
        document.getElementById('offset-back-' + axis + '-val').textContent = v;
        drawCanvasBack();
    }
};

let loadedImg     = null;
let loadedBackImg = null;

function isDualView() {
    return !!(S.product && PRODUCTS[S.product].backImage);
}

function drawCanvas() {
    const dual   = isDualView();
    const canvas = document.getElementById(dual ? 'canvas-front' : 'mockup-canvas');
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    if (!loadedImg) return;

    const MAX = 1200;
    let w = loadedImg.naturalWidth, h = loadedImg.naturalHeight;
    if (w > MAX) { h = Math.round(h*MAX/w); w = MAX; }
    if (h > MAX) { w = Math.round(w*MAX/h); h = MAX; }
    canvas.width = w; canvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(loadedImg, 0, 0, w, h);

    const pData = S.product ? PRODUCTS[S.product] : null;
    const frontLogo = (logoFrontProduct === S.product) ? loadedLogoFront : null;
    const drawFrontLogo = () => drawLogo(ctx, w, h, frontLogo, logoSizeFront, S.placement, logoOffsetFrontX, logoOffsetFrontY);

    if (pData && pData.colourImages && S.colour && pData.colourImages[S.colour]) {
        drawFrontLogo();
        if (dual) drawCanvasBack();
        return;
    }

    const colour = S.colour ? COLOURS.find(c => c.id === S.colour) : null;
    if (!colour) {
        drawFrontLogo();
        if (dual) drawCanvasBack();
        return;
    }

    let imageData;
    try {
        imageData = ctx.getImageData(0, 0, w, h);
    } catch(e) {
        const ov = document.getElementById('colour-overlay');
        ov.style.backgroundColor = colour.hex;
        ov.style.opacity = '0.85';
        drawFrontLogo();
        if (dual) drawCanvasBack();
        return;
    }

    document.getElementById('colour-overlay').style.opacity = '0';
    tintPixels(imageData.data, colour.hex);
    ctx.putImageData(imageData, 0, 0);
    drawFrontLogo();
    if (dual) drawCanvasBack();
}

function drawCanvasBack() {
    if (!loadedBackImg) return;
    const canvas = document.getElementById('canvas-back');
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');

    const MAX = 1200;
    let w = loadedBackImg.naturalWidth, h = loadedBackImg.naturalHeight;
    if (w > MAX) { h = Math.round(h*MAX/w); w = MAX; }
    if (h > MAX) { w = Math.round(w*MAX/h); h = MAX; }
    canvas.width = w; canvas.height = h;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(loadedBackImg, 0, 0, w, h);

    const p = S.product ? PRODUCTS[S.product] : null;
    const hasRealBackPhoto = p && p.backColourImages && S.colour && p.backColourImages[S.colour];
    if (!hasRealBackPhoto) {
        const colour = S.colour ? COLOURS.find(c => c.id === S.colour) : null;
        if (colour) {
            try {
                const imageData = ctx.getImageData(0, 0, w, h);
                tintPixels(imageData.data, colour.hex);
                ctx.putImageData(imageData, 0, 0);
            } catch(e) {}
        }
    }

    const backLogo = (logoBackProduct === S.product) ? loadedLogoBack : null;
    drawLogo(ctx, w, h, backLogo, logoSizeBack, S.placementBack, logoOffsetBackX, logoOffsetBackY);
}

function tintPixels(data, hex) {
    const t  = hexToRgb(hex);
    const [th, ts] = rgbToHsl(t.r, t.g, t.b);

    for (let i = 0; i < data.length; i += 4) {
        const r=data[i], g=data[i+1], b=data[i+2], a=data[i+3];
        if (a < 30) continue;
        const [, s, l] = rgbToHsl(r, g, b);
        if (l > 0.88 && s < 0.15) continue;
        if (l < 0.12) continue;
        const newS = ts * (0.25 + 0.75 * Math.min(s * 3, 1));
        const [nr, ng, nb] = hslToRgb(th, newS, l);
        data[i]=nr; data[i+1]=ng; data[i+2]=nb;
    }
}

const APPAREL_PLACEMENTS = [
    { id: 'front-center',  label: 'Front Centre',      view: 'front', dot: { top: '40%', left: '50%' } },
    { id: 'front-chest',   label: 'Front Left Chest',  view: 'front', dot: { top: '27%', left: '36%' } },
    { id: 'left-sleeve',   label: 'Left Sleeve',       view: 'front', dot: { top: '30%', left: '18%' } },
    { id: 'right-sleeve',  label: 'Right Sleeve',      view: 'front', dot: { top: '30%', left: '82%' } },
    { id: 'back-center',   label: 'Back Centre',       view: 'back',  dot: { top: '40%', left: '50%' } },
    { id: 'back-upper',    label: 'Back Upper',        view: 'back',  dot: { top: '20%', left: '50%' } },
];

const PRODUCTS = {
    jacket: {
        label: 'Rain Jacket',  icon: '🌧️', price: 89.00,
        image: '/mockups/rain-jackets/rain-jacket-black.png',
        colourImages: {
            'black':  '/mockups/rain-jackets/rain-jacket-black.png',
            'blue':   '/mockups/rain-jackets/rain-jacket-blue.png',
            'forest': '/mockups/rain-jackets/rain-jacket-green.png',
            'khaki':  '/mockups/rain-jackets/rain-jacket-khaki.png',
            'navy':   '/mockups/rain-jackets/rain-jacket-navy.png',
            'red':    '/mockups/rain-jackets/rain-jacket-red.png',
        },
        backImage: '/mockups/rain-jackets/rain-jacket-black-back.png',
        backColourImages: {
            'black':  '/mockups/rain-jackets/rain-jacket-black-back.png',
            'blue':   '/mockups/rain-jackets/rain-jacket-blue-back.png',
            'forest': '/mockups/rain-jackets/rain-jacket-green-back.png',
            'khaki':  '/mockups/rain-jackets/rain-jacket-khaki-back.png',
            'navy':   '/mockups/rain-jackets/rain-jacket-navy-back.png',
            'red':    '/mockups/rain-jackets/rain-jacket-red-back.png',
        },
        availableColours: ['black', 'blue', 'forest', 'khaki', 'navy', 'red'],
        styles: ['Standard'],
        sizes: ['XS','S','M','L','XL','2XL','3XL'],
        placements: [
            { id: 'front-center',  label: 'Front Centre',      view: 'front', dot: { top: '42%', left: '50%' } },
            { id: 'front-chest',   label: 'Front Left Chest',  view: 'front', dot: { top: '28%', left: '38%' } },
            { id: 'left-sleeve',   label: 'Left Sleeve',       view: 'front', dot: { top: '36%', left: '16%' } },
            { id: 'right-sleeve',  label: 'Right Sleeve',      view: 'front', dot: { top: '36%', left: '84%' } },
            { id: 'back-center',   label: 'Back Centre',       view: 'back',  dot: { top: '42%', left: '50%' } },
            { id: 'back-upper',    label: 'Back Upper / Yoke', view: 'back',  dot: { top: '24%', left: '50%' } },
        ],
    },
    singlet: {
        label: 'Singlet',      icon: '🎽', price: 30.00,
        image: '/mockups/singlets/singlet-black-front.png',
        colourImages: {
            'beige': '/mockups/singlets/singlet-beige-front.png',
            'black': '/mockups/singlets/singlet-black-front.png',
            'blue':  '/mockups/singlets/singlet-blue-front.png',
            'brown': '/mockups/singlets/singlet-brown-front.png',
            'khaki': '/mockups/singlets/singlet-khaki-front.png',
            'navy':  '/mockups/singlets/singlet-navy-blue-front.png',
            'red':   '/mockups/singlets/singlet-red-front.png',
        },
        backImage: '/mockups/singlets/singlet-black-back.png',
        backColourImages: {
            'beige': '/mockups/singlets/singlet-beige-back.png',
            'black': '/mockups/singlets/singlet-black-back.png',
            'blue':  '/mockups/singlets/singlet-blue-back.png',
            'brown': '/mockups/singlets/singlet-brown-back.png',
            'khaki': '/mockups/singlets/singlet-khaki-back.png',
            'navy':  '/mockups/singlets/singlet-navy-blue-back.png',
            'red':   '/mockups/singlets/singlet-red-back.png',
        },
        availableColours: ['beige', 'black', 'blue', 'brown', 'khaki', 'navy', 'red'],
        styles: ['Racerback', 'Standard'],
        sizes: ['XS','S','M','L','XL','2XL'],
        placements: [
            { id: 'front-center', label: 'Front Centre',     view: 'front', dot: { top: '38%', left: '50%' } },
            { id: 'front-chest',  label: 'Front Left Chest', view: 'front', dot: { top: '25%', left: '36%' } },
            { id: 'back-center',  label: 'Back Centre',      view: 'back',  dot: { top: '38%', left: '50%' } },
        ],
    },
    bottle: {
        label: 'Insulated Bottle', icon: '🍶', price: 35.00,
        image: '/bottle-mockup.png',
        styles: ['Standard'],
        sizes: ['350ml', '500ml', '750ml'],
        placements: [
            { id: 'front',      label: 'Front',          dot: { top: '40%', left: '50%' } },
            { id: 'back',       label: 'Back',           dot: { top: '40%', left: '50%' } },
            { id: 'wrap',       label: 'Wrap Around',    dot: { top: '40%', left: '50%' } },
        ],
    },
    sportsbottle: {
        label: 'Sports Bottle', icon: '🥤', price: 28.00,
        image: '/sports-bottle-mockup.png',
        styles: ['Standard'],
        sizes: ['500ml', '750ml', '1L'],
        placements: [
            { id: 'front', label: 'Front', dot: { top: '40%', left: '50%' } },
            { id: 'back',  label: 'Back',  dot: { top: '40%', left: '50%' } },
            { id: 'wrap',  label: 'Wrap Around', dot: { top: '40%', left: '50%' } },
        ],
    },
    cap: {
        label: 'Cap',          icon: '🧢', price: 28.00,
        image: '/cap-mockup.png',
        styles: ['Snapback', 'Dad Cap', 'Trucker'],
        sizes: ['One Size', 'S/M', 'L/XL'],
        placements: [
            { id: 'front',      label: 'Front Panel',    dot: { top: '38%', left: '50%' } },
            { id: 'side-left',  label: 'Side Panel',     dot: { top: '38%', left: '20%' } },
            { id: 'back',       label: 'Back Panel',     dot: { top: '38%', left: '50%' } },
        ],
    },
    hoodie: {
        label: 'Hoodie',       icon: '🧥', price: 55.00,
        image: '/hoodie-mockup.png',
        styles: ['Pullover Hoodie', 'Zip-Up Hoodie', 'Crewneck'],
        sizes: ['XS','S','M','L','XL','2XL','3XL'],
        placements: APPAREL_PLACEMENTS,
    },
    tote: {
        label: 'Tote Bag',     icon: '👜', price: 22.00,
        image: '/tote-mockup.png',
        styles: ['Standard', 'Long Handle', 'Heavy Canvas'],
        sizes: ['One Size'],
        placements: [
            { id: 'front-center', label: 'Front Centre', dot: { top: '50%', left: '50%' } },
            { id: 'front-lower',  label: 'Front Lower',  dot: { top: '68%', left: '50%' } },
        ],
    },
    pen: {
        label: 'Pen',          icon: '🖊️', price: 4.50,
        image: '/pen-mockup.png',
        styles: ['Standard', 'Metal Twist', 'Soft Touch'],
        sizes: ['One Size'],
        placements: [
            { id: 'barrel', label: 'Barrel', dot: { top: '50%', left: '50%' } },
            { id: 'clip',   label: 'Clip',   dot: { top: '30%', left: '50%' } },
        ],
    },
    giftbox: {
        label: 'Gift Box',     icon: '🎁', price: 65.00,
        image: '/giftbox-mockup.png',
        styles: ['Sponsor Kit', 'Client Gift', 'Staff Welcome'],
        sizes: ['Small', 'Medium', 'Large'],
        placements: [
            { id: 'lid-center', label: 'Lid Centre', dot: { top: '50%', left: '50%' } },
        ],
    },
};

const COLOURS = [
    { id: 'black',      label: 'Black',        hex: '#111111' },
    { id: 'white',      label: 'White',        hex: '#f0f0f0' },
    { id: 'navy',       label: 'Navy',         hex: '#1b2a4a' },
    { id: 'grey',       label: 'Grey',         hex: '#707070' },
    { id: 'forest',     label: 'Forest Green', hex: '#2d5a2d' },
    { id: 'burgundy',   label: 'Burgundy',     hex: '#6b1a1a' },
    { id: 'royal-blue', label: 'Royal Blue',   hex: '#2251a3' },
    { id: 'red',        label: 'Red',          hex: '#c0392b' },
    { id: 'mustard',    label: 'Mustard',      hex: '#c8930a' },
    { id: 'pink',       label: 'Pink',         hex: '#d4748a' },
    { id: 'orange',     label: 'Orange',       hex: '#e86c3a' },
    { id: 'sky-blue',   label: 'Sky Blue',     hex: '#5ba3d0' },
    { id: 'sand',       label: 'Sand',         hex: '#c8b89a' },
    { id: 'olive',      label: 'Olive',        hex: '#6b6b3a' },
    { id: 'purple',     label: 'Purple',       hex: '#5a2d82' },
    { id: 'brown',      label: 'Brown',        hex: '#5c3a1e' },
    { id: 'beige',      label: 'Beige',        hex: '#d4c5a9' },
    { id: 'blue',       label: 'Blue',         hex: '#2a6cb5' },
    { id: 'khaki',      label: 'Khaki',        hex: '#8b7355' },
];

const S = { product: null, style: null, colour: null, placement: null, placementBack: null, size: null, qty: 1 };

function buildTabs() {
    const bar = document.getElementById('product-bar');
    bar.innerHTML = Object.entries(PRODUCTS).map(([id, p]) =>
        '<div class="prod-tab" data-pid="' + id + '" onclick="switchProduct(\'' + id + '\')">' +
        '<span class="ti">' + p.icon + '</span>' + p.label +
        '</div>'
    ).join('');
}

function renderOpts() {
    if (!S.product) return;
    const p = PRODUCTS[S.product];

    document.getElementById('style-list').innerHTML = p.styles.map(s =>
        '<div class="style-opt ' + (S.style === s ? 'sel' : '') + '" onclick="pick(\'style\',\'' + s + '\')">' + p.icon + ' ' + s + '</div>'
    ).join('');

    const swatchList = p.availableColours
        ? COLOURS.filter(c => p.availableColours.includes(c.id))
        : COLOURS;
    document.getElementById('swatches').innerHTML = swatchList.map(c =>
        '<div class="sw-wrap">' +
        '<div class="swatch ' + (S.colour === c.id ? 'sel' : '') + '" ' +
             'style="background:' + c.hex + '; border-color:' + (c.id==='white'?'#999':c.hex) + ';" ' +
             'onclick="pick(\'colour\',\'' + c.id + '\')"></div>' +
        '<div class="sw-tip">' + c.label + '</div>' +
        '</div>'
    ).join('');

    const frontPlacements = p.placements.filter(pl => !pl.view || pl.view === 'front');
    const backPlacements  = p.placements.filter(pl => pl.view === 'back');

    document.getElementById('place-list-front').innerHTML = frontPlacements.map(pl =>
        '<div class="place-btn ' + (S.placement === pl.id ? 'sel' : '') + '" onclick="pick(\'placement\',\'' + pl.id + '\')">' +
        '<span class="pi">&#x25CF;</span>' + pl.label +
        '</div>'
    ).join('');

    document.getElementById('place-list-back').innerHTML = backPlacements.map(pl =>
        '<div class="place-btn ' + (S.placementBack === pl.id ? 'sel' : '') + '" onclick="pick(\'placementBack\',\'' + pl.id + '\')">' +
        '<span class="pi">&#x25CF;</span>' + pl.label +
        '</div>'
    ).join('');

    document.getElementById('back-logo-wrap').style.display =
        (p.backImage && backPlacements.length) ? 'block' : 'none';

    document.getElementById('size-grid').innerHTML = p.sizes.map(s =>
        '<button class="size-btn ' + (S.size === s ? 'sel' : '') + '" onclick="pick(\'size\',\'' + s + '\')">' + s + '</button>'
    ).join('');
}

function getImageSrc() {
    if (!S.product) return null;
    const p = PRODUCTS[S.product];
    if (S.colour && p.colourImages && p.colourImages[S.colour]) return p.colourImages[S.colour];
    return p.image;
}

function getBackImageSrc() {
    if (!S.product) return null;
    const p = PRODUCTS[S.product];
    if (!p.backImage) return null;
    if (S.colour && p.backColourImages && p.backColourImages[S.colour]) return p.backColourImages[S.colour];
    return p.backImage;
}

function renderMockup() {
    const singleWrap   = document.getElementById('mockup-wrap');
    const singleCanvas = document.getElementById('mockup-canvas');
    const dualWrap     = document.getElementById('dual-wrap');
    const ph           = document.getElementById('mockup-ph');

    if (!S.product) {
        singleWrap.style.display   = 'none';
        dualWrap.style.display     = 'none';
        ph.style.display           = 'flex';
        document.getElementById('ph-icon').textContent = '👕';
        document.getElementById('ph-msg').textContent  = 'Select a product above to load its mockup.';
        return;
    }

    const p        = PRODUCTS[S.product];
    const src      = getImageSrc();
    const backSrc  = getBackImageSrc();
    document.getElementById('ph-icon').textContent = p.icon;
    document.getElementById('ph-msg').textContent  = 'Loading…';
    ph.style.display           = 'flex';
    singleWrap.style.display   = 'none';
    dualWrap.style.display     = 'none';
    loadedImg = null; loadedBackImg = null;

    if (p.backImage) {
        let frontDone = false, backDone = false;
        function tryShow() {
            if (!frontDone || !backDone) return;
            drawCanvas();
            ph.style.display       = 'none';
            dualWrap.style.display = 'flex';
        }
        const front = new Image();
        front.onload  = () => { loadedImg = front;     frontDone = true; tryShow(); };
        front.onerror = () => { document.getElementById('ph-msg').textContent = 'Front image not found: ' + src; };
        front.src = src;

        const back = new Image();
        back.onload  = () => { loadedBackImg = back; backDone = true; tryShow(); };
        back.onerror = () => { document.getElementById('ph-msg').textContent = 'Back image not found: ' + backSrc; };
        back.src = backSrc;
    } else {
        const img = new Image();
        img.onload = () => {
            loadedImg = img;
            drawCanvas();
            singleCanvas.style.display = 'block';
            singleWrap.style.display   = 'block';
            ph.style.display           = 'none';
        };
        img.onerror = () => {
            document.getElementById('ph-msg').textContent = 'Image not found: ' + src;
        };
        img.src = src;
    }
}

function renderColourBadge() {
    const note = document.getElementById('colour-note');
    if (!S.colour || !S.product) { note.classList.remove('visible'); return; }
    const c = COLOURS.find(x => x.id === S.colour);
    if (!c) return;
    document.getElementById('colour-dot').style.background = c.hex;
    document.getElementById('colour-note-text').textContent = c.label;
    note.classList.add('visible');
}

const productSessions = {};
function saveProductSession(productId) {
    if (!productId) return;
    productSessions[productId] = {
        style: S.style,
        colour: S.colour,
        placement: S.placement,
        placementBack: S.placementBack,
        size: S.size,
        qty: S.qty,
        notes: document.getElementById('notes').value,
        logoFront: (loadedLogoFront && logoFrontProduct === productId)
            ? { src: document.getElementById('logo-thumb-front').src, size: logoSizeFront, ox: logoOffsetFrontX, oy: logoOffsetFrontY }
            : null,
        logoBack: (loadedLogoBack && logoBackProduct === productId)
            ? { src: document.getElementById('logo-thumb-back').src, size: logoSizeBack, ox: logoOffsetBackX, oy: logoOffsetBackY }
            : null,
    };
}

function restoreLogos(session, productId) {
    const restore = (side, saved) => {
        if (!saved || !saved.src) return;
        const img = new Image();
        img.onload = () => {
            if (S.product !== productId) return;
            if (side === 'front') {
                loadedLogoFront = img; logoFrontProduct = productId;
                logoSizeFront   = saved.size;
                logoOffsetFrontX = saved.ox || 0; logoOffsetFrontY = saved.oy || 0;
                document.getElementById('logo-thumb-front').src              = saved.src;
                document.getElementById('logo-loaded-front').classList.add('show');
                document.getElementById('logo-size-front').value             = saved.size;
                document.getElementById('logo-size-val-front').textContent   = saved.size + '%';
                document.getElementById('offset-front-x').value             = saved.ox || 0;
                document.getElementById('offset-front-y').value             = saved.oy || 0;
                document.getElementById('offset-front-x-val').textContent   = saved.ox || 0;
                document.getElementById('offset-front-y-val').textContent   = saved.oy || 0;
                drawCanvas();
            } else {
                loadedLogoBack = img; logoBackProduct = productId;
                logoSizeBack   = saved.size;
                logoOffsetBackX = saved.ox || 0; logoOffsetBackY = saved.oy || 0;
                document.getElementById('logo-thumb-back').src               = saved.src;
                document.getElementById('logo-loaded-back').classList.add('show');
                document.getElementById('logo-size-back').value              = saved.size;
                document.getElementById('logo-size-val-back').textContent    = saved.size + '%';
                document.getElementById('offset-back-x').value              = saved.ox || 0;
                document.getElementById('offset-back-y').value              = saved.oy || 0;
                document.getElementById('offset-back-x-val').textContent    = saved.ox || 0;
                document.getElementById('offset-back-y-val').textContent    = saved.oy || 0;
                drawCanvasBack();
            }
        };
        img.src = saved.src;
    };
    restore('front', session.logoFront);
    restore('back',  session.logoBack);
}

function clearLogos() {
    loadedLogoFront = null; loadedLogoBack = null;
    logoFrontProduct = null; logoBackProduct = null;
    logoSizeFront = 20; logoSizeBack = 20;
    logoOffsetFrontX = 0; logoOffsetFrontY = 0;
    logoOffsetBackX  = 0; logoOffsetBackY  = 0;
    ['front', 'back'].forEach(side => {
        const fi = document.getElementById('logo-file-' + side);
        const th = document.getElementById('logo-thumb-' + side);
        const ld = document.getElementById('logo-loaded-' + side);
        const sz = document.getElementById('logo-size-' + side);
        const sv = document.getElementById('logo-size-val-' + side);
        if (fi) fi.value = '';
        if (th) th.src = '';
        if (ld) ld.classList.remove('show');
        if (sz) sz.value = 20;
        if (sv) sv.textContent = '20%';
        ['x','y'].forEach(axis => {
            const sl = document.getElementById('offset-' + side + '-' + axis);
            const vl = document.getElementById('offset-' + side + '-' + axis + '-val');
            if (sl) sl.value = 0;
            if (vl) vl.textContent = '0';
        });
    });
}

window.switchProduct = function(id) {
    saveProductSession(S.product);
    S.product = id; S.style = null; S.placement = null; S.placementBack = null; S.size = null;
    const newP = PRODUCTS[id];
    loadedImg = null; loadedBackImg = null;
    clearLogos();
    document.getElementById('colour-overlay').style.opacity = '0';

    const session = productSessions[id];
    if (session) {
        S.style         = session.style;
        S.placement     = session.placement;
        S.placementBack = session.placementBack;
        S.size          = session.size;
        S.qty           = session.qty;
        document.getElementById('qty').value   = session.qty;
        document.getElementById('notes').value = session.notes;
        if (session.colour && (!newP.availableColours || newP.availableColours.includes(session.colour))) {
            S.colour = session.colour;
        }
    } else if (newP.availableColours && S.colour && !newP.availableColours.includes(S.colour)) {
        S.colour = null;
    }

    document.querySelectorAll('.prod-tab').forEach(t =>
        t.classList.toggle('active', t.dataset.pid === id));
    renderOpts();
    renderMockup();
    renderColourBadge();
    updateSummary();

    if (session) restoreLogos(session, id);
};

window.pick = function(field, val) {
    S[field] = val;
    renderOpts();
    if (field === 'placement')     { if (loadedLogoFront) drawCanvas(); }
    if (field === 'placementBack') { if (loadedLogoBack)  drawCanvasBack(); }
    if (field === 'colour') {
        const p = S.product ? PRODUCTS[S.product] : null;
        if (p && p.colourImages && p.colourImages[val]) {
            renderMockup();
        } else {
            drawCanvas();
        }
        renderColourBadge();
    }
    updateSummary();
};

window.changeQty = function(d) {
    const el = document.getElementById('qty');
    el.value = Math.max(1, (parseInt(el.value) || 1) + d);
    updateSummary();
};

window.updateSummary = function() {
    S.qty = parseInt(document.getElementById('qty').value) || 1;

    const colourLabel = S.colour ? (COLOURS.find(c => c.id === S.colour) || {}).label || S.colour : null;
    const plLabel = (id) => {
        if (!id || !S.product) return null;
        const pl = PRODUCTS[S.product].placements.find(p => p.id === id);
        return pl ? pl.label : id;
    };
    const placementLabel = [plLabel(S.placement), plLabel(S.placementBack)].filter(Boolean).join(' / ') || null;

    const price = S.product ? PRODUCTS[S.product].price : null;
    const lineTotal = price ? price * S.qty : null;

    sv('s-product',    S.product ? PRODUCTS[S.product].label : null);
    sv('s-style',      S.style);
    sv('s-colour',     colourLabel);
    sv('s-placement',  placementLabel);
    sv('s-size',       S.size);
    sv('s-unit-price', price     ? '$' + price.toFixed(2)     : null);
    sv('s-line-total', lineTotal ? '$' + lineTotal.toFixed(2) : null);
    document.getElementById('s-qty').textContent = S.qty;
};
function updateSummary() { window.updateSummary(); }

function sv(id, val) {
    const el = document.getElementById(id);
    if (val) { el.textContent = val; el.classList.remove('dim'); }
    else      { el.textContent = '—'; el.classList.add('dim'); }
}

window.resetAll = function() {
    S.style = null; S.colour = null; S.placement = null; S.placementBack = null; S.size = null; S.qty = 1;
    document.getElementById('qty').value   = 1;
    document.getElementById('notes').value = '';
    document.getElementById('colour-overlay').style.opacity = '0';
    ['front','back'].forEach(side => {
        document.getElementById('logo-file-' + side).value = '';
        document.getElementById('logo-thumb-' + side).src  = '';
        document.getElementById('logo-loaded-' + side).classList.remove('show');
    });
    loadedLogoFront = null; loadedLogoBack = null;
    renderOpts();
    drawCanvas();
    renderColourBadge();
    updateSummary();
};

window.copySpec = function() {
    const colourLabel = S.colour ? ((COLOURS.find(c => c.id === S.colour) || {}).label || S.colour) : '—';
    const plLabel = (id) => {
        if (!id || !S.product) return null;
        const pl = PRODUCTS[S.product].placements.find(p => p.id === id);
        return pl ? pl.label : id;
    };
    const placementLabel = [plLabel(S.placement), plLabel(S.placementBack)].filter(Boolean).join(' / ') || '—';
    const notes = document.getElementById('notes').value.trim();
    const date  = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const lines = [
        'NOVAMERCH MOCKUP SPEC',
        '─────────────────────────',
        'Product     ' + (S.product ? PRODUCTS[S.product].label : '—'),
        'Style       ' + (S.style      || '—'),
        'Colour      ' + colourLabel,
        'Placement   ' + placementLabel,
        'Size        ' + (S.size       || '—'),
        'Quantity    ' + S.qty,
        notes ? 'Notes       ' + notes : null,
        '─────────────────────────',
        'Date        ' + date,
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(lines).then(() => {
        const btn = document.getElementById('copy-btn');
        btn.textContent = 'Copied ✓';
        btn.style.color = '#7dd87d'; btn.style.borderColor = '#3a6a3a';
        setTimeout(() => { btn.textContent = 'Copy Spec'; btn.style.color = ''; btn.style.borderColor = ''; }, 2200);
    });
};

let quoteItems = [];

window.addToQuote = function() {
    if (!S.product) return;
    const p = PRODUCTS[S.product];

    const getFront = () => {
        try { return (document.getElementById(p.backImage ? 'canvas-front' : 'mockup-canvas') || {}).toDataURL ? document.getElementById(p.backImage ? 'canvas-front' : 'mockup-canvas').toDataURL() : null; }
        catch(e) { return null; }
    };
    const getBack = () => {
        try { return p.backImage && document.getElementById('canvas-back') ? document.getElementById('canvas-back').toDataURL() : null; }
        catch(e) { return null; }
    };

    const colour = S.colour ? ((COLOURS.find(c => c.id === S.colour) || {}).label || '') : '';
    const plFront = S.placement     ? ((p.placements.find(x => x.id === S.placement) || {}).label || '') : '';
    const plBack  = S.placementBack ? ((p.placements.find(x => x.id === S.placementBack) || {}).label || '') : '';

    quoteItems.push({
        id: Date.now(),
        label: p.label,
        style: S.style || '',
        colour,
        size: S.size || '',
        qty: S.qty,
        plFront, plBack,
        notes: document.getElementById('notes').value.trim(),
        unitPrice: p.price,
        imgFront: getFront(),
        imgBack: getBack(),
    });

    renderQuotePanel();

    const btn = document.getElementById('add-quote-btn');
    btn.textContent = 'Added ✓';
    btn.style.color = '#7dd87d'; btn.style.borderColor = '#3a6a3a';
    setTimeout(() => { btn.textContent = '+ Add to Quote'; btn.style.color = ''; btn.style.borderColor = ''; }, 1800);
};

window.removeQuoteItem = function(id) {
    quoteItems = quoteItems.filter(x => x.id !== id);
    renderQuotePanel();
};

window.clearQuote = function() {
    quoteItems = [];
    renderQuotePanel();
};

function quoteSubtotal() {
    return quoteItems.reduce((s, i) => s + i.unitPrice * i.qty, 0);
}

function renderQuotePanel() {
    const panel = document.getElementById('quote-panel');
    const list  = document.getElementById('qp-list');
    const count = document.getElementById('qp-count');
    const grand = document.getElementById('qp-grand-total');
    const printBtn = document.getElementById('print-btn');

    if (quoteItems.length === 0) {
        panel.style.display = 'none';
        printBtn.textContent = 'Print / Save PDF';
        return;
    }

    panel.style.display = 'block';
    const sub = quoteSubtotal();
    const total = sub * 1.1;
    count.textContent = quoteItems.length + ' item' + (quoteItems.length > 1 ? 's' : '');
    grand.textContent = 'Total (inc. GST): $' + total.toFixed(2);
    printBtn.textContent = 'Print Quote (' + quoteItems.length + ')';

    list.innerHTML = quoteItems.map(item =>
        '<div class="qp-item">' +
        '<div class="qp-item-thumb">' +
        (item.imgFront ? '<img class="qp-thumb" src="' + item.imgFront + '">' : '') +
        (item.imgBack  ? '<img class="qp-thumb" src="' + item.imgBack + '">' : '') +
        '</div>' +
        '<div class="qp-item-info">' +
        '<div class="qp-item-name">' + item.label + '</div>' +
        '<div class="qp-item-desc">' + [item.style, item.colour, item.size].filter(Boolean).join(' · ') + (item.qty > 1 ? ' · Qty: ' + item.qty : '') + '</div>' +
        '</div>' +
        '<div class="qp-item-price">' +
        '<div class="qp-item-total">$' + (item.unitPrice * item.qty).toFixed(2) + '</div>' +
        '<div class="qp-item-unit">$' + item.unitPrice.toFixed(2) + ' ea</div>' +
        '</div>' +
        '<button class="qp-remove" onclick="removeQuoteItem(' + item.id + ')">✕</button>' +
        '</div>'
    ).join('');
}

window.printQuote = function() {
    const pq = document.getElementById('print-quote');

    if (quoteItems.length === 0) {
        window.print();
        return;
    }

    const date     = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' });
    const quoteNum = 'QT-' + Date.now().toString().slice(-6);
    const sub      = quoteSubtotal();
    const gst      = sub * 0.1;
    const total    = sub + gst;

    pq.innerHTML =
        '<div class="pq-header">' +
        '<div class="pq-brand">Nova<span>merch</span></div>' +
        '<div class="pq-meta">' +
        '<div class="pq-quote-num">Quote ' + quoteNum + '</div>' +
        '<div class="pq-date">' + date + '</div>' +
        '</div>' +
        '</div>' +
        '<table class="pq-table">' +
        '<thead><tr>' +
        '<th style="width:22%">Item</th>' +
        '<th>Description</th>' +
        '<th style="width:6%">Qty</th>' +
        '<th style="width:11%">Unit Price</th>' +
        '<th style="width:11%">Total</th>' +
        '</tr></thead>' +
        '<tbody>' +
        quoteItems.map(item =>
            '<tr>' +
            '<td><div class="pq-item-label">' + item.label + '</div></td>' +
            '<td class="pq-desc">' +
            [
                item.style   ? 'Style: ' + item.style             : null,
                item.colour  ? 'Colour: ' + item.colour           : null,
                item.size    ? 'Size: ' + item.size               : null,
                item.plFront ? 'Front placement: ' + item.plFront : null,
                item.plBack  ? 'Back placement: ' + item.plBack   : null,
                item.notes   ? 'Notes: ' + item.notes             : null,
            ].filter(Boolean).join('<br>') +
            '</td>' +
            '<td style="text-align:center">' + item.qty + '</td>' +
            '<td style="text-align:right">$' + item.unitPrice.toFixed(2) + '</td>' +
            '<td style="text-align:right">$' + (item.unitPrice * item.qty).toFixed(2) + '</td>' +
            '</tr>'
        ).join('') +
        '</tbody>' +
        '</table>' +
        '<div class="pq-totals">' +
        '<div class="pq-total-row"><span>Subtotal</span><span>$' + sub.toFixed(2) + '</span></div>' +
        '<div class="pq-total-row"><span>GST (10%)</span><span>$' + gst.toFixed(2) + '</span></div>' +
        '<div class="pq-total-row pq-grand"><span>Total (AUD)</span><span>$' + total.toFixed(2) + '</span></div>' +
        '</div>' +
        '<div class="pq-footer">All prices in AUD including customisation. This quote is valid for 30 days from the date above. Prices subject to change based on final artwork and quantity.</div>';

    window.print();
};

buildTabs();
updateSummary();
})();
`;

export default function MockupBuilderPage() {
  useEffect(() => {
    // Inject CSS
    const style = document.createElement("style");
    style.setAttribute("data-mb-styles", "1");
    style.textContent = STYLES_CSS;
    document.head.appendChild(style);

    // Inject script
    const script = document.createElement("script");
    script.setAttribute("data-mb-script", "1");
    script.textContent = BUILDER_SCRIPT;
    document.body.appendChild(script);

    return () => {
      style.remove();
      script.remove();
      // Clean up any window-globals we attached
      const w = window as unknown as Record<string, unknown>;
      [
        "handleLogoFile", "onLogoSize", "removeLogo", "onOffsetChange",
        "switchProduct", "pick", "changeQty", "updateSummary",
        "resetAll", "copySpec", "addToQuote", "removeQuoteItem",
        "clearQuote", "printQuote",
      ].forEach((k) => { try { delete w[k]; } catch { /* noop */ } });
    };
  }, []);

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.add("drag-over");
  };
  const onDragLeave = (e: React.DragEvent) => {
    (e.currentTarget as HTMLElement).classList.remove("drag-over");
  };
  const onDropFront = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove("drag-over");
    const f = e.dataTransfer.files[0];
    (window as unknown as { handleLogoFile: (s: string, f: File) => void }).handleLogoFile("front", f);
  };
  const onDropBack = (e: React.DragEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).classList.remove("drag-over");
    const f = e.dataTransfer.files[0];
    (window as unknown as { handleLogoFile: (s: string, f: File) => void }).handleLogoFile("back", f);
  };

  const callWindow = (name: string, ...args: unknown[]) => {
    const fn = (window as unknown as Record<string, unknown>)[name];
    if (typeof fn === "function") (fn as (...a: unknown[]) => unknown)(...args);
  };

  return (
    <div className="mb-root">
      <header className="mb-header">
        <h1>Nova<span>merch</span> &mdash; Mockup Builder</h1>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link className="mb-back-link" href="/">&larr; Back to site</Link>
          <small>Internal Design Tool</small>
        </div>
      </header>

      <div className="product-bar" id="product-bar"></div>

      <div className="mb-main">
        <div className="opts">
          <div className="opt-sec">
            <div className="opt-lbl">Style</div>
            <div className="style-list" id="style-list"></div>
          </div>

          <div className="divider"></div>

          <div className="opt-sec">
            <div className="opt-lbl">Colour</div>
            <div className="swatches" id="swatches"></div>
          </div>

          <div className="divider"></div>

          <div className="opt-sec">
            <div className="opt-lbl">Front Logo</div>
            <label
              className="logo-drop"
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDropFront}
            >
              <input
                type="file"
                id="logo-file-front"
                accept="image/*"
                onChange={(e) =>
                  callWindow("handleLogoFile", "front", e.target.files?.[0])
                }
              />
              <span className="logo-drop-icon">🖼️</span>
              <span>Click or drag &amp; drop</span>
              <span style={{ fontSize: 10, color: "#3a3a3a" }}>PNG, SVG, JPG</span>
            </label>
            <div className="logo-loaded" id="logo-loaded-front">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="logo-thumb" id="logo-thumb-front" src="" alt="" />
              <div className="logo-size-row">
                <span>Size</span>
                <input
                  type="range"
                  min={3}
                  max={50}
                  defaultValue={20}
                  id="logo-size-front"
                  onInput={(e) =>
                    callWindow("onLogoSize", "front", (e.target as HTMLInputElement).value)
                  }
                />
                <span className="logo-size-val" id="logo-size-val-front">20%</span>
              </div>
              <button className="logo-remove" onClick={() => callWindow("removeLogo", "front")}>
                ✕ Remove
              </button>
            </div>
          </div>

          <div className="divider"></div>

          <div className="opt-sec">
            <div className="opt-lbl">Front Logo Placement</div>
            <div className="place-list" id="place-list-front"></div>
            <div className="logo-offsets">
              <div className="offset-row">
                <span className="offset-icon">↔</span>
                <span className="offset-lbl">H</span>
                <input
                  type="range"
                  min={-30}
                  max={30}
                  defaultValue={0}
                  id="offset-front-x"
                  onInput={(e) =>
                    callWindow("onOffsetChange", "front", "x", (e.target as HTMLInputElement).value)
                  }
                />
                <span className="offset-val" id="offset-front-x-val">0</span>
              </div>
              <div className="offset-row">
                <span className="offset-icon">↕</span>
                <span className="offset-lbl">V</span>
                <input
                  type="range"
                  min={-30}
                  max={30}
                  defaultValue={0}
                  id="offset-front-y"
                  onInput={(e) =>
                    callWindow("onOffsetChange", "front", "y", (e.target as HTMLInputElement).value)
                  }
                />
                <span className="offset-val" id="offset-front-y-val">0</span>
              </div>
            </div>
          </div>

          <div id="back-logo-wrap" style={{ display: "none" }}>
            <div className="divider"></div>
            <div className="opt-sec">
              <div className="opt-lbl">Back Logo</div>
              <label
                className="logo-drop"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDropBack}
              >
                <input
                  type="file"
                  id="logo-file-back"
                  accept="image/*"
                  onChange={(e) =>
                    callWindow("handleLogoFile", "back", e.target.files?.[0])
                  }
                />
                <span className="logo-drop-icon">🖼️</span>
                <span>Click or drag &amp; drop</span>
                <span style={{ fontSize: 10, color: "#3a3a3a" }}>PNG, SVG, JPG</span>
              </label>
              <div className="logo-loaded" id="logo-loaded-back">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="logo-thumb" id="logo-thumb-back" src="" alt="" />
                <div className="logo-size-row">
                  <span>Size</span>
                  <input
                    type="range"
                    min={3}
                    max={50}
                    defaultValue={20}
                    id="logo-size-back"
                    onInput={(e) =>
                      callWindow("onLogoSize", "back", (e.target as HTMLInputElement).value)
                    }
                  />
                  <span className="logo-size-val" id="logo-size-val-back">20%</span>
                </div>
                <button className="logo-remove" onClick={() => callWindow("removeLogo", "back")}>
                  ✕ Remove
                </button>
              </div>
            </div>

            <div className="divider"></div>

            <div className="opt-sec">
              <div className="opt-lbl">Back Logo Placement</div>
              <div className="place-list" id="place-list-back"></div>
              <div className="logo-offsets">
                <div className="offset-row">
                  <span className="offset-icon">↔</span>
                  <span className="offset-lbl">H</span>
                  <input
                    type="range"
                    min={-30}
                    max={30}
                    defaultValue={0}
                    id="offset-back-x"
                    onInput={(e) =>
                      callWindow("onOffsetChange", "back", "x", (e.target as HTMLInputElement).value)
                    }
                  />
                  <span className="offset-val" id="offset-back-x-val">0</span>
                </div>
                <div className="offset-row">
                  <span className="offset-icon">↕</span>
                  <span className="offset-lbl">V</span>
                  <input
                    type="range"
                    min={-30}
                    max={30}
                    defaultValue={0}
                    id="offset-back-y"
                    onInput={(e) =>
                      callWindow("onOffsetChange", "back", "y", (e.target as HTMLInputElement).value)
                    }
                  />
                  <span className="offset-val" id="offset-back-y-val">0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="opt-sec">
            <div className="opt-lbl">Size</div>
            <div className="size-grid" id="size-grid"></div>
          </div>

          <div className="divider"></div>

          <div className="opt-sec">
            <div className="opt-lbl">Quantity</div>
            <div className="qty-row">
              <button className="qty-btn" onClick={() => callWindow("changeQty", -1)}>&#8722;</button>
              <input
                className="qty-val"
                id="qty"
                type="number"
                defaultValue={1}
                min={1}
                max={9999}
                onInput={() => callWindow("updateSummary")}
              />
              <button className="qty-btn" onClick={() => callWindow("changeQty", 1)}>&#43;</button>
            </div>
          </div>

          <div className="divider"></div>

          <div className="opt-sec">
            <div className="opt-lbl">Notes / Special Instructions</div>
            <textarea
              className="notes-ta"
              id="notes"
              placeholder="e.g. Pantone ref, logo filename, placement dimensions, thread colour..."
              onInput={() => callWindow("updateSummary")}
            />
          </div>
        </div>

        <div className="preview">
          <div className="stage">
            <div id="mockup-ph" className="mockup-ph">
              <div className="ph-icon" id="ph-icon">👕</div>
              <div className="ph-msg" id="ph-msg">Select a product above to load its mockup.</div>
            </div>

            <div className="mockup-wrap" id="mockup-wrap" style={{ display: "none" }}>
              <canvas id="mockup-canvas" className="mockup-img"></canvas>
              <div id="colour-overlay" className="colour-overlay"></div>
            </div>

            <div id="dual-wrap" className="dual-wrap" style={{ display: "none" }}>
              <div className="view-item">
                <canvas id="canvas-front" className="canvas-dual"></canvas>
                <div className="view-label">Front</div>
              </div>
              <div className="view-item">
                <canvas id="canvas-back" className="canvas-dual"></canvas>
                <div className="view-label">Back</div>
              </div>
            </div>

            <div className="colour-note" id="colour-note">
              <span className="colour-dot" id="colour-dot"></span>
              <span id="colour-note-text">Selected colour</span>
            </div>
          </div>

          <div className="sum-bar">
            <div className="si"><div className="sk">Product</div><div className="sv dim" id="s-product">&mdash;</div></div>
            <div className="si"><div className="sk">Style</div><div className="sv dim" id="s-style">&mdash;</div></div>
            <div className="si"><div className="sk">Colour</div><div className="sv dim" id="s-colour">&mdash;</div></div>
            <div className="si"><div className="sk">Placement</div><div className="sv dim" id="s-placement">&mdash;</div></div>
            <div className="si"><div className="sk">Size</div><div className="sv dim" id="s-size">&mdash;</div></div>
            <div className="si"><div className="sk">Qty</div><div className="sv" id="s-qty">1</div></div>
            <div className="si"><div className="sk">Unit Price</div><div className="sv dim" id="s-unit-price">&mdash;</div></div>
            <div className="si"><div className="sk">Line Total</div><div className="sv dim" id="s-line-total">&mdash;</div></div>
            <div className="sum-actions">
              <button className="btn btn-ghost" onClick={() => callWindow("resetAll")}>Reset</button>
              <button className="btn btn-ghost" id="copy-btn" onClick={() => callWindow("copySpec")}>Copy Spec</button>
              <button className="btn btn-ghost" onClick={() => callWindow("addToQuote")} id="add-quote-btn">+ Add to Quote</button>
              <button className="btn btn-primary" onClick={() => callWindow("printQuote")} id="print-btn">Print / Save PDF</button>
            </div>
          </div>

          <div className="quote-panel" id="quote-panel" style={{ display: "none" }}>
            <div className="qp-header">
              <span>Quote</span>
              <span id="qp-count">0 items</span>
              <span className="qp-total-badge" id="qp-grand-total"></span>
              <button className="qp-clear" onClick={() => callWindow("clearQuote")}>Clear all</button>
            </div>
            <div className="qp-list" id="qp-list"></div>
          </div>
        </div>
      </div>

      <div id="print-quote"></div>
    </div>
  );
}
