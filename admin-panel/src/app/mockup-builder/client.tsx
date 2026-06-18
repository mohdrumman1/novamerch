"use client";

import { useEffect } from "react";
import { STYLES_CSS } from "./styles";

declare global {
  interface Window {
    __novamerchMockupAdminLoaded?: boolean;
    __MOCKUP_ASSET_BASE?: string;
  }
}

const BODY_HTML = `
<div class="mockup-shell">

<header>
    <h1>Nova<span>merch</span> Mockup Builder</h1>
    <small>Internal Design Tool</small>
</header>

<!-- Product tab bar -->
<div class="product-bar" id="product-bar"></div>

<div class="main">

    <!-- Options panel -->
    <div class="opts">

        <div class="opt-sec">
            <div class="opt-lbl">Style</div>
            <div class="style-list" id="style-list"></div>
        </div>

        <div class="divider"></div>

        <div class="opt-sec">
            <div class="opt-lbl">Colour</div>
            <div class="swatches" id="swatches"></div>
        </div>

        <div class="divider"></div>

        <div class="opt-sec">
            <div class="opt-lbl">Front Logo</div>
            <label class="logo-drop"
                   ondragover="event.preventDefault(); this.classList.add('drag-over')"
                   ondragleave="this.classList.remove('drag-over')"
                   ondrop="event.preventDefault(); this.classList.remove('drag-over'); handleLogoFile('front', event.dataTransfer.files[0])">
                <input type="file" id="logo-file-front" accept="image/*"
                       onchange="handleLogoFile('front', this.files[0])">
                <span class="logo-drop-icon">&#127912;&#65039;</span>
                <span>Click or drag &amp; drop</span>
                <span style="font-size:10px; color:#475569;">PNG, SVG, JPG</span>
            </label>
            <div class="logo-loaded" id="logo-loaded-front">
                <img class="logo-thumb" id="logo-thumb-front" src="" alt="">
                <div class="logo-size-row">
                    <span>Size</span>
                    <input type="range" min="3" max="50" value="20" id="logo-size-front"
                           oninput="onLogoSize('front', this.value)">
                    <span class="logo-size-val" id="logo-size-val-front">20%</span>
                </div>
                <button class="logo-remove" onclick="removeLogo('front')">&#10005; Remove</button>
            </div>
        </div>

        <div class="divider"></div>

        <div class="opt-sec">
            <div class="opt-lbl">Logo Placement</div>
            <div class="place-list" id="place-list-front"></div>
            <div class="logo-offsets">
                <div class="offset-row">
                    <span class="offset-icon">&#8596;</span>
                    <span class="offset-lbl">H</span>
                    <input type="range" min="-30" max="30" value="0" id="offset-front-x"
                           oninput="onOffsetChange('front','x',this.value)">
                    <span class="offset-val" id="offset-front-x-val">0</span>
                </div>
                <div class="offset-row">
                    <span class="offset-icon">&#8597;</span>
                    <span class="offset-lbl">V</span>
                    <input type="range" min="-30" max="30" value="0" id="offset-front-y"
                           oninput="onOffsetChange('front','y',this.value)">
                    <span class="offset-val" id="offset-front-y-val">0</span>
                </div>
            </div>
        </div>

        <!-- Back logo + placement only shown for products with a back view -->
        <div id="back-logo-wrap" style="display:none;">
            <div class="divider"></div>

            <div class="opt-sec">
                <div class="opt-lbl">Back Logo</div>
                <label class="logo-drop"
                       ondragover="event.preventDefault(); this.classList.add('drag-over')"
                       ondragleave="this.classList.remove('drag-over')"
                       ondrop="event.preventDefault(); this.classList.remove('drag-over'); handleLogoFile('back', event.dataTransfer.files[0])">
                    <input type="file" id="logo-file-back" accept="image/*"
                           onchange="handleLogoFile('back', this.files[0])">
                    <span class="logo-drop-icon">&#127912;&#65039;</span>
                    <span>Click or drag &amp; drop</span>
                    <span style="font-size:10px; color:#475569;">PNG, SVG, JPG</span>
                </label>
                <div class="logo-loaded" id="logo-loaded-back">
                    <img class="logo-thumb" id="logo-thumb-back" src="" alt="">
                    <div class="logo-size-row">
                        <span>Size</span>
                        <input type="range" min="3" max="50" value="20" id="logo-size-back"
                               oninput="onLogoSize('back', this.value)">
                        <span class="logo-size-val" id="logo-size-val-back">20%</span>
                    </div>
                    <button class="logo-remove" onclick="removeLogo('back')">&#10005; Remove</button>
                </div>
            </div>

            <div class="divider"></div>

            <div class="opt-sec">
                <div class="opt-lbl">Back Logo Placement</div>
                <div class="place-list" id="place-list-back"></div>
                <div class="logo-offsets">
                    <div class="offset-row">
                        <span class="offset-icon">&#8596;</span>
                        <span class="offset-lbl">H</span>
                        <input type="range" min="-30" max="30" value="0" id="offset-back-x"
                               oninput="onOffsetChange('back','x',this.value)">
                        <span class="offset-val" id="offset-back-x-val">0</span>
                    </div>
                    <div class="offset-row">
                        <span class="offset-icon">&#8597;</span>
                        <span class="offset-lbl">V</span>
                        <input type="range" min="-30" max="30" value="0" id="offset-back-y"
                               oninput="onOffsetChange('back','y',this.value)">
                        <span class="offset-val" id="offset-back-y-val">0</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sock text only shown when socks is the active product -->
        <div id="sock-text-wrap" style="display:none;">
            <div class="divider"></div>
            <div class="opt-sec">
                <div class="opt-lbl">Sock Text</div>
                <input type="text" id="sock-text-input"
                       style="width:100%; background:#1e1e1e; border:1px solid rgba(255,255,255,0.08); border-radius:5px; color:#bbb; padding:8px 10px; font-size:12px; font-family:inherit; outline:none;"
                       placeholder="e.g. Team name, player number..."
                       oninput="onSockTextInput()">
                <div style="margin-top:9px;">
                    <div class="opt-lbl" style="margin-bottom:6px;">Text Placement</div>
                    <div class="place-list" id="sock-text-place-list"></div>
                </div>
                <div style="margin-top:9px;">
                    <div class="opt-lbl" style="margin-bottom:6px;">Text Colour</div>
                    <label style="display:flex; align-items:center; gap:10px; background:#1e1e1e; border:1px solid #475569; border-radius:8px; padding:8px 10px; cursor:pointer; width:fit-content;"
                           title="Click to open colour picker">
                        <input type="color" id="sock-text-colour-picker" value="#111111"
                               style="width:28px; height:28px; padding:0; border:none; border-radius:4px; background:none; cursor:pointer; flex-shrink:0;"
                               oninput="pickSockTextColour(this.value)">
                        <input type="text" id="sock-text-colour-hex" value="#111111" maxlength="7"
                               style="width:72px; background:transparent; border:none; color:#ddd; font-size:13px; font-family:inherit; outline:none; cursor:text;"
                               oninput="onSockTextHexInput(this.value)"
                               onclick="event.stopPropagation()">
                        <span style="color:#888; font-size:11px; white-space:nowrap;">Pick colour</span>
                    </label>
                </div>
            </div>
        </div>

        <!-- Decoration only shown for drinkware -->
        <div id="decoration-wrap" style="display:none;">
            <div class="divider"></div>
            <div class="opt-sec">
                <div class="opt-lbl">Logo Style</div>
                <div class="style-list" id="decoration-list"></div>
            </div>
        </div>

        <div class="divider"></div>

        <div class="opt-sec">
            <div class="opt-lbl">Size</div>
            <div class="size-grid" id="size-grid"></div>
        </div>

        <div class="divider"></div>

        <div class="opt-sec">
            <div class="opt-lbl">Quantity</div>
            <div class="qty-row">
                <button class="qty-btn" onclick="changeQty(-1)">&#8722;</button>
                <input  class="qty-val" id="qty" type="number" value="1" min="1" max="100000" oninput="updateSummary()">
                <button class="qty-btn" onclick="changeQty(1)">&#43;</button>
            </div>
        </div>

        <div class="divider"></div>

        <div class="opt-sec">
            <div class="opt-lbl">Notes / Special Instructions</div>
            <textarea class="notes-ta" id="notes"
                placeholder="e.g. Pantone ref, logo filename, placement dimensions, thread colour..."
                oninput="updateSummary()"></textarea>
        </div>

    </div>

    <!-- Splitter (draggable handle between sidebar and preview) -->
    <div class="splitter" id="splitter"
         role="separator"
         aria-label="Resize sidebar"
         aria-orientation="vertical"
         tabindex="0"></div>

    <!-- Preview -->
    <div class="preview">
        <div class="stage">
            <!-- Placeholder shown while no product is selected or image is loading -->
            <div id="mockup-ph" class="mockup-ph">
                <div class="ph-icon" id="ph-icon">&#128085;</div>
                <div class="ph-msg" id="ph-msg">Select a product above to load its mockup.</div>
            </div>

            <!-- Single view -->
            <div class="mockup-wrap" id="mockup-wrap" style="display:none;">
                <canvas id="mockup-canvas" class="mockup-img"></canvas>
            </div>

            <!-- Dual view: front + back side by side -->
            <div id="dual-wrap" class="dual-wrap" style="display:none;">
                <div class="view-item">
                    <canvas id="canvas-front" class="canvas-dual"></canvas>
                    <div class="view-label">Front</div>
                </div>
                <div class="view-item">
                    <canvas id="canvas-back" class="canvas-dual"></canvas>
                    <div class="view-label">Back</div>
                </div>
            </div>

            <!-- Colour badge -->
            <div class="colour-note" id="colour-note">
                <span class="colour-dot" id="colour-dot"></span>
                <span id="colour-note-text">Selected colour</span>
            </div>
        </div>

        <!-- Horizontal splitter — drag handle between canvas stage and summary bar -->
        <div class="splitter-h" id="splitter-h"
             role="separator"
             aria-label="Resize summary bar"
             aria-orientation="horizontal"
             tabindex="0"></div>

        <!-- Summary bar -->
        <div class="sum-bar">
            <div class="sum-row">
                <div class="sum-fields">
                    <div class="si"><div class="sk">Product</div><div class="sv dim" id="s-product">-</div></div>
                    <div class="si"><div class="sk">Style</div><div class="sv dim" id="s-style">-</div></div>
                    <div class="si"><div class="sk">Colour</div><div class="sv dim" id="s-colour">-</div></div>
                    <div class="si"><div class="sk">Placement</div><div class="sv dim" id="s-placement">-</div></div>
                    <div class="si"><div class="sk">Logo Style</div><div class="sv dim" id="s-decoration">-</div></div>
                    <div class="si"><div class="sk">Size</div><div class="sv dim" id="s-size">-</div></div>
                    <div class="si"><div class="sk">Qty</div><input class="s-input" id="s-qty" type="number" min="1" max="100000" step="1" value="1" oninput="onSummaryQtyInput(this.value)" onchange="onSummaryQtyCommit(this.value)"></div>
                    <div class="si"><div class="sk">Unit Price</div><div class="sv dim" id="s-unit-price">-</div></div>
                    <div class="si"><div class="sk">Line Total</div><div class="sv dim" id="s-line-total">-</div></div>
                </div>
                <div class="sum-actions">
                    <button class="btn btn-ghost" onclick="resetAll()">Reset</button>
                    <button class="btn btn-ghost" id="copy-btn" onclick="copySpec()">Copy Spec</button>
                    <button class="btn btn-ghost" onclick="addToQuote()" id="add-quote-btn">+ Add to Quote</button>
                    <button class="btn btn-ghost" id="toggle-quote-btn" onclick="toggleQuotePanel()" style="display:none;">Quote &#9650;</button>
                    <button class="btn btn-primary" onclick="printQuote()" id="print-btn">Print / Save PDF</button>
                </div>
            </div>
            <div class="sum-tip">Tip: in the browser print dialog, set Headers and Footers to "Off" to hide the URL in the corners.</div>
        </div>

        <!-- Quote panel -->
        <div class="quote-panel" id="quote-panel" style="display:none;">
            <div class="qp-header">
                <span>Quote</span>
                <span id="qp-count">0 items</span>
                <span class="qp-total-badge" id="qp-grand-total"></span>
                <button class="qp-clear" onclick="clearQuote()">Clear all</button>
            </div>
            <div class="qp-list" id="qp-list"></div>
        </div>
    </div>

</div>
</div><!-- /.mockup-shell -->

<!-- Print quote populated by JS, visible only when printing -->
<div id="print-quote"></div>

<!-- Print-only logo header and footer mark -->
<div class="print-header"><img src="/admin/logo.svg" alt="Nova Merch" /><span>NOVA MERCH</span></div>
<div class="print-footer-mark"><img src="/admin/logo.svg" alt="Nova Merch" /></div>

`;

