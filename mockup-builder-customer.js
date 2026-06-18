
// ── Logo state ────────────────────────────────────────────────────────────────

let loadedLogoFront = null, loadedLogoBack = null;
let logoSizeFront   = 20,   logoSizeBack   = 20;
let logoFrontProduct = null, logoBackProduct = null;
let logoOffsetFrontX = 0, logoOffsetFrontY = 0;
let logoOffsetBackX  = 0, logoOffsetBackY  = 0;

function handleLogoFile(side, file) {
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
                if (S.product === 'socks') {
                    if (!S.placement) { S.placement = 'ankle-cuff'; renderOpts(); }
                } else if (S.product === 'beanie') {
                    S.placement = 'front-center';
                    renderOpts();
                } else if (S.product === 'bottle') {
                    if (S.style === 'Insulated Bottle - Straw Lid') S.placement = 'middle-straw';
                    else if (S.style === 'Travel Cup') S.placement = 'middle-travel';
                    else S.placement = 'middle';
                    renderOpts();
                } else if (S.product === 'cap') {
                    S.placement = 'front';
                    renderOpts();
                } else if (S.product === 'shorts') {
                    S.placement = 'front-left-thigh';
                    renderOpts();
                } else {
                    S.placement = 'front-chest';
                    renderOpts();
                }
                drawCanvas();
            } else {
                loadedLogoBack = img;
                logoBackProduct = S.product;
                document.getElementById('logo-thumb-back').src = e.target.result;
                document.getElementById('logo-loaded-back').classList.add('show');
                S.placementBack = 'back-center';
                renderOpts();
                drawCanvasBack();
            }
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function onLogoSize(side, val) {
    if (side === 'front') {
        logoSizeFront = parseInt(val);
        document.getElementById('logo-size-val-front').textContent = val + '%';
        drawCanvas();
    } else {
        logoSizeBack = parseInt(val);
        document.getElementById('logo-size-val-back').textContent = val + '%';
        drawCanvasBack();
    }
}

function removeLogo(side) {
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
}

