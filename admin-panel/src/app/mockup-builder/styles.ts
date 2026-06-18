// Shared CSS for the Mockup Builder customer and admin pages.
// Single source of truth. Both client components import STYLES_CSS from here.
// NOTE: .btn-primary uses color:#0A1020 (dark) on cyan #00CFFF background for
// WCAG AA contrast. Do not revert to color:#fff on cyan.
export const STYLES_CSS = `
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #060C18;
            color: #F1F5F9;
            height: 100vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Header */
        header {
            background: #0A1020;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            padding: 0 28px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-shrink: 0;
        }

        header h1 { font-size: 17px; font-weight: 700; color: #fff; letter-spacing: -0.3px; }
        header h1 span { color: #00CFFF; }
        header small { font-size: 12px; color: #475569; }

        /* Product tab bar */
        .product-bar {
            background: #131313;
            border-bottom: 1px solid rgba(255,255,255,0.08);
            padding: 0 20px;
            display: flex;
            gap: 2px;
            overflow-x: auto;
            flex-shrink: 0;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.08) transparent;
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
            color: #94A3B8;
            white-space: nowrap;
            transition: all 0.12s;
            user-select: none;
            display: flex;
            align-items: center;
            gap: 5px;
            flex-shrink: 0;
            height: 36px;
        }

        .prod-tab:hover:not(.active) { color: #999; background: #0A1020; }
        .prod-tab.active { background: #1e1e1e; color: #fff; border-color: #2e2e2e; }
        .prod-tab .ti { font-size: 14px; }

        /* Main layout */
        .main {
            display: grid;
            grid-template-columns: 272px 1fr;
            flex: 1;
            min-height: 0;
        }

        /* Options panel */
        .opts {
            background: #0D1526;
            border-right: 1px solid rgba(255,255,255,0.08);
            overflow-y: auto;
            padding: 18px 14px 24px;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.08) transparent;
        }

        .opt-sec { margin-bottom: 20px; }

        .opt-lbl {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.9px;
            color: #475569;
            margin-bottom: 9px;
        }

        /* Style list */
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
        .style-opt.sel { border-color: #00CFFF; color: #fff; background: rgba(0,207,255,0.15); }

        /* Colour swatches */
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
        .swatch.sel { outline-color: #00CFFF; }

        .sw-tip {
            position: absolute;
            bottom: calc(100% + 5px);
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255,255,255,0.08);
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

        /* Placement */
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
        .place-btn.sel { border-color: #00CFFF; color: #fff; background: rgba(0,207,255,0.15); }
        .pi { font-size: 13px; width: 16px; text-align: center; flex-shrink: 0; }

        /* Sizes */
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
        .size-btn.sel { border-color: #00CFFF; color: #fff; background: rgba(0,207,255,0.15); }

        /* Qty */
        .qty-row {
            display: flex;
            align-items: center;
            border: 1px solid rgba(255,255,255,0.08);
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

        .qty-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }

        .qty-val {
            width: 48px;
            height: 32px;
            background: #161616;
            border: none;
            border-left: 1px solid rgba(255,255,255,0.08);
            border-right: 1px solid rgba(255,255,255,0.08);
            color: #fff;
            font-size: 13px;
            font-weight: 700;
            text-align: center;
        }

        /* Notes */
        .notes-ta {
            width: 100%;
            background: #1e1e1e;
            border: 1px solid rgba(255,255,255,0.08);
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
        .notes-ta::placeholder { color: #475569; }

        .divider { height: 1px; background: #202020; margin: 14px 0; }

        /* Preview */
        .preview {
            display: grid;
            grid-template-rows: 1fr auto;
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
            background: #F1F5F9;
            border-radius: 10px;
            overflow: hidden;
            isolation: isolate; /* keeps multiply blend inside the wrap, away from dark stage */
            box-shadow: 0 8px 40px rgba(0,0,0,0.5);
        }

        .mockup-img {
            width: auto;
            max-width: 100%;
            height: auto;
            max-height: calc(100vh - 265px);
            display: block;
            margin: 0 auto;
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
        .ph-msg { font-size: 13px; text-align: center; max-width: 220px; line-height: 1.6; color: #475569; }

        /* Colour note badge */
        .colour-note {
            position: absolute;
            top: 28px;
            right: 28px;
            background: #1e1e1e;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 5px;
            padding: 5px 10px;
            font-size: 11px;
            color: #94A3B8;
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

        /* Placement dot */
        .pdot {
            position: absolute;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: rgba(0,207,255,0.9);
            border: 2px solid #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            font-weight: 900;
            color: #fff;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.4);
            transition: opacity 0.2s, transform 0.2s;
            box-shadow: 0 2px 8px rgba(0,0,0,0.6);
            pointer-events: none;
            z-index: 5;
        }

        .pdot.show { opacity: 1; transform: translate(-50%, -50%) scale(1); }

        /* Summary bar */
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
            color: #475569;
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

        .btn-ghost { background: #1c1c1c; border: 1px solid rgba(255,255,255,0.08); color: #999; }
        .btn-ghost:hover { background: #222; color: #fff; }
        /* WCAG AA: dark text on cyan (contrast ratio ~9.5:1). Do NOT use #fff here. */
        .btn-primary { background: #00CFFF; color: #0A1020; }
        .btn-primary:hover { background: #00B8E6; color: #0A1020; }

        /* Dual canvas (front + back) */
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
            color: #475569;
        }

        .canvas-dual {
            width: auto;
            max-width: 100%;
            height: auto;
            max-height: calc(100vh - 250px);
            display: block;
            border-radius: 8px;
            background: #F1F5F9;
            box-shadow: 0 6px 28px rgba(0,0,0,0.45);
        }

        /* Logo upload */
        .logo-drop {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 6px;
            padding: 14px 10px;
            border-radius: 6px;
            border: 1px dashed #2e2e2e;
            background: #0A1020;
            color: #94A3B8;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.12s;
            width: 100%;
            text-align: center;
        }

        .logo-drop:hover, .logo-drop.drag-over {
            border-color: #00CFFF;
            color: #00CFFF;
            background: rgba(0,207,255,0.15);
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
            background: repeating-conic-gradient(#222 0% 25%, #0A1020 0% 50%) 0 0 / 10px 10px;
            border-radius: 4px;
            border: 1px solid rgba(255,255,255,0.08);
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
            color: #475569;
            white-space: nowrap;
        }

        .logo-size-row input[type=range] {
            flex: 1;
            accent-color: #00CFFF;
            height: 3px;
        }

        .logo-size-val {
            font-size: 11px;
            color: #94A3B8;
            min-width: 30px;
            text-align: right;
        }

        .logo-remove {
            padding: 5px 10px;
            border-radius: 4px;
            background: transparent;
            border: 1px solid rgba(255,255,255,0.08);
            color: #94A3B8;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.1s;
            align-self: flex-start;
        }

        .logo-remove:hover { border-color: #c0392b; color: #c0392b; }

        /* Logo position offsets */
        .logo-offsets { margin-top: 10px; display: flex; flex-direction: column; gap: 5px; }

        .offset-row {
            display: flex;
            align-items: center;
            gap: 7px;
        }

        .offset-icon { font-size: 12px; color: #475569; width: 14px; flex-shrink: 0; text-align: center; }

        .offset-lbl { font-size: 10px; color: #475569; width: 14px; flex-shrink: 0; }

        .offset-row input[type=range] {
            flex: 1;
            accent-color: #00CFFF;
            height: 3px;
        }

        .offset-val { font-size: 10px; color: #94A3B8; min-width: 22px; text-align: right; }

        /* Quote panel */
        .preview {
            display: grid;
            grid-template-rows: 1fr auto auto;
            background: #0e0e0e;
            min-height: 0;
        }

        .quote-panel {
            background: #141414;
            border-top: 1px solid rgba(255,255,255,0.08);
            height: 200px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.08) transparent;
            transition: height 0.2s ease;
        }

        .quote-panel.collapsed {
            height: 0;
            border-top: none;
            overflow: hidden;
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
            color: #94A3B8;
            position: sticky;
            top: 0;
            background: #141414;
        }

        .qp-total-badge {
            margin-left: auto;
            font-size: 12px;
            font-weight: 700;
            color: #00CFFF;
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
            gap: 12px;
            padding: 10px 18px;
            border-bottom: 1px solid #0A1020;
            font-size: 12px;
        }

        .qp-item:last-child { border-bottom: none; }

        .qp-item-thumb {
            display: flex;
            gap: 6px;
            flex-shrink: 0;
            align-items: center;
        }

        .qp-thumb {
            width: auto;
            height: 110px;
            object-fit: contain;
            background: #F1F5F9;
            border-radius: 5px;
        }

        .qp-item-info { flex: 1; min-width: 0; }
        .qp-item-name { font-weight: 600; color: #ddd; }
        .qp-item-desc { color: #94A3B8; font-size: 11px; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .qp-item-price {
            text-align: right;
            flex-shrink: 0;
        }

        .qp-item-total { font-weight: 700; color: #F1F5F9; font-size: 13px; }
        .qp-item-unit  { color: #444; font-size: 10px; margin-top: 1px; }

        .qp-remove {
            background: none; border: none;
            color: #333; font-size: 14px;
            cursor: pointer; padding: 2px 4px;
            flex-shrink: 0;
        }
        .qp-remove:hover { color: #c0392b; }

        /* Print quote */
        #print-quote { display: none; }

        .print-header,
        .print-footer-mark { display: none; }

        @page { margin: 12mm 12mm 18mm 12mm; }

        @media print {
            html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            body > *:not(#print-quote):not(.print-header):not(.print-footer-mark) { display: none !important; }
            #print-quote {
                display: block !important;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-size: 12px;
                color: #111;
                background: #fff;
                padding: 32px 40px;
            }
            .print-header {
                display: flex !important;
                position: fixed;
                top: 6mm;
                left: 12mm;
                align-items: center;
                gap: 8px;
                color: #111;
                font-size: 12px;
                font-weight: 800;
                letter-spacing: 0.4px;
                z-index: 9999;
            }
            .print-header img { height: 40px; width: auto; color: #111; }
            .print-footer-mark {
                display: flex !important;
                position: fixed;
                bottom: 6mm;
                right: 12mm;
                opacity: 0.5;
                z-index: 9999;
            }
            .print-footer-mark img { height: 20px; width: auto; color: #111; }
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
        .pq-brand span { color: #00CFFF; }

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
            border-bottom: 1px solid #F1F5F9;
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
            border-top: 1px solid #F1F5F9;
            padding-top: 12px;
        }
        /* Customer request modal */
        .rq-overlay {
            display: none;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.72);
            z-index: 100;
            align-items: center;
            justify-content: center;
        }
        .rq-overlay.open { display: flex; }

        .rq-modal {
            background: #1e1e1e;
            border: 1px solid #2e2e2e;
            border-radius: 10px;
            padding: 28px 30px;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 16px 60px rgba(0,0,0,0.7);
        }

        .rq-modal h2 {
            font-size: 16px;
            font-weight: 700;
            color: #fff;
            margin-bottom: 6px;
        }

        .rq-modal p {
            font-size: 12px;
            color: #94A3B8;
            margin-bottom: 22px;
            line-height: 1.5;
        }

        .rq-field { margin-bottom: 14px; }

        .rq-field label {
            display: block;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            color: #475569;
            margin-bottom: 6px;
        }

        .rq-field input {
            width: 100%;
            background: #161616;
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 5px;
            color: #ddd;
            padding: 9px 12px;
            font-size: 13px;
            font-family: inherit;
            outline: none;
            transition: border-color 0.1s;
        }

        .rq-field input:focus { border-color: #00CFFF; }
        .rq-field input::placeholder { color: #333; }

        .rq-actions {
            display: flex;
            gap: 8px;
            margin-top: 22px;
        }

        .rq-status {
            font-size: 12px;
            margin-top: 14px;
            text-align: center;
            min-height: 18px;
        }

        .rq-status.ok  { color: #7dd87d; }
        .rq-status.err { color: #e05050; }
`;