// Resolve where the customer-site assets (PNG mockups under /mockup-builder/*)
// are served from. The admin-panel does NOT bundle these images — they live
// on the customer site. The browser must therefore load them via a fully-
// qualified URL pointing at the customer site for the active environment.
function resolveAssetBase(): string {
  if (typeof window === "undefined") return "";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:3000";
  }
  return "https://novamerchau.com";
}

export function MockupBuilderAdminClient() {
  useEffect(() => {
    // Double-load guard: page logic registers globals + window listeners on
    // first execution. Avoid duplicate registration on remount.
    if (typeof window !== "undefined" && window.__novamerchMockupAdminLoaded) {
      return;
    }

    if (typeof window !== "undefined") {
      window.__MOCKUP_ASSET_BASE = resolveAssetBase();
    }

    const pageScript = document.createElement("script");
    // basePath is "/admin" — Next serves /admin/mockup-builder-admin.js from
    // admin-panel/public/mockup-builder-admin.js.
    pageScript.src = "/admin/mockup-builder-admin.js";
    pageScript.async = false;
    pageScript.onload = () => {
      if (typeof window !== "undefined") {
        window.__novamerchMockupAdminLoaded = true;
      }
    };
    document.body.appendChild(pageScript);

    return undefined;
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: BODY_HTML }} />
    </>
  );
}