// Draws logo onto ctx at the placement position plus any manual offset
function drawLogo(ctx, cw, ch, logo, sizePct, placementId, offsetX = 0, offsetY = 0) {
    if (!logo) return;

    // Socks: draw logo on both socks for all placements
    const sockDualPositions = {
        'ankle-cuff':  [{ x: 0.36, y: 0.28, r: 0 },                  { x: 0.62, y: 0.28, r: 0 }],
        'top-of-foot': [{ x: 0.17, y: 0.60, r: 30 * Math.PI / 180 }, { x: 0.83, y: 0.60, r: -30 * Math.PI / 180 }],
    };
    // Both Sleeves: draw logo on left and right sleeve simultaneously
    if (placementId === 'both-sleeves') {
        const positions = [{ x: 0.18, y: 0.30 }, { x: 0.82, y: 0.30 }];
        const lw = (sizePct / 100) * cw;
        const lh = lw * (logo.naturalHeight / logo.naturalWidth);
        for (const pos of positions) {
            const cx = pos.x * cw + (offsetX / 100) * cw;
            const cy = pos.y * ch + (offsetY / 100) * ch;
            ctx.drawImage(logo, cx - lw / 2, cy - lh / 2, lw, lh);
        }
        return;
    }

    if (S.product === 'socks' && sockDualPositions[placementId]) {
        const positions = sockDualPositions[placementId];
        const lw = (sizePct / 100) * cw;
        const lh = lw * (logo.naturalHeight / logo.naturalWidth);
        for (const pos of positions) {
            const cx = pos.x * cw + (offsetX / 100) * cw;
            const cy = pos.y * ch + (offsetY / 100) * ch;
            ctx.save();
            ctx.translate(cx, cy);
            if (pos.r) ctx.rotate(pos.r);
            ctx.drawImage(logo, -lw / 2, -lh / 2, lw, lh);
            ctx.restore();
        }
        return;
    }

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

function onOffsetChange(side, axis, val) {
    const v = parseInt(val);
    if (side === 'front') {
        if (axis === 'x') logoOffsetFrontX = v; else logoOffsetFrontY = v;
        document.getElementById(`offset-front-${axis}-val`).textContent = v;
        drawCanvas();
    } else {
        if (axis === 'x') logoOffsetBackX = v; else logoOffsetBackY = v;
        document.getElementById(`offset-back-${axis}-val`).textContent = v;
        drawCanvasBack();
    }
}

function pickDecoration(val) {
    S.decoration = val;
    renderOpts();
    updateSummary();
}

function onSockTextInput() {
    S.sockText = document.getElementById('sock-text-input').value;
    drawCanvas();
    updateSummary();
}

function pickSockTextPlacement(id) {
    const i = S.sockTextPlacements.indexOf(id);
    if (i === -1) S.sockTextPlacements.push(id);
    else S.sockTextPlacements.splice(i, 1);
    renderOpts();
    drawCanvas();
    updateSummary();
}

function pickSockTextColour(hex) {
    S.sockTextColour = hex;
    const picker = document.getElementById('sock-text-colour-picker');
    const hexField = document.getElementById('sock-text-colour-hex');
    if (picker) picker.value = hex;
    if (hexField) hexField.value = hex;
    renderOpts();
    drawCanvas();
}

function onSockTextHexInput(val) {
    if (/^#[0-9a-fA-F]{6}$/.test(val)) pickSockTextColour(val);
}

function drawSockText(ctx, cw, ch) {
    if (!S.sockText || !S.sockTextPlacements.length) return;

    const positions = {
        'top-of-foot': [{ x: 0.17, y: 0.60, rotate: 30 * Math.PI / 180 }, { x: 0.83, y: 0.60, rotate: -30 * Math.PI / 180 }],
        'under-foot':  [{ x: 0.319, y: 0.637, rotate: -55 * Math.PI / 180 }, { x: 0.664, y: 0.637, rotate: 53 * Math.PI / 180 }],
    };

    const fontSize = Math.max(10, Math.round(cw * 0.028));
    ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
    ctx.fillStyle = S.sockTextColour || '#111111';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (const placementId of S.sockTextPlacements) {
        const pts = positions[placementId];
        if (!pts) continue;
        for (const pos of pts) {
            ctx.save();
            ctx.translate(pos.x * cw, pos.y * ch);
            if (pos.rotate) ctx.rotate(pos.rotate);
            ctx.fillText(S.sockText, 0, 0);
            ctx.restore();
        }
    }
}

// ── Canvas tinting ────────────────────────────────────────────────────────────

let loadedImg     = null;
let loadedBackImg = null;


// Returns true if the current product shows front + back side by side
function isDualView() {
    return !!(S.product && PRODUCTS[S.product].backImage);
}

// Returns the view of a given placement ID for the current product
function placementView(id) {
    if (!id || !S.product) return undefined;
    const pl = PRODUCTS[S.product].placements.find(x => x.id === id);
    return pl ? pl.view : undefined;
}

function applyCanvasAspect(canvas, ctx, img, aspect, sidePad) {
    const MAX = 1200;
    let iw = img.naturalWidth, ih = img.naturalHeight;
    if (iw > MAX) { ih = Math.round(ih * MAX / iw); iw = MAX; }
    if (ih > MAX) { iw = Math.round(iw * MAX / ih); ih = MAX; }
    const ch = aspect ? Math.round(iw * aspect) : ih;
    canvas.width = iw; canvas.height = ch;
    ctx.clearRect(0, 0, iw, ch);
    if (aspect && sidePad) {
        // Shrink image to leave white space on sides, centre vertically
        const dw = Math.round(iw * (1 - 2 * sidePad));
        const dh = Math.round(dw * (ih / iw));
        const dx = Math.round(iw * sidePad);
        const dy = Math.round((ch - dh) / 2);
        ctx.drawImage(img, dx, dy, dw, dh);
    } else if (aspect) {
        // Scale image to fill canvas height, centre horizontally (trims white side margins)
        const scale = ch / ih;
        const dw = Math.round(iw * scale);
        const dx = Math.round((iw - dw) / 2);
        ctx.drawImage(img, dx, 0, dw, ch);
    } else {
        ctx.drawImage(img, 0, 0, iw, ih);
    }
    return { w: iw, h: ch };
}

function drawCanvas() {
    const dual   = isDualView();
    const canvas = document.getElementById(dual ? 'canvas-front' : 'mockup-canvas');
    const ctx    = canvas.getContext('2d');
    if (!loadedImg) return;

    const aspect  = S.product && PRODUCTS[S.product].dualCanvasAspect;
    const sidePad = S.product && PRODUCTS[S.product].canvasSidePad;
    const { w, h } = applyCanvasAspect(canvas, ctx, loadedImg, aspect, sidePad);

    const frontLogo = (logoFrontProduct === S.product) ? loadedLogoFront : null;
    const drawFrontLogo = () => drawLogo(ctx, w, h, frontLogo, logoSizeFront, S.placement, logoOffsetFrontX, logoOffsetFrontY);

    drawFrontLogo();
    if (S.product === 'socks') drawSockText(ctx, w, h);
    if (dual) drawCanvasBack();
}

function drawCanvasBack() {
    if (!loadedBackImg) return;
    const canvas = document.getElementById('canvas-back');
    const ctx    = canvas.getContext('2d');

    const aspect  = S.product && PRODUCTS[S.product].dualCanvasAspect;
    const sidePad = S.product && PRODUCTS[S.product].canvasSidePad;
    const { w, h } = applyCanvasAspect(canvas, ctx, loadedBackImg, aspect, sidePad);

    const backLogo = (logoBackProduct === S.product) ? loadedLogoBack : null;
    drawLogo(ctx, w, h, backLogo, logoSizeBack, S.placementBack, logoOffsetBackX, logoOffsetBackY);
}


// ── Product config ────────────────────────────────────────────────────────────

const APPAREL_PLACEMENTS = [
    { id: 'front-center',  label: 'Front Centre',      view: 'front', dot: { top: '40%', left: '50%' } },
    { id: 'front-chest',       label: 'Front Left Chest',  view: 'front', dot: { top: '27%', left: '39%' } },
    { id: 'front-chest-right', label: 'Front Right Chest', view: 'front', dot: { top: '27%', left: '61%' } },
    { id: 'left-sleeve',   label: 'Left Sleeve',       view: 'front', dot: { top: '30%', left: '18%' } },
    { id: 'right-sleeve',  label: 'Right Sleeve',      view: 'front', dot: { top: '30%', left: '82%' } },
    { id: 'both-sleeves',  label: 'Both Sleeves',      view: 'front', dot: { top: '30%', left: '50%' } },
    { id: 'back-center',   label: 'Back Centre',       view: 'back',  dot: { top: '40%', left: '50%' } },
    { id: 'back-upper',    label: 'Back Upper',        view: 'back',  dot: { top: '20%', left: '50%' } },
];

const PRODUCTS = {
    tshirt: {
        label: 'T-Shirt',      icon: '👕', price: 12.00,
        dualItemMaxWidth: '546px',
        dualCanvasAspect: 1402 / 1122,
        image: '/mockup-builder/t-shirts/t-shirt - front - black.png',
        colourImages: {
            'army-green':  '/mockup-builder/t-shirts/t-shirt - front - army green.png',
            'black':       '/mockup-builder/t-shirts/t-shirt - front - black.png',
            'blue':        '/mockup-builder/t-shirts/t-shirt - front - blue.png',
            'burgundy':    '/mockup-builder/t-shirts/t-shirt - front - burgundy.png',
            'dark-gray':   '/mockup-builder/t-shirts/t-shirt - front - dark gray.png',
            'emerald':     '/mockup-builder/t-shirts/t-shirt - front - emerald.png',
            'gold':        '/mockup-builder/t-shirts/t-shirt - front - gold.png',
            'gray':        '/mockup-builder/t-shirts/t-shirt - front - gray.png',
            'green':       '/mockup-builder/t-shirts/t-shirt - front - green.png',
            'light-blue':  '/mockup-builder/t-shirts/t-shirt - front - light blue.png',
            'light-green': '/mockup-builder/t-shirts/t-shirt - front - light green.png',
            'light-pink':  '/mockup-builder/t-shirts/t-shirt - front - light pink.png',
            'navy':        '/mockup-builder/t-shirts/t-shirt - front - navy blue.png',
            'orange':      '/mockup-builder/t-shirts/t-shirt - front - orange.png',
            'pink':        '/mockup-builder/t-shirts/t-shirt - front - pink.png',
            'purple':      '/mockup-builder/t-shirts/t-shirt - front - purple.png',
            'red':         '/mockup-builder/t-shirts/t-shirt - front - red.png',
            'sand':        '/mockup-builder/t-shirts/t-shirt - front - sand.png',
            'white':       '/mockup-builder/t-shirts/t-shirt - front - white.png',
            'yellow':      '/mockup-builder/t-shirts/t-shirt - front - yellow.png',
        },
        backImage: '/mockup-builder/t-shirts/t-shirt - back - black.png',
        backColourImages: {
            'army-green':  '/mockup-builder/t-shirts/t-shirt - back - army green.png',
            'black':       '/mockup-builder/t-shirts/t-shirt - back - black.png',
            'blue':        '/mockup-builder/t-shirts/t-shirt - back - blue.png',
            'burgundy':    '/mockup-builder/t-shirts/t-shirt - back - burgundy.png',
            'dark-gray':   '/mockup-builder/t-shirts/t-shirt - back - dark gray.png',
            'emerald':     '/mockup-builder/t-shirts/t-shirt - back - emerald.png',
            'gold':        '/mockup-builder/t-shirts/t-shirt - back - gold.png',
            'gray':        '/mockup-builder/t-shirts/t-shirt - back - gray.png',
            'green':       '/mockup-builder/t-shirts/t-shirt - back - green.png',
            'light-blue':  '/mockup-builder/t-shirts/t-shirt - back - light blue.png',
            'light-green': '/mockup-builder/t-shirts/t-shirt - back - light green.png',
            'light-pink':  '/mockup-builder/t-shirts/t-shirt - back - light pink.png',
            'navy':        '/mockup-builder/t-shirts/t-shirt - back - navy blue.png',
            'orange':      '/mockup-builder/t-shirts/t-shirt - back - orange.png',
            'pink':        '/mockup-builder/t-shirts/t-shirt - back - pink.png',
            'purple':      '/mockup-builder/t-shirts/t-shirt - back - purple.png',
            'red':         '/mockup-builder/t-shirts/t-shirt - back - red.png',
            'sand':        '/mockup-builder/t-shirts/t-shirt - back - sand.png',
            'white':       '/mockup-builder/t-shirts/t-shirt - back - white.png',
            'yellow':      '/mockup-builder/t-shirts/t-shirt - back - yellow.png',
        },
        availableColours: ['army-green','black','blue','burgundy','dark-gray','emerald','gold','gray','green','light-blue','light-green','light-pink','navy','orange','pink','purple','red','sand','white','yellow'],
        styles: ['Classic Tee'],
        sizes: ['XS','S','M','L','XL','2XL','3XL'],
        placements: APPAREL_PLACEMENTS,
    },
    singlet: {
        label: 'Singlet',      icon: '🎽', price: 20.00,
        dualItemMaxWidth: '546px',
        image: '/mockup-builder/singlets/singlet black - front.png',
        colourImages: {
            'beige': '/mockup-builder/singlets/singlet beige - front.png',
            'black': '/mockup-builder/singlets/singlet black - front.png',
            'blue':  '/mockup-builder/singlets/singlet blue - front.png',
            'brown': '/mockup-builder/singlets/singlet brown - front.png',
            'khaki': '/mockup-builder/singlets/singlet khaki - front.png',
            'navy':  '/mockup-builder/singlets/singlet navy blue - front.png',
            'red':   '/mockup-builder/singlets/singlet red - front.png',
        },
        backImage: '/mockup-builder/singlets/singlet black - back.png',
        backColourImages: {
            'beige': '/mockup-builder/singlets/singlet beige - back.png',
            'black': '/mockup-builder/singlets/singlet black - back.png',
            'blue':  '/mockup-builder/singlets/singlet blue - back.png',
            'brown': '/mockup-builder/singlets/singlet brown - back.png',
            'khaki': '/mockup-builder/singlets/singlet khaki - back.png',
            'navy':  '/mockup-builder/singlets/singlet navy blue - back.png',
            'red':   '/mockup-builder/singlets/singlet red - back.png',
        },
        availableColours: ['beige', 'black', 'blue', 'brown', 'khaki', 'navy', 'red'],
        styles: ['Standard'],
        sizes: ['XS','S','M','L','XL','2XL'],
        placements: [
            { id: 'front-center', label: 'Front Centre',     view: 'front', dot: { top: '38%', left: '50%' } },
            { id: 'front-chest',  label: 'Front Left Chest', view: 'front', dot: { top: '25%', left: '36%' } },
            { id: 'back-center',  label: 'Back Centre',      view: 'back',  dot: { top: '38%', left: '50%' } },
        ],
    },
    jumper: {
        label: 'Jumper',       icon: '🧥', price: 25.00,
        dualItemMaxWidth: '546px',
        dualCanvasAspect: 1402 / 1122,
        image: '/mockup-builder/jumpers/jumper black - front.png',
        colourImages: {
            'black':    '/mockup-builder/jumpers/jumper black - front.png',
            'blue':     '/mockup-builder/jumpers/jumper blue - front.png',
            'dark-gray':'/mockup-builder/jumpers/jumper dark gray - front.png',
            'gray':     '/mockup-builder/jumpers/jumper gray - front.png',
            'green':    '/mockup-builder/jumpers/jumper green - front.png',
            'khaki':    '/mockup-builder/jumpers/jumper khaki - front.png',
            'navy':     '/mockup-builder/jumpers/jumper navy - front.png',
            'pink':     '/mockup-builder/jumpers/jumper pink - front.png',
            'red':      '/mockup-builder/jumpers/jumper red - front.png',
            'white':    '/mockup-builder/jumpers/jumper white - front.png',
        },
        backImage: '/mockup-builder/jumpers/jumper black - back.png',
        backColourImages: {
            'black':    '/mockup-builder/jumpers/jumper black - back.png',
            'blue':     '/mockup-builder/jumpers/jumper blue - back.png',
            'dark-gray':'/mockup-builder/jumpers/jumper dark gray - back.png',
            'gray':     '/mockup-builder/jumpers/jumper gray - back.png',
            'green':    '/mockup-builder/jumpers/jumper green - back.png',
            'khaki':    '/mockup-builder/jumpers/jumper khaki - back.png',
            'navy':     '/mockup-builder/jumpers/jumper navy - back.png',
            'pink':     '/mockup-builder/jumpers/jumper pink - back.png',
            'red':      '/mockup-builder/jumpers/jumper red - back.png',
            'white':    '/mockup-builder/jumpers/jumper white - back.png',
        },
        availableColours: ['black','blue','dark-gray','gray','green','khaki','navy','pink','red','white'],
        styles: ['Pullover Hoodie'],
        sizes: ['XS','S','M','L','XL','2XL','3XL'],
        placements: [
            { id: 'front-center',      label: 'Front Centre',      view: 'front', dot: { top: '40%', left: '50%' } },
            { id: 'front-chest',       label: 'Front Left Chest',  view: 'front', dot: { top: '34%', left: '39%' } },
            { id: 'front-chest-right', label: 'Front Right Chest', view: 'front', dot: { top: '34%', left: '61%' } },
            { id: 'back-center',       label: 'Back Centre',       view: 'back',  dot: { top: '40%', left: '50%' } },
        ],
    },
    jacket: {
        label: 'Rain Jacket',  icon: '🌧️', price: 25.00,
        dualItemMaxWidth: '546px',
        image: '/mockup-builder/rain-jackets/rain jacket - black.png',
        colourImages: {
            'black': '/mockup-builder/rain-jackets/rain jacket - black.png',
            'blue':  '/mockup-builder/rain-jackets/rain jacket - blue.png',
            'forest':'/mockup-builder/rain-jackets/rain jacket - green.png',
            'khaki': '/mockup-builder/rain-jackets/rain jacket - khaki.png',
            'navy':  '/mockup-builder/rain-jackets/rain jacket - navy.png',
            'red':   '/mockup-builder/rain-jackets/rain jacket - red.png',
        },
        backImage: '/mockup-builder/rain-jackets/rain jacket - black back.png',
        backColourImages: {
            'black': '/mockup-builder/rain-jackets/rain jacket - black back.png',
            'blue':  '/mockup-builder/rain-jackets/rain jacket - blue back.png',
            'forest':'/mockup-builder/rain-jackets/rain jacket - green back.png',
            'khaki': '/mockup-builder/rain-jackets/rain jacket - khaki back.png',
            'navy':  '/mockup-builder/rain-jackets/rain jacket - navy back.png',
            'red':   '/mockup-builder/rain-jackets/rain jacket - red back.png',
        },
        availableColours: ['black', 'blue', 'forest', 'khaki', 'navy', 'red'],
        styles: ['Standard'],
        sizes: ['XS','S','M','L','XL','2XL','3XL'],
        placements: [
            { id: 'front-chest',       label: 'Front Left Chest',  view: 'front', dot: { top: '28%', left: '38%' } },
            { id: 'front-chest-right', label: 'Front Right Chest', view: 'front', dot: { top: '28%', left: '62%' } },
            { id: 'back-center',       label: 'Back Centre',       view: 'back',  dot: { top: '42%', left: '50%' } },
        ],
    },
    cap: {
        label: 'Cap',          icon: '🧢', price: 15.00,
        maxWidth: '546px',
        dualCanvasAspect: 1402 / 1122,
        canvasSidePad: 0.04,
        image: '/mockup-builder/cap/cap black.png',
        colourImages: {
            'black':     '/mockup-builder/cap/cap black.png',
            'beige':     '/mockup-builder/cap/cap beige.png',
            'blue':      '/mockup-builder/cap/cap blue.png',
            'brown':     '/mockup-builder/cap/cap brown.png',
            'forest':    '/mockup-builder/cap/cap green.png',
            'khaki':     '/mockup-builder/cap/cap khaki.png',
            'sky-blue':  '/mockup-builder/cap/cap light blue.png',
            'navy':      '/mockup-builder/cap/cap navy blue.png',
            'orange':    '/mockup-builder/cap/cap orange.png',
            'pink':      '/mockup-builder/cap/cap pink.png',
            'purple':    '/mockup-builder/cap/cap purple.png',
            'red':       '/mockup-builder/cap/cap red.png',
            'white':     '/mockup-builder/cap/cap white.png',
            'burgundy':  '/mockup-builder/cap/cap wine red.png',
            'yellow':    '/mockup-builder/cap/cap yellow.png',
        },
        availableColours: ['black', 'beige', 'blue', 'brown', 'forest', 'khaki', 'sky-blue', 'navy', 'orange', 'pink', 'purple', 'red', 'white', 'burgundy', 'yellow'],
        styles: ['Cap'],
        sizes: ['One Size - Adjustable'],
        placements: [
            { id: 'front',      label: 'Front Panel',    dot: { top: '47%', left: '50%' } },
        ],
    },
    beanie: {
        label: 'Beanie',       icon: '🎩', price: 12.00,
        maxWidth: '546px',
        dualCanvasAspect: 1402 / 1122,
        canvasSidePad: 0.04,
        image: '/mockup-builder/beanie/beanie black.png',
        colourImages: {
            'black':       '/mockup-builder/beanie/beanie black.png',
            'white':       '/mockup-builder/beanie/beanie white.png',
            'navy':        '/mockup-builder/beanie/beanie navy blue.png',
            'grey':        '/mockup-builder/beanie/beanie grey.png',
            'dark-grey':   '/mockup-builder/beanie/beanie dark grey.png',
            'forest':      '/mockup-builder/beanie/beanie dark green.png',
            'burgundy':    '/mockup-builder/beanie/beanie wine red.png',
            'royal-blue':  '/mockup-builder/beanie/beanie royal blue.png',
            'red':         '/mockup-builder/beanie/beanie red.png',
            'mustard':     '/mockup-builder/beanie/beanie dark yellow.png',
            'pink':        '/mockup-builder/beanie/beanie pink.png',
            'deep-pink':   '/mockup-builder/beanie/beanie deep pink.png',
            'rose':        '/mockup-builder/beanie/beanie rose.png',
            'orange':      '/mockup-builder/beanie/beanie orange.png',
            'dark-orange': '/mockup-builder/beanie/beanie dark orange.png',
            'sky-blue':    '/mockup-builder/beanie/beanie sky blue.png',
            'grey-blue':   '/mockup-builder/beanie/beanie grey blue.png',
            'purple':      '/mockup-builder/beanie/beanie dark purple.png',
            'light-purple':'/mockup-builder/beanie/beanie light purple.png',
            'khaki':       '/mockup-builder/beanie/beanie khaki.png',
            'army-green':  '/mockup-builder/beanie/beanie army green.png',
            'yellow':      '/mockup-builder/beanie/beanie bright yellow.png',
            'brown':       '/mockup-builder/beanie/beanie dark coffee.png',
        },
        availableColours: ['black','white','navy','grey','dark-grey','forest','burgundy','royal-blue','red','mustard','pink','deep-pink','rose','orange','dark-orange','sky-blue','grey-blue','purple','light-purple','khaki','army-green','yellow','brown'],
        styles: ['Classic Fold'],
        sizes: ['One Size'],
        placements: [
            { id: 'front-center', label: 'Front Centre',  dot: { top: '70%', left: '50%' } },
        ],
    },
    shorts: {
        label: 'Shorts',       icon: '🩳', price: 15.00,
        dualItemMaxWidth: '546px',
        dualCanvasAspect: 1402 / 1122,
        canvasSidePad: 0.01,
        image: '/mockup-builder/shorts/shorts black - front.png',
        colourImages: {
            'aqua':       '/mockup-builder/shorts/shorts aqua - front.png',
            'army-green': '/mockup-builder/shorts/shorts army green - front.png',
            'black':      '/mockup-builder/shorts/shorts black - front.png',
            'blue':       '/mockup-builder/shorts/shorts blue - front.png',
            'sky-blue':   '/mockup-builder/shorts/shorts light blue - front.png',
            'grey':       '/mockup-builder/shorts/shorts light gray - front.png',
            'lime-green': '/mockup-builder/shorts/shorts lime green - front.png',
            'navy':       '/mockup-builder/shorts/shorts navy blue - front.png',
            'orange':     '/mockup-builder/shorts/shorts orange - front.png',
            'pink':       '/mockup-builder/shorts/shorts pink - front.png',
            'purple':     '/mockup-builder/shorts/shorts purple - front.png',
            'red':        '/mockup-builder/shorts/shorts red - front.png',
            'royal-blue': '/mockup-builder/shorts/shorts royal blue - front.png',
            'white':      '/mockup-builder/shorts/shorts white - front.png',
            'yellow':     '/mockup-builder/shorts/shorts yellow - front.png',
        },
        backImage: '/mockup-builder/shorts/shorts black - back.png',
        backColourImages: {
            'aqua':       '/mockup-builder/shorts/shorts aqua - back.png',
            'army-green': '/mockup-builder/shorts/shorts army green - back.png',
            'black':      '/mockup-builder/shorts/shorts black - back.png',
            'blue':       '/mockup-builder/shorts/shorts blue - back.png',
            'sky-blue':   '/mockup-builder/shorts/shorts light blue - back.png',
            'grey':       '/mockup-builder/shorts/shorts light gray - back.png',
            'lime-green': '/mockup-builder/shorts/shorts lime green - back.png',
            'navy':       '/mockup-builder/shorts/shorts navy blue - back.png',
            'orange':     '/mockup-builder/shorts/shorts orange - back.png',
            'pink':       '/mockup-builder/shorts/shorts pink - back.png',
            'purple':     '/mockup-builder/shorts/shorts purple - back.png',
            'red':        '/mockup-builder/shorts/shorts red - back.png',
            'royal-blue': '/mockup-builder/shorts/shorts royal blue - back.png',
            'white':      '/mockup-builder/shorts/shorts white - back.png',
            'yellow':     '/mockup-builder/shorts/shorts yellow - back.png',
        },
        availableColours: ['aqua','army-green','black','blue','sky-blue','grey','lime-green','navy','orange','pink','purple','red','royal-blue','white','yellow'],
        styles: ['Standard'],
        sizes: ['XS','S','M','L','XL','2XL','3XL'],
        placements: [
            { id: 'front-left-thigh', label: 'Left Thigh',        view: 'front', dot: { top: '59%', left: '28%' } },
            { id: 'front-right-thigh',label: 'Right Thigh',       view: 'front', dot: { top: '59%', left: '72%' } },
        ],
    },
    socks: {
        label: 'Socks',        icon: '🧦', price: 8.00,
        maxWidth: '640px',
        image: '/mockup-builder/socks/socks white.png',
        colourImages: {
            'beige':    '/mockup-builder/socks/socks beige.png',
            'black':    '/mockup-builder/socks/socks black.png',
            'blue':     '/mockup-builder/socks/socks blue.png',
            'brown':    '/mockup-builder/socks/socks brown.png',
            'burgundy': '/mockup-builder/socks/socks burgundy.png',
            'forest':   '/mockup-builder/socks/socks green.png',
            'grey':     '/mockup-builder/socks/socks grey.png',
            'khaki':    '/mockup-builder/socks/socks khaki.png',
            'red':      '/mockup-builder/socks/socks red.png',
            'white':    '/mockup-builder/socks/socks white.png',
        },
        availableColours: ['beige', 'black', 'blue', 'brown', 'burgundy', 'forest', 'grey', 'khaki', 'red', 'white'],
        styles: ['Crew'],
        sizes: ['US 6 - 8.5', 'US 9 - 10', 'US 11 - 13'],
        placements: [
            { id: 'ankle-cuff',  label: 'Ankle / Cuff', dot: { top: '28%', left: '22%' } },
            { id: 'top-of-foot', label: 'Top of Foot',  dot: { top: '55%', left: '28%' } },
        ],
    },
    bottle: {
        label: 'Drinkware', icon: '🍶', price: 20.00,
        stylePrices: {
            'Insulated Bottle - Straw Lid': 20.00,
            'Insulated Bottle':             20.00,
            'Travel Cup':                   22.00,
        },
        styleMaxWidth: {
            'Insulated Bottle': '559px',
            'Travel Cup': '559px',
        },
        image: '/mockup-builder/drinkware/insulated drink bottle.png',
        styleImages: {
            'Insulated Bottle - Straw Lid': '/mockup-builder/drinkware/insulated drink bottle straw lid - black.png',
            'Insulated Bottle':             '/mockup-builder/drinkware/insulated drink bottle - black.png',
            'Travel Cup':                   '/mockup-builder/drinkware/travel cup - black.png',
        },
        styleColourImages: {
            'Travel Cup': {
                'army-green':  '/mockup-builder/drinkware/travel cup - army green.png',
                'baby-blue':   '/mockup-builder/drinkware/travel cup - baby blue.png',
                'bean-green':  '/mockup-builder/drinkware/travel cup - bean green.png',
                'black':       '/mockup-builder/drinkware/travel cup - black.png',
                'bluish-white':'/mockup-builder/drinkware/travel cup - bluish white.png',
                'bright-blue': '/mockup-builder/drinkware/travel cup - bright blue.png',
                'cream':       '/mockup-builder/drinkware/travel cup - cream.png',
                'crimson':     '/mockup-builder/drinkware/travel cup - crimson.png',
                'dark-purple': '/mockup-builder/drinkware/travel cup - dark purple.png',
                'grey':        '/mockup-builder/drinkware/travel cup - gray.png',
                'hot-pink':    '/mockup-builder/drinkware/travel cup - hot pink.png',
                'lavender':    '/mockup-builder/drinkware/travel cup - lavender.png',
                'light-pink':  '/mockup-builder/drinkware/travel cup - light pink.png',
                'lime-green':  '/mockup-builder/drinkware/travel cup - lime green.png',
                'moss-green':  '/mockup-builder/drinkware/travel cup - moss green.png',
                'navy':        '/mockup-builder/drinkware/travel cup - navy blue.png',
                'orange':      '/mockup-builder/drinkware/travel cup - orange.png',
                'peacock-blue':'/mockup-builder/drinkware/travel cup - peacock blue.png',
                'purple':      '/mockup-builder/drinkware/travel cup - purple.png',
                'smoky-pink':  '/mockup-builder/drinkware/travel cup - smoky pink.png',
                'teal':        '/mockup-builder/drinkware/travel cup - teal.png',
                'white':       '/mockup-builder/drinkware/travel cup - white.png',
                'yellow':      '/mockup-builder/drinkware/travel cup - yellow.png',
            },
            'Insulated Bottle': {
                'army-green':    '/mockup-builder/drinkware/insulated drink bottle - army green.png',
                'black':         '/mockup-builder/drinkware/insulated drink bottle - black.png',
                'blue':          '/mockup-builder/drinkware/insulated drink bottle - blue.png',
                'brilliant-blue':'/mockup-builder/drinkware/insulated drink bottle - brilliant blue.png',
                'coral':         '/mockup-builder/drinkware/insulated drink bottle - coral.png',
                'hot-pink':      '/mockup-builder/drinkware/insulated drink bottle - hot pink.png',
                'navy':          '/mockup-builder/drinkware/insulated drink bottle - navy.png',
                'purple':        '/mockup-builder/drinkware/insulated drink bottle - purple.png',
                'red':           '/mockup-builder/drinkware/insulated drink bottle - red.png',
                'royal-blue':    '/mockup-builder/drinkware/insulated drink bottle - royal blue.png',
                'white':         '/mockup-builder/drinkware/insulated drink bottle - white.png',
                'yellow':        '/mockup-builder/drinkware/insulated drink bottle - yellow.png',
            },
            'Insulated Bottle - Straw Lid': {
                'black':        '/mockup-builder/drinkware/insulated drink bottle straw lid - black.png',
                'blue-yellow':  '/mockup-builder/drinkware/insulated drink bottle straw lid - blue yellow.png',
                'blue':         '/mockup-builder/drinkware/insulated drink bottle straw lid - blue.png',
                'forest':       '/mockup-builder/drinkware/insulated drink bottle straw lid - forest green.png',
                'green':        '/mockup-builder/drinkware/insulated drink bottle straw lid - green.png',
                'light-purple': '/mockup-builder/drinkware/insulated drink bottle straw lid - light purple.png',
                'mint':         '/mockup-builder/drinkware/insulated drink bottle straw lid - mint.png',
                'navy':         '/mockup-builder/drinkware/insulated drink bottle straw lid - navy blue.png',
                'orange':       '/mockup-builder/drinkware/insulated drink bottle straw lid - orange.png',
                'pink-mint':    '/mockup-builder/drinkware/insulated drink bottle straw lid - pink mint.png',
                'pink':         '/mockup-builder/drinkware/insulated drink bottle straw lid - pink.png',
                'purple-red':   '/mockup-builder/drinkware/insulated drink bottle straw lid - purple red.png',
                'purple':       '/mockup-builder/drinkware/insulated drink bottle straw lid - purple.png',
                'white':        '/mockup-builder/drinkware/insulated drink bottle straw lid - white.png',
                'yellow':       '/mockup-builder/drinkware/insulated drink bottle straw lid - yellow.png',
            },
        },
        styleAvailableColours: {
            'Travel Cup': ['army-green','baby-blue','bean-green','black','bluish-white','bright-blue','cream','crimson','dark-purple','grey','hot-pink','lavender','light-pink','lime-green','moss-green','navy','orange','peacock-blue','purple','smoky-pink','teal','white','yellow'],
            'Insulated Bottle': ['army-green','black','blue','brilliant-blue','coral','hot-pink','navy','purple','red','royal-blue','white','yellow'],
            'Insulated Bottle - Straw Lid': ['black','blue-yellow','blue','forest','green','light-purple','mint','navy','orange','pink-mint','pink','purple-red','purple','white','yellow'],
        },
        styles: ['Insulated Bottle - Straw Lid', 'Insulated Bottle', 'Travel Cup'],
        styleSizes: {
            'Insulated Bottle - Straw Lid': ['1L'],
            'Insulated Bottle': ['1L'],
            'Travel Cup': ['20 oz (591ml)'],
        },
        stylePlacements: {
            'Travel Cup': ['middle-travel'],
            'Insulated Bottle': ['top', 'middle', 'bottom'],
            'Insulated Bottle - Straw Lid': ['top-straw', 'middle-straw', 'bottom-straw'],
        },
        sizes: ['350ml', '450ml', '500ml', '750ml', '1L'],
        placements: [
            { id: 'top',          label: 'Top',    dot: { top: '40%', left: '50%' } },
            { id: 'middle',       label: 'Middle', dot: { top: '60%', left: '50%' } },
            { id: 'middle-travel',label: 'Middle', dot: { top: '50%', left: '49%' } },
            { id: 'bottom',       label: 'Bottom', dot: { top: '80%', left: '50%' } },
            { id: 'top-straw',    label: 'Top',    dot: { top: '35%', left: '52%' } },
            { id: 'middle-straw', label: 'Middle', dot: { top: '55%', left: '52%' } },
            { id: 'bottom-straw', label: 'Bottom', dot: { top: '80%', left: '52%' } },
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
    { id: 'orange',     label: 'Orange',       hex: '#00CFFF' },
    { id: 'sky-blue',   label: 'Sky Blue',     hex: '#5ba3d0' },
    { id: 'sand',       label: 'Sand',         hex: '#c8b89a' },
    { id: 'olive',      label: 'Olive',        hex: '#6b6b3a' },
    { id: 'purple',     label: 'Purple',       hex: '#5a2d82' },
    { id: 'brown',      label: 'Brown',        hex: '#5c3a1e' },
    { id: 'beige',      label: 'Beige',        hex: '#d4c5a9' },
    { id: 'aqua',       label: 'Aqua',         hex: '#00b8b0' },
    { id: 'army-green', label: 'Army Green',   hex: '#4a5240' },
    { id: 'lime-green', label: 'Lime Green',   hex: '#6abf30' },
    { id: 'yellow',     label: 'Yellow',       hex: '#e8c830' },
    { id: 'blue',       label: 'Blue',         hex: '#2a6cb5' },
    { id: 'khaki',      label: 'Khaki',        hex: '#8b7355' },
    { id: 'mint',        label: 'Mint',          hex: '#7ecec4' },
    { id: 'light-purple',label: 'Light Purple',  hex: '#b09fd0' },
    { id: 'green',       label: 'Green',         hex: '#4caf50' },
    { id: 'blue-yellow', label: 'Blue & Yellow', hex: '#2a6cb5', hex2: '#e8c830' },
    { id: 'pink-mint',   label: 'Pink & Mint',   hex: '#d4748a', hex2: '#7ecec4' },
    { id: 'purple-red',    label: 'Purple & Red',   hex: '#5a2d82', hex2: '#c0392b' },
    { id: 'brilliant-blue',label: 'Brilliant Blue', hex: '#1a5bbf' },
    { id: 'coral',         label: 'Coral',          hex: '#e8614a' },
    { id: 'hot-pink',      label: 'Hot Pink',       hex: '#e8186e' },
    { id: 'baby-blue',     label: 'Baby Blue',      hex: '#a8d8ea' },
    { id: 'bean-green',    label: 'Bean Green',     hex: '#7aab6e' },
    { id: 'bluish-white',  label: 'Bluish White',   hex: '#e8f0f7' },
    { id: 'bright-blue',   label: 'Bright Blue',    hex: '#1a80e5' },
    { id: 'cream',         label: 'Cream',          hex: '#f5f0e0' },
    { id: 'crimson',       label: 'Crimson',        hex: '#9b1b30' },
    { id: 'dark-purple',   label: 'Dark Purple',    hex: '#3b1a5a' },
    { id: 'lavender',      label: 'Lavender',       hex: '#b8a0d0' },
    { id: 'light-pink',    label: 'Light Pink',     hex: '#f4b8c8' },
    { id: 'moss-green',    label: 'Moss Green',     hex: '#6b7c4a' },
    { id: 'peacock-blue',  label: 'Peacock Blue',   hex: '#1a7a8a' },
    { id: 'smoky-pink',    label: 'Smoky Pink',     hex: '#c09090' },
    { id: 'teal',          label: 'Teal',           hex: '#008080' },
    { id: 'rose',          label: 'Rose',           hex: '#d4748a' },
    { id: 'grey-blue',     label: 'Grey Blue',      hex: '#7a90a0' },
    { id: 'dark-grey',     label: 'Dark Grey',      hex: '#404040' },
    { id: 'dark-orange',   label: 'Dark Orange',    hex: '#c85a00' },
    { id: 'deep-pink',     label: 'Deep Pink',      hex: '#c0186a' },
    { id: 'dark-gray',    label: 'Dark Gray',      hex: '#94A3B8555' },
    { id: 'emerald',      label: 'Emerald',        hex: '#1c7c4a' },
    { id: 'gold',         label: 'Gold',           hex: '#c8a000' },
    { id: 'gray',         label: 'Gray',           hex: '#909090' },
    { id: 'light-blue',   label: 'Light Blue',     hex: '#a0c8e8' },
    { id: 'light-green',  label: 'Light Green',    hex: '#8bc34a' },
];

// ── State ─────────────────────────────────────────────────────────────────────

const S = { product: null, style: null, colour: null, placement: null, placementBack: null, size: null, qty: 1, sockText: '', sockTextPlacements: [], sockTextColour: '#111111', decoration: null };



const SOCK_TEXT_PLACEMENTS = [
    { id: 'top-of-foot', label: 'Top of Foot' },
    { id: 'under-foot',  label: 'Under Foot / Sole' },
];

// ── Build product tab bar ─────────────────────────────────────────────────────

function buildTabs() {
    const bar = document.getElementById('product-bar');
    bar.innerHTML = Object.entries(PRODUCTS).map(([id, p]) => `
        <div class="prod-tab" data-pid="${id}" onclick="switchProduct('${id}')">
            <span class="ti">${p.icon}</span>${p.label}
        </div>
    `).join('');
}

// ── Render options ────────────────────────────────────────────────────────────

function renderOpts() {
    if (!S.product) return;
    const p = PRODUCTS[S.product];

    document.getElementById('style-list').innerHTML = p.styles.map(s => `
        <div class="style-opt ${S.style === s ? 'sel' : ''}" onclick="pick('style','${s}')">${p.icon} ${s}</div>
    `).join('');

    const styleAvail = S.style && p.styleAvailableColours && p.styleAvailableColours[S.style];
    const swatchList = styleAvail
        ? COLOURS.filter(c => styleAvail.includes(c.id))
        : p.availableColours
            ? COLOURS.filter(c => p.availableColours.includes(c.id))
            : COLOURS;
    document.getElementById('swatches').innerHTML = swatchList.map(c => {
        const bg = c.hex2 ? `linear-gradient(135deg, ${c.hex} 50%, ${c.hex2} 50%)` : c.hex;
        const border = (c.id === 'white' || c.hex2) ? '#999' : c.hex;
        return `
        <div class="sw-wrap">
            <div class="swatch ${S.colour === c.id ? 'sel' : ''}"
                 style="background:${bg}; border-color:${border};"
                 onclick="pick('colour','${c.id}')"></div>
            <div class="sw-tip">${c.label}</div>
        </div>`;
    }).join('');

    const allowedPlacements = (S.style && p.stylePlacements && p.stylePlacements[S.style])
        ? p.placements.filter(pl => p.stylePlacements[S.style].includes(pl.id))
        : p.placements;
    const frontPlacements = allowedPlacements.filter(pl => !pl.view || pl.view === 'front');
    const backPlacements  = allowedPlacements.filter(pl => pl.view === 'back');

    document.getElementById('place-list-front').innerHTML = frontPlacements.map(pl => `
        <div class="place-btn ${S.placement === pl.id ? 'sel' : ''}" onclick="pick('placement','${pl.id}')">
            <span class="pi">&#x25CF;</span>${pl.label}
        </div>
    `).join('');

    document.getElementById('place-list-back').innerHTML = backPlacements.map(pl => `
        <div class="place-btn ${S.placementBack === pl.id ? 'sel' : ''}" onclick="pick('placementBack','${pl.id}')">
            <span class="pi">&#x25CF;</span>${pl.label}
        </div>
    `).join('');

    document.getElementById('back-logo-wrap').style.display =
        (p.backImage && backPlacements.length) ? 'block' : 'none';

    const isSocks = S.product === 'socks';
    document.getElementById('sock-text-wrap').style.display = isSocks ? 'block' : 'none';

    const isBottle = S.product === 'bottle';
    document.getElementById('decoration-wrap').style.display = isBottle ? 'block' : 'none';
    if (isBottle) {
        document.getElementById('decoration-list').innerHTML = ['Printed', 'Engraved'].map(d => `
            <div class="style-opt ${S.decoration === d ? 'sel' : ''}" onclick="pickDecoration('${d}')">${d}</div>
        `).join('');
    }
    if (isSocks) {
        document.getElementById('sock-text-place-list').innerHTML = SOCK_TEXT_PLACEMENTS.map(pl => `
            <div class="place-btn ${S.sockTextPlacements.includes(pl.id) ? 'sel' : ''}" onclick="pickSockTextPlacement('${pl.id}')">
                <span class="pi">&#x25CF;</span>${pl.label}
            </div>
        `).join('');
    }

    const sizeList = (S.style && p.styleSizes && p.styleSizes[S.style]) ? p.styleSizes[S.style] : p.sizes;
    document.getElementById('size-grid').innerHTML = sizeList.map(s => `
        <button class="size-btn ${S.size === s ? 'sel' : ''}" onclick="pick('size','${s}')">${s}</button>
    `).join('');
}

// ── Mockup image ──────────────────────────────────────────────────────────────

function getImageSrc() {
    if (!S.product) return null;
    const p = PRODUCTS[S.product];
    if (S.style && S.colour && p.styleColourImages && p.styleColourImages[S.style] && p.styleColourImages[S.style][S.colour])
        return p.styleColourImages[S.style][S.colour];
    if (S.style && p.styleImages && p.styleImages[S.style]) return p.styleImages[S.style];
    if (S.colour && p.colourImages && p.colourImages[S.colour]) return p.colourImages[S.colour];
    return p.image.startsWith('.') || p.image.startsWith('/') ? p.image : 'mockups/' + p.image;
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
        // Dual view: load front and back in parallel, show when both ready
        let frontDone = false, backDone = false;

        function tryShow() {
            if (!frontDone || !backDone) return;
            drawCanvas();
            ph.style.display       = 'none';
            dualWrap.style.display = 'flex';
            const itemMaxW = p.dualItemMaxWidth || '390px';
            dualWrap.querySelectorAll('.view-item').forEach(el => el.style.maxWidth = itemMaxW);
        }

        const front = new Image();
        front.onload  = () => { loadedImg = front; frontDone = true; tryShow(); };
        front.onerror = () => { document.getElementById('ph-msg').textContent = 'Front image not found: ' + src; };
        front.src = src;

        const back = new Image();
        back.onload  = () => { loadedBackImg = back; backDone = true; tryShow(); };
        back.onerror = () => { document.getElementById('ph-msg').textContent = 'Back image not found: ' + backSrc; };
        back.src = backSrc;

    } else {
        // Single view
        const img = new Image();
        img.onload = () => {
            loadedImg = img;
            singleWrap.style.maxWidth = (S.style && p.styleMaxWidth && p.styleMaxWidth[S.style]) || p.maxWidth || '430px';
            drawCanvas();
            singleCanvas.style.display = 'block';
            singleWrap.style.display   = 'block';
            ph.style.display           = 'none';
        };
        img.onerror = () => { document.getElementById('ph-msg').textContent = 'Image not found: ' + src; };
        img.src = src;
    }
}

// ── Colour badge ──────────────────────────────────────────────────────────────

function renderColourBadge() {
    const note = document.getElementById('colour-note');
    if (!S.colour || !S.product) { note.classList.remove('visible'); return; }
    const c = COLOURS.find(x => x.id === S.colour);
    if (!c) return;
    document.getElementById('colour-dot').style.background = c.hex;
    document.getElementById('colour-note-text').textContent = c.label;
    note.classList.add('visible');
}

// renderDot is a no-op. Placement position is shown by the logo on canvas
function renderDot() {}

// ── Per-product session state (in-memory only, cleared on page reload) ───────

const productSessions = {};
const bottleStyleSessions = {};

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
        sockText: document.getElementById('sock-text-input').value,
        sockTextPlacements: S.sockTextPlacements.slice(),
        decoration: S.decoration,
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

// ── Pickers ───────────────────────────────────────────────────────────────────

function clearLogos() {
    loadedLogoFront = null; loadedLogoBack = null;
    logoFrontProduct = null; logoBackProduct = null;
    logoSizeFront = 20; logoSizeBack = 20;
    logoOffsetFrontX = 0; logoOffsetFrontY = 0;
    logoOffsetBackX  = 0; logoOffsetBackY  = 0;
    ['front', 'back'].forEach(side => {
        const fi = document.getElementById(`logo-file-${side}`);
        const th = document.getElementById(`logo-thumb-${side}`);
        const ld = document.getElementById(`logo-loaded-${side}`);
        const sz = document.getElementById(`logo-size-${side}`);
        const sv = document.getElementById(`logo-size-val-${side}`);
        if (fi) fi.value = '';
        if (th) th.src = '';
        if (ld) ld.classList.remove('show');
        if (sz) sz.value = 20;
        if (sv) sv.textContent = '20%';
        ['x','y'].forEach(axis => {
            const sl = document.getElementById(`offset-${side}-${axis}`);
            const vl = document.getElementById(`offset-${side}-${axis}-val`);
            if (sl) sl.value = 0;
            if (vl) vl.textContent = '0';
        });
    });
}

function switchProduct(id) {
    saveProductSession(S.product); // snapshot everything before leaving

    S.product = id; S.style = null; S.placement = null; S.placementBack = null; S.size = null;
    const newP = PRODUCTS[id];
    loadedImg = null; loadedBackImg = null;
    clearLogos();

    // Restore any previously saved session for this product
    const session = productSessions[id];
    if (session) {
        S.style         = session.style;
        S.placement     = session.placement;
        S.placementBack = session.placementBack;
        S.size          = session.size;
        S.qty           = 1;
        document.getElementById('qty').value   = 1;
        document.getElementById('notes').value = session.notes;
        // Restore colour only if it's valid for this product
        if (session.colour && (!newP.availableColours || newP.availableColours.includes(session.colour))) {
            S.colour = session.colour;
        }
        S.sockTextPlacements = session.sockTextPlacements || [];
        S.sockText = session.sockText || '';
        document.getElementById('sock-text-input').value = S.sockText;
        S.decoration = session.decoration || null;
    } else if (newP.availableColours && S.colour && !newP.availableColours.includes(S.colour)) {
        S.colour = null;
    }

    S.qty = 1;
    document.getElementById('qty').value = 1;

    // Pre-select style when there's only one option, or default for specific products
    if (!S.style && newP.styles.length === 1) S.style = newP.styles[0];
    if (!S.style && id === 'bottle') S.style = 'Insulated Bottle - Straw Lid';
    if (!S.placement && id === 'beanie') S.placement = 'front-center';
    if (!S.size && id === 'cap') S.size = 'One Size - Adjustable';

    document.querySelectorAll('.prod-tab').forEach(t =>
        t.classList.toggle('active', t.dataset.pid === id));
    renderOpts();
    renderMockup();
    renderDot();
    renderColourBadge();
    updateSummary();

    if (session) restoreLogos(session, id); // async: redraws canvas once logo images load
}

function pick(field, val) {
    if (field === 'style' && S.product === 'bottle') {
        // Save outgoing style session
        if (S.style) bottleStyleSessions[S.style] = { colour: S.colour, size: S.size, decoration: S.decoration };
        S.colour = null; S.size = null; S.decoration = null;
    }
    S[field] = val;
    if (field === 'style' && S.product === 'bottle') {
        if (val === 'Insulated Bottle - Straw Lid') S.placement = 'middle-straw';
        else if (val === 'Travel Cup') S.placement = 'middle-travel';
        else S.placement = 'middle';
        // Restore incoming style session
        const saved = bottleStyleSessions[val];
        if (saved) { S.colour = saved.colour; S.size = saved.size; S.decoration = saved.decoration; }
    }
    renderOpts();
    if (field === 'placement')     { if (loadedLogoFront) drawCanvas(); }
    if (field === 'placementBack') { if (loadedLogoBack)  drawCanvasBack(); }
    if (field === 'style') {
        const p = S.product ? PRODUCTS[S.product] : null;
        if (p && p.styleImages && p.styleImages[val]) renderMockup();
        if (S.product === 'bottle') renderColourBadge();
    }
    if (field === 'colour') {
        const p = S.product ? PRODUCTS[S.product] : null;
        const hasStyleColour = p && S.style && p.styleColourImages && p.styleColourImages[S.style] && p.styleColourImages[S.style][val];
        if (hasStyleColour || (p && p.colourImages && p.colourImages[val])) {
            renderMockup();
        } else {
            drawCanvas();
        }
        renderColourBadge();
    }
    updateSummary();
}

// Quantity bounds shared by sidebar +/- buttons AND the summary-bar input.
const QTY_MIN = 1;
const QTY_MAX = 100000;

function clampQty(n) {
    n = Math.floor(n);
    if (!Number.isFinite(n)) n = QTY_MIN;
    if (n < QTY_MIN) n = QTY_MIN;
    if (n > QTY_MAX) n = QTY_MAX;
    return n;
}

function changeQty(d) {
    const el = document.getElementById('qty');
    el.value = clampQty((parseInt(el.value) || QTY_MIN) + d);
    updateSummary();
}

// Summary-bar Qty input handlers. The summary now hosts an editable
// <input id="s-qty">; both inputs (sidebar #qty and summary #s-qty) must
// stay in sync. While typing we accept partial values and only clamp the
// model state — committing (blur / Enter) writes the clamped value back
// into the field so the user sees what was accepted.
function onSummaryQtyInput(raw) {
    const n = clampQty(parseInt(raw, 10));
    document.getElementById('qty').value = n;
    updateSummary();
}
function onSummaryQtyCommit(raw) {
    const n = clampQty(parseInt(raw, 10));
    document.getElementById('s-qty').value = n;
    document.getElementById('qty').value   = n;
    updateSummary();
}

// ── Summary ───────────────────────────────────────────────────────────────────

function updateSummary() {
    S.qty = clampQty(parseInt(document.getElementById('qty').value, 10));

    const colourLabel = S.colour ? (COLOURS.find(c => c.id === S.colour)?.label || S.colour) : null;
    const plLabel = (id) => id && S.product
        ? (PRODUCTS[S.product].placements.find(p => p.id === id)?.label || id) : null;
    const placementLabel = [plLabel(S.placement), plLabel(S.placementBack)].filter(Boolean).join(' / ') || null;

    const prod = S.product ? PRODUCTS[S.product] : null;
    const price = prod
        ? ((S.style && prod.stylePrices && prod.stylePrices[S.style]) ? prod.stylePrices[S.style] : prod.price)
        : null;
    const lineTotal = price ? price * S.qty : null;

    sv('s-product',    S.product ? PRODUCTS[S.product].label : null);
    sv('s-style',      S.style);
    sv('s-colour',     colourLabel);
    sv('s-placement',  placementLabel);
    sv('s-decoration', S.decoration);
    sv('s-size',       S.size);
    sv('s-unit-price', price     ? `$${price.toFixed(2)}`     : null);
    sv('s-line-total', lineTotal ? `$${lineTotal.toFixed(2)}` : null);

    // s-qty is now an <input>, not a <div>; mirror the clamped qty into
    // its .value so the sidebar +/- buttons stay in lockstep with the
    // summary field. Only write if the user isn't actively editing this
    // exact input (so we don't yank the caret while they type).
    const sQty = document.getElementById('s-qty');
    if (sQty && document.activeElement !== sQty) sQty.value = S.qty;
}

function sv(id, val) {
    const el = document.getElementById(id);
    if (val) { el.textContent = val; el.classList.remove('dim'); }
    else      { el.textContent = '-'; el.classList.add('dim'); }
}

// ── Actions ───────────────────────────────────────────────────────────────────

function resetAll() {
    S.style = null; S.colour = null; S.placement = null; S.placementBack = null; S.size = null; S.qty = 1;
    S.sockText = ''; S.sockTextPlacements = []; S.decoration = null;
    Object.keys(bottleStyleSessions).forEach(k => delete bottleStyleSessions[k]);
    document.getElementById('sock-text-input').value = '';
    document.getElementById('qty').value   = 1;
    document.getElementById('notes').value = '';
    ['front','back'].forEach(side => {
        document.getElementById(`logo-file-${side}`).value = '';
        document.getElementById(`logo-thumb-${side}`).src  = '';
        document.getElementById(`logo-loaded-${side}`).classList.remove('show');
    });
    loadedLogoFront = null; loadedLogoBack = null;
    renderOpts();
    drawCanvas();
    renderColourBadge();
    updateSummary();
}

function copySpec() {
    const colourLabel = S.colour ? (COLOURS.find(c => c.id === S.colour)?.label || S.colour) : '-';
    const plLabel = (id) => id && S.product
        ? (PRODUCTS[S.product].placements.find(p => p.id === id)?.label || id) : null;
    const placementLabel = [plLabel(S.placement), plLabel(S.placementBack)].filter(Boolean).join(' / ') || '-';
    const notes = document.getElementById('notes').value.trim();
    const date  = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    const sockTextPlacementLabel = S.sockTextPlacements.length
        ? S.sockTextPlacements.map(id => SOCK_TEXT_PLACEMENTS.find(p => p.id === id)?.label || id).join(' & ')
        : null;

    const lines = [
        'NOVAMERCH MOCKUP SPEC',
        '─────────────────────────',
        `Product     ${S.product ? PRODUCTS[S.product].label : '-'}`,
        `Style       ${S.style      || '-'}`,
        `Colour      ${colourLabel}`,
        `Placement   ${placementLabel}`,
        S.decoration ? `Logo Style  ${S.decoration}` : null,
        `Size        ${S.size       || '-'}`,
        `Quantity    ${S.qty}`,
        S.sockText ? `Sock Text   ${S.sockText}${sockTextPlacementLabel ? ` (${sockTextPlacementLabel})` : ''}` : null,
        notes ? `Notes       ${notes}` : null,
        '─────────────────────────',
        `Date        ${date}`,
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(lines).then(() => {
        const btn = document.getElementById('copy-btn');
        btn.textContent = 'Copied ✓';
        btn.style.color = '#7dd87d'; btn.style.borderColor = '#3a6a3a';
        setTimeout(() => { btn.textContent = 'Copy Spec'; btn.style.color = ''; btn.style.borderColor = ''; }, 2200);
    });
}

// ── Quote ─────────────────────────────────────────────────────────────────────

let quoteItems = [];

// Builds an HTML snippet: mockup image with logo overlaid via CSS absolute positioning
function buildMockupThumb(imgSrc, logoSrc, logoSize, logoOffsetX, logoOffsetY, placementId, product, height) {
    if (!imgSrc) return '';
    const h = height || 110;
    const imgTag = `<img src="${imgSrc}" style="height:${h}px;width:auto;display:block;border-radius:4px;background:#F1F5F9;">`;

    let logoOverlay = '';
    if (logoSrc && placementId && product && PRODUCTS[product]) {
        const placements = PRODUCTS[product].placements;
        const logoPositions = [];

        if (placementId === 'both-sleeves') {
            logoPositions.push({ left: '18%', top: '30%' }, { left: '82%', top: '30%' });
        } else {
            const pl = placements.find(x => x.id === placementId);
            if (pl) logoPositions.push({ left: pl.dot.left, top: pl.dot.top });
        }

        logoPositions.forEach(pos => {
            const l = `calc(${pos.left} + ${logoOffsetX}%)`;
            const t = `calc(${pos.top} + ${logoOffsetY}%)`;
            logoOverlay += `<img src="${logoSrc}" style="position:absolute;left:${l};top:${t};width:${logoSize}%;transform:translate(-50%,-50%);pointer-events:none;">`;
        });
    }

    return `<div style="position:relative;display:inline-block;line-height:0;border-radius:4px;overflow:hidden;">
        ${imgTag}${logoOverlay}
    </div>`;
}

function addToQuote() {
    if (!S.product) return;
    const p = PRODUCTS[S.product];

    const colour = S.colour ? COLOURS.find(c => c.id === S.colour)?.label : '';
    const plFront = S.placement    ? p.placements.find(x => x.id === S.placement)?.label    : '';
    const plBack  = S.placementBack? p.placements.find(x => x.id === S.placementBack)?.label : '';

    const sockTextPlacementLabel = S.sockTextPlacements.length
        ? S.sockTextPlacements.map(id => SOCK_TEXT_PLACEMENTS.find(x => x.id === id)?.label || id).join(' & ')
        : '';

    const logoFront = (logoFrontProduct === S.product && loadedLogoFront) ? loadedLogoFront.src : null;
    const logoBack  = (logoBackProduct  === S.product && loadedLogoBack)  ? loadedLogoBack.src  : null;

    quoteItems.push({
        id: Date.now(),
        product: S.product,
        label: S.style || p.label,
        style: S.style || '',
        colour,
        size: S.size || '',
        qty: S.qty,
        plFront, plBack,
        placement:     S.placement     || null,
        placementBack: S.placementBack || null,
        sockText: S.sockText || '',
        sockTextPlacement: sockTextPlacementLabel,
        decoration: S.decoration || '',
        notes: document.getElementById('notes').value.trim(),
        unitPrice: (S.style && p.stylePrices && p.stylePrices[S.style]) ? p.stylePrices[S.style] : p.price,
        imgFront:      getImageSrc()     || null,
        imgBack:       getBackImageSrc() || null,
        logoFrontSrc:  logoFront,
        logoFrontSize: logoSizeFront,
        logoFrontOffsetX: logoOffsetFrontX,
        logoFrontOffsetY: logoOffsetFrontY,
        logoBackSrc:   logoBack,
        logoBackSize:  logoSizeBack,
        logoBackOffsetX: logoOffsetBackX,
        logoBackOffsetY: logoOffsetBackY,
    });

    renderQuotePanel();

    // Brief feedback on button
    const btn = document.getElementById('add-quote-btn');
    btn.textContent = 'Added ✓';
    btn.style.color = '#7dd87d'; btn.style.borderColor = '#3a6a3a';
    setTimeout(() => { btn.textContent = '+ Add to Basket'; btn.style.color = ''; btn.style.borderColor = ''; }, 1800);
}

function removeQuoteItem(id) {
    quoteItems = quoteItems.filter(x => x.id !== id);
    renderQuotePanel();
}

function clearQuote() {
    quoteItems = [];
    renderQuotePanel();
}

let quotePanelOpen = true;
function toggleQuotePanel() {
    quotePanelOpen = !quotePanelOpen;
    const panel = document.getElementById('quote-panel');
    const btn   = document.getElementById('toggle-quote-btn');
    panel.classList.toggle('collapsed', !quotePanelOpen);
    btn.textContent = quotePanelOpen ? 'Basket ▲' : 'Basket ▼';
}

function quoteSubtotal() {
    return quoteItems.reduce((s, i) => s + i.unitPrice * i.qty, 0);
}

function renderQuotePanel() {
    const panel = document.getElementById('quote-panel');
    const list  = document.getElementById('qp-list');
    const count = document.getElementById('qp-count');
    const grand = document.getElementById('qp-grand-total');
    const printBtn = document.getElementById('print-btn');

    const toggleBtn = document.getElementById('toggle-quote-btn');
    if (quoteItems.length === 0) {
        panel.style.display = 'none';
        toggleBtn.style.display = 'none';
        printBtn.textContent = 'Request Quote';
        return;
    }

    panel.style.display = 'block';
    toggleBtn.style.display = 'inline-flex';
    toggleBtn.textContent = quotePanelOpen ? 'Basket ▲' : 'Basket ▼';
    panel.classList.toggle('collapsed', !quotePanelOpen);
    const sub = quoteSubtotal();
    const total = sub;
    count.textContent = `${quoteItems.length} item${quoteItems.length > 1 ? 's' : ''}`;
    grand.textContent = `Total (inc. GST): $${total.toFixed(2)}`;
    printBtn.textContent = `Request Quote (${quoteItems.length})`;

    list.innerHTML = quoteItems.map(item => `
        <div class="qp-item">
            <div class="qp-item-thumb">
                ${buildMockupThumb(item.imgFront, item.logoFrontSrc, item.logoFrontSize, item.logoFrontOffsetX, item.logoFrontOffsetY, item.placement, item.product, 70)}
                ${item.imgBack ? buildMockupThumb(item.imgBack, item.logoBackSrc, item.logoBackSize, item.logoBackOffsetX, item.logoBackOffsetY, item.placementBack, item.product, 70) : ''}
            </div>
            <div class="qp-item-info">
                <div class="qp-item-name">${item.label}</div>
                <div class="qp-item-desc">${[item.style, item.colour, item.size].filter(Boolean).join(' · ')}${item.decoration ? ` · ${item.decoration}` : ''}${item.qty > 1 ? ` · Qty: ${item.qty}` : ''}${item.sockText ? ` · Text: ${item.sockText}${item.sockTextPlacement ? ` (${item.sockTextPlacement})` : ''}` : ''}</div>
            </div>
            <div class="qp-item-price">
                <div class="qp-item-total">$${(item.unitPrice * item.qty).toFixed(2)}</div>
                <div class="qp-item-unit">$${item.unitPrice.toFixed(2)} ea</div>
            </div>
            <button class="qp-remove" onclick="removeQuoteItem(${item.id})">✕</button>
        </div>
    `).join('');
}

function printQuote() {
    const pq = document.getElementById('print-quote');

    if (quoteItems.length === 0) {
        window.print();
        return;
    }

    const date     = new Date().toLocaleDateString('en-AU', { day: '2-digit', month: 'long', year: 'numeric' });
    const quoteNum = 'QT-' + Date.now().toString().slice(-6);
    const sub      = quoteSubtotal();
    const total    = sub;

    pq.innerHTML = `
        <div class="pq-header">
            <div class="pq-brand">Nova<span>merch</span></div>
            <div class="pq-meta">
                <div class="pq-quote-num">Quote ${quoteNum}</div>
                <div class="pq-date">${date}</div>
            </div>
        </div>
        <table class="pq-table">
            <thead>
                <tr>
                    <th style="width:28%">Item</th>
                    <th>Description</th>
                    <th style="width:6%">Qty</th>
                    <th style="width:11%">Unit Price</th>
                    <th style="width:11%">Total</th>
                </tr>
            </thead>
            <tbody>
                ${quoteItems.map(item => `
                    <tr>
                        <td>
                            <div style="display:flex;gap:6px;margin-bottom:6px;">
                                ${buildMockupThumb(item.imgFront, item.logoFrontSrc, item.logoFrontSize, item.logoFrontOffsetX, item.logoFrontOffsetY, item.placement, item.product, 140)}
                                ${item.imgBack ? buildMockupThumb(item.imgBack, item.logoBackSrc, item.logoBackSize, item.logoBackOffsetX, item.logoBackOffsetY, item.placementBack, item.product, 140) : ''}
                            </div>
                            <div class="pq-item-label">${item.label}</div>
                        </td>
                        <td class="pq-desc">
                            ${[
                                item.style    ? `Style: ${item.style}`             : null,
                                item.colour   ? `Colour: ${item.colour}`           : null,
                                item.size     ? `Size: ${item.size}`               : null,
                                item.plFront    ? `Front placement: ${item.plFront}` : null,
                                item.plBack     ? `Back placement: ${item.plBack}`   : null,
                                item.decoration ? `Logo Style: ${item.decoration}`   : null,
                                item.sockText   ? `Sock text: ${item.sockText}${item.sockTextPlacement ? ` (${item.sockTextPlacement})` : ''}` : null,
                                item.notes    ? `Notes: ${item.notes}`             : null,
                            ].filter(Boolean).join('<br>')}
                        </td>
                        <td style="text-align:center">${item.qty}</td>
                        <td style="text-align:right">$${item.unitPrice.toFixed(2)}</td>
                        <td style="text-align:right">$${(item.unitPrice * item.qty).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div class="pq-totals">
            <div class="pq-total-row pq-grand"><span>Total (inc. GST)</span><span>$${total.toFixed(2)}</span></div>
            <div style="font-size: 10px; color: #475569; font-style: italic; margin-top: 4px;">All prices shown are inclusive of GST.</div>
        </div>
        <div class="pq-footer">All prices in AUD including customisation. This quote is valid for 30 days from the date above. Prices subject to change based on final artwork and quantity.</div>
    `;

    window.print();
}

// ── Quote request submission ──────────────────────────────────────────────────
// Posts directly to the admin-panel's public intake endpoint, which dual-fires
// an EmailJS notification AND persists to Airtable. The admin panel
// self-authorises via an Origin allowlist + per-IP rate limit (no shared
// secret can live safely in the static customer bundle).
//
// The endpoint URL is chosen at submit-time from window.location.hostname so
// the same static bundle works both locally (localhost) and in production
// (novamerchau.com).

function quoteEndpoint() {
    const host = (typeof window !== 'undefined' && window.location && window.location.hostname) || '';
    if (host === 'localhost' || host === '127.0.0.1') {
        return 'http://localhost:3001/admin/api/public/quote-requests';
    }
    return 'https://novamerchau.com/admin/api/public/quote-requests';
}

// requestId is generated when the modal opens and reused for all retry POSTs
// of the same submission attempt. Regenerated on success so the next
// submission gets a fresh ID. Lets the server short-circuit duplicate POSTs
// (e.g. double-click on Send) within a 5-minute window.
let currentRequestId = null;

function newRequestId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    // Fallback: timestamped pseudo-uuid for very old browsers.
    return 'rq-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

function requestQuote() {
    if (quoteItems.length === 0) {
        alert('Please add items to your basket before requesting a quote.');
        return;
    }
    document.getElementById('rq-name').value  = '';
    document.getElementById('rq-email').value = '';
    document.getElementById('rq-phone').value = '';
    document.getElementById('rq-status').textContent = '';
    document.getElementById('rq-status').className = 'rq-status';
    document.getElementById('rq-send-btn').disabled = false;
    document.getElementById('rq-send-btn').textContent = 'Send Request';
    document.getElementById('rq-overlay').classList.add('open');
    currentRequestId = newRequestId();
}

function closeRqModal() {
    document.getElementById('rq-overlay').classList.remove('open');
}

function submitQuoteRequest() {
    const name  = document.getElementById('rq-name').value.trim();
    const email = document.getElementById('rq-email').value.trim();
    const phone = document.getElementById('rq-phone').value.trim();
    const status = document.getElementById('rq-status');

    if (!name)  { status.textContent = 'Please enter your name.';  status.className = 'rq-status err'; return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        status.textContent = 'Please enter a valid email address.';
        status.className = 'rq-status err';
        return;
    }

    if (!currentRequestId) currentRequestId = newRequestId();

    const sendBtn = document.getElementById('rq-send-btn');
    sendBtn.disabled = true;
    sendBtn.textContent = 'Sending…';
    status.textContent = '';
    status.className = 'rq-status';

    // Build the payload. Each item carries its full spec so the server can
    // render the email + persist a description on the Quote line item.
    const items = quoteItems.map(item => ({
        product:    item.product,
        label:      PRODUCTS[item.product]?.label || item.product,
        style:      item.style      || '',
        colour:     item.colour     || '',
        size:       item.size       || '',
        plFront:    item.plFront    || '',
        plBack:     item.plBack     || '',
        decoration: item.decoration || '',
        sockText:   item.sockText   || '',
        notes:      item.notes      || '',
        qty:        item.qty,
        unitPrice:  item.unitPrice,
    }));

    fetch(quoteEndpoint(), {
        method: 'POST',
        // Browser will attach the Origin header automatically; the server's
        // CORS check rejects requests from any non-allowlisted origin.
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            customer: { name, email, phone, company: '' },
            items,
            notes: '',
            requestId: currentRequestId,
        }),
    })
    .then(async res => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            const msg = res.status === 429
                ? 'Too many requests. Please wait a moment and try again.'
                : (data && data.error) || 'Send failed. Please email novamerch.au@gmail.com directly.';
            throw new Error(msg);
        }
        return data;
    })
    .then(data => {
        if (data && data.partial) {
            // Airtable saved, email pending (or vice-versa). Surface that
            // explicitly so the customer doesn't worry if the confirmation
            // email is delayed.
            const detail = data.email === false
                ? "saved, email pending"
                : "saved, email sent";
            status.textContent = `✓ Quote request received (${detail}). We'll be in touch soon.`;
        } else {
            status.textContent = `✓ Quote request sent! We'll be in touch soon.`;
        }
        status.className = 'rq-status ok';
        sendBtn.textContent = 'Sent ✓';
        // Regenerate so the next submission gets a fresh idempotency key.
        currentRequestId = newRequestId();
        setTimeout(() => closeRqModal(), 3000);
    })
    .catch(err => {
        console.error('Quote submit error:', err);
        status.textContent = err.message || 'Send failed. Please email novamerch.au@gmail.com directly.';
        status.className = 'rq-status err';
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send Request';
    });
}

// ── Sidebar splitter ──────────────────────────────────────────────────────────
// Draggable handle between .opts (sidebar) and .preview (canvas). Width is
// persisted to localStorage so it survives page reloads. Idempotent: the
// React component already prevents double-loading this script via
// window.__novamerchMockupLoaded, but we additionally gate the splitter
// init with a sentinel so a future second invocation can't stack listeners.
const SPLITTER_STORAGE_KEY = 'novamerch.sidebarWidth';
const SPLITTER_MIN = 200;
const SPLITTER_MAX = 480;
const SPLITTER_DEFAULT = 272;
const SPLITTER_KEY_STEP = 16;

function clampSidebar(w) {
    if (!Number.isFinite(w)) return SPLITTER_DEFAULT;
    return Math.max(SPLITTER_MIN, Math.min(SPLITTER_MAX, Math.round(w)));
}

function applySidebarWidth(w) {
    document.documentElement.style.setProperty('--sidebar-width', clampSidebar(w) + 'px');
}

function initSplitter() {
    if (window.__novamerchSplitterInit) return;
    window.__novamerchSplitterInit = true;

    const splitter = document.getElementById('splitter');
    const sidebar  = document.querySelector('.opts');
    if (!splitter || !sidebar) return;

    // Restore persisted width (if any) before first paint of any drag.
    try {
        const stored = parseInt(localStorage.getItem(SPLITTER_STORAGE_KEY), 10);
        if (Number.isFinite(stored)) applySidebarWidth(stored);
    } catch (_) { /* ignore quota / disabled storage */ }

    let dragging = false;
    let startX = 0;
    let startW = 0;

    function pointerX(e) {
        if (e.touches && e.touches[0]) return e.touches[0].clientX;
        if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].clientX;
        return e.clientX;
    }

    function onDown(e) {
        dragging = true;
        startX = pointerX(e);
        startW = sidebar.getBoundingClientRect().width;
        splitter.classList.add('dragging');
        document.body.classList.add('splitter-dragging');
        e.preventDefault();
    }

    function onMove(e) {
        if (!dragging) return;
        const dx = pointerX(e) - startX;
        const next = clampSidebar(startW + dx);
        applySidebarWidth(next);
        e.preventDefault();
    }

    function onUp() {
        if (!dragging) return;
        dragging = false;
        splitter.classList.remove('dragging');
        document.body.classList.remove('splitter-dragging');
        // Persist final width.
        const current = sidebar.getBoundingClientRect().width;
        try { localStorage.setItem(SPLITTER_STORAGE_KEY, String(Math.round(current))); }
        catch (_) { /* ignore */ }
        // Let the existing resize handler redraw canvases at the new size.
        window.dispatchEvent(new Event('resize'));
    }

    splitter.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove',   onMove);
    window.addEventListener('mouseup',     onUp);

    splitter.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('touchmove',    onMove, { passive: false });
    window.addEventListener('touchend',     onUp);
    window.addEventListener('touchcancel',  onUp);

    // Keyboard accessibility — arrows nudge, Home resets, End maxes out.
    splitter.addEventListener('keydown', (e) => {
        const current = sidebar.getBoundingClientRect().width;
        let next = null;
        if (e.key === 'ArrowLeft')  next = current - SPLITTER_KEY_STEP;
        else if (e.key === 'ArrowRight') next = current + SPLITTER_KEY_STEP;
        else if (e.key === 'Home')  next = SPLITTER_DEFAULT;
        else if (e.key === 'End')   next = SPLITTER_MAX;
        if (next === null) return;
        e.preventDefault();
        const clamped = clampSidebar(next);
        applySidebarWidth(clamped);
        try { localStorage.setItem(SPLITTER_STORAGE_KEY, String(clamped)); } catch (_) {}
        window.dispatchEvent(new Event('resize'));
    });
}

// ── Summary splitter ──────────────────────────────────────────────────────────
// Draggable handle between the product images and the specification / action
// section. Drag upward to give the section more room, or downward to give the
// images more room. The chosen height is persisted between visits.
const SUMMARY_SPLITTER_STORAGE_KEY = 'novamerch.summaryHeight';
const SUMMARY_MIN = 72;
const SUMMARY_DEFAULT = 88;
const SUMMARY_KEY_STEP = 16;

function summaryMax() {
    const shell = document.querySelector('.mockup-shell');
    return Math.max(SUMMARY_MIN, Math.floor((shell?.getBoundingClientRect().height || window.innerHeight) * 0.5));
}

function clampSummaryHeight(h) {
    if (!Number.isFinite(h)) return SUMMARY_DEFAULT;
    return Math.max(SUMMARY_MIN, Math.min(summaryMax(), Math.round(h)));
}

function applySummaryHeight(h) {
    const shell = document.querySelector('.mockup-shell');
    if (shell) shell.style.setProperty('--sum-height', clampSummaryHeight(h) + 'px');
}

function initSummarySplitter() {
    if (window.__novamerchSummarySplitterInit) return;
    window.__novamerchSummarySplitterInit = true;

    const splitter = document.getElementById('splitter-h');
    const summary = document.querySelector('.sum-bar');
    if (!splitter || !summary) return;

    try {
        const stored = parseInt(localStorage.getItem(SUMMARY_SPLITTER_STORAGE_KEY), 10);
        if (Number.isFinite(stored)) applySummaryHeight(stored);
    } catch (_) { /* ignore quota / disabled storage */ }

    let dragging = false;
    let startY = 0;
    let startH = 0;

    function pointerY(e) {
        if (e.touches && e.touches[0]) return e.touches[0].clientY;
        if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].clientY;
        return e.clientY;
    }

    function onDown(e) {
        dragging = true;
        startY = pointerY(e);
        startH = summary.getBoundingClientRect().height;
        splitter.classList.add('dragging');
        document.body.classList.add('splitter-h-dragging');
        e.preventDefault();
    }

    function onMove(e) {
        if (!dragging) return;
        applySummaryHeight(startH + (startY - pointerY(e)));
        e.preventDefault();
    }

    function onUp() {
        if (!dragging) return;
        dragging = false;
        splitter.classList.remove('dragging');
        document.body.classList.remove('splitter-h-dragging');
        const current = clampSummaryHeight(summary.getBoundingClientRect().height);
        try { localStorage.setItem(SUMMARY_SPLITTER_STORAGE_KEY, String(current)); } catch (_) {}
        window.dispatchEvent(new Event('resize'));
    }

    splitter.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    splitter.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchcancel', onUp);

    splitter.addEventListener('keydown', (e) => {
        const current = summary.getBoundingClientRect().height;
        let next = null;
        if (e.key === 'ArrowUp') next = current + SUMMARY_KEY_STEP;
        else if (e.key === 'ArrowDown') next = current - SUMMARY_KEY_STEP;
        else if (e.key === 'Home') next = SUMMARY_DEFAULT;
        else if (e.key === 'End') next = summaryMax();
        if (next === null) return;
        e.preventDefault();
        const clamped = clampSummaryHeight(next);
        applySummaryHeight(clamped);
        try { localStorage.setItem(SUMMARY_SPLITTER_STORAGE_KEY, String(clamped)); } catch (_) {}
        window.dispatchEvent(new Event('resize'));
    });
}

// ── Boot ──────────────────────────────────────────────────────────────────────
buildTabs();
switchProduct('tshirt');
updateSummary();
initSplitter();
initSummarySplitter();

window.addEventListener('resize', () => {
    if (loadedImg) drawCanvas();
    if (loadedBackImg) drawCanvasBack();
});
