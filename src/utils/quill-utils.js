import { fromByteArray } from "base64-js";
import Color from "color";
import { EDITOR_WIDTH, EDITOR_HEIGHT } from "./quill-pool";
import { detect } from "detect-browser";
const browser = detect();
import nextTick from "./next-tick";
import {
  ComicFontCSS,
  SerifFontCSS,
  SansSerifFontCSS,
  MonoFontCSS,
  ComicFont2CSS,
  WritingFontCSS
} from "../fonts/quill-fonts";
import { preflightUrl } from "./media-utils";

import QUILL_PRE from "../assets/stylesheets/quill-pre.scss";
import QUILL_CORE from "!!raw-loader!quill/dist/quill.core.css";
import QUILL_BUBBLE from "!!raw-loader!quill/dist/quill.bubble.css";
import QUILL_EMOJI from "!!raw-loader!quill-emoji/dist/quill-emoji.css";
import QUILL_HIGHLIGHT from "!!raw-loader!highlight.js/scss/github.scss";

const htmlImageUrlToDataUrlCache = new Map();

export const QUILL_STYLES = `
  ${QUILL_PRE}
  ${QUILL_CORE}
  ${QUILL_BUBBLE}
  ${QUILL_EMOJI}
  ${QUILL_HIGHLIGHT}
`.replace(/\/\*[^]*?\*\//g, ""); // Strip comments, o/w rendering fails due to spec perhaps

export const FONT_FACES = {
  SANS_SERIF: 0,
  SERIF: 1,
  MONO: 2,
  COMIC: 3,
  COMIC2: 4,
  WRITING: 5
};

export const MAX_FONT_FACE = 6;

const { SANS_SERIF, MONO, COMIC, COMIC2, WRITING } = FONT_FACES;

export async function renderQuillToImg(
  quill,
  img,
  foregroundColor,
  backgroundColor,
  zoom = 1.0,
  textureWidth = 1024,
  transparent = false,
  font = SANS_SERIF
) {
  while (quill._isRendering) await nextTick();

  quill._isRendering = true;

  try {
    const el = quill.container;
    const editor = quill.container.querySelector(".ql-editor");

    if (transparent) {
      // Copy contents into attributes to perform outlining trick for transparent renders.
      const contentEls = editor.querySelectorAll("p, h1, h2, li");

      for (const contentEl of contentEls) {
        contentEl.setAttribute("data-contents", contentEl.innerText);
      }
    }

    if (foregroundColor) {
      try {
        Color(foregroundColor);
      } catch (e) {
        console.warn("Invalid foreground color for rendering ", foregroundColor);
        foregroundColor = "black";
      }
    } else {
      foregroundColor = "black";
    }

    if (backgroundColor) {
      try {
        Color(backgroundColor);
      } catch (e) {
        console.warn("Invalid background color for rendering ", backgroundColor);
        backgroundColor = "white";
      }
    } else {
      backgroundColor = "white";
    }

    const editorXml = new XMLSerializer().serializeToString(editor);

    let xml = `
    <div xmlns="http://www.w3.org/1999/xhtml" class="ql-container ql-bubble">
    <style xmlns="http://www.w3.org/1999/xhtml">
      ${QUILL_STYLES}
    </style>
    ${editorXml}
    </div>
  `;

    const ratio = el.offsetHeight / el.offsetWidth;
    const scale = (textureWidth * Math.min(1.0, 1.0 / ratio)) / el.offsetWidth;

    const transparentStyles = transparent
      ? `
    .ql-emojiblot {
      vertical-align: inherit !important;
      margin: inherit !important;
    }

    .ap {
      font-size: inherit !important;
      margin: inherit !important;
    }

    h1 .ap {
      font-size: inherit !important;
      margin: inherit !important;
    }

    h2 .ap {
      font-size: inherit !important;
      margin: inherit !important;
    }

    :root {
      background-color: transparent !important;
    }

    .ql-editor p:before,h1:before,h2:before{
      content: attr(data-contents);
      position: absolute;
      width: calc(100% - 40px);
      -webkit-text-stroke: 4px;
      -webkit-text-stroke-color: ${backgroundColor};
      z-index: -2;
    }

    .ql-editor p:after,h1:after,h2:after{
      content: attr(data-contents);
      position: absolute;
      color: transparent;
      width: calc(100% - 40px);
      -webkit-text-stroke: 1px black;
      z-index: -1;
      left: 20px;
      top: 16px;
    }

    .ql-blank::before {
      display: flex !important;
      color: #eee !important;
      background-color: rgba(64, 64, 64, 0.2);
    }
  `
      : "";

    // NOTE - We have to inject the current font as a data URL otherwise the browser can sometimes
    // render the wrong font or mis-render it. (Perhaps a browser bug.)
    let fontCSS;

    switch (font) {
      case SANS_SERIF:
        fontCSS = SansSerifFontCSS;
        break;
      case MONO:
        fontCSS = MonoFontCSS;
        break;
      case COMIC:
        fontCSS = ComicFontCSS;
        break;
      case COMIC2:
        fontCSS = ComicFont2CSS;
        break;
      case WRITING:
        fontCSS = WritingFontCSS;
        break;
      default:
        fontCSS = SerifFontCSS;
        break;
    }

    // Disable other bits only relevant to on-screen UI
    // NOTE - not sure why global h1, h2 bits needed here, but otherwise font is always bold in headers.
    xml = xml.replace(
      "</style>",
      `

    ${fontCSS}

    :root {
      background-color: ${backgroundColor} !important;
    }

    .ql-container {
      border-radius: 0 !important;
    }

    .ql-editor {
      position: absolute;
      top: -${editor.scrollTop}px;
      overflow: visible !important;
      color: ${foregroundColor} !important;
      width: ${EDITOR_WIDTH}px !important;
      height: ${EDITOR_HEIGHT}px !important;
      min-width: ${EDITOR_WIDTH}px !important;
      min-height: ${EDITOR_HEIGHT}px !important;
      transform-origin: top left;
      transform: scale(${zoom * scale});
    }

    .ql-blank::before {
      display: flex !important;
      color: ${foregroundColor} !important;
    }

    h1, h2 {
      font-weight: inherit !important;
    }

    ${transparentStyles}
  </style>`
    );

    // Find all the src attributes in the xml and replace their value with data urls
    const srcRegex = /src="(http[^"]+)"/g;
    let match;

    while ((match = srcRegex.exec(xml))) {
      const src = match[1];

      const dataUrl = htmlImageUrlToDataUrlCache.get(src);

      if (dataUrl) {
        xml = xml.replaceAll(src, dataUrl);
      } else {
        let parsedUrl = null;
        try {
          parsedUrl = new URL(src);
        } catch (e) {
          break; // Kind of hacky, but if we have a bad URL just bail so loop end
        }

        const preflightResponse = await preflightUrl(parsedUrl);
        const accessibleContentUrl = preflightResponse.accessibleContentUrl;

        // Fetch the accessible content URL into a data url
        const response = await fetch(accessibleContentUrl);

        // Create base64 encoded data url
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);

        const dataUrl = await new Promise(resolve => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
        });

        htmlImageUrlToDataUrlCache.set(src, dataUrl);
        xml = xml.replaceAll(src, dataUrl);
      }
    }

    // Hide the tooltip for the editor in the rendering
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${el.offsetWidth * scale}px" height="${el.offsetHeight * scale}px">
        <foreignObject width="100%" height="100%">
          ${xml}
        </foreignObject>
      </svg>
    `;

    const b64 = fromByteArray(new TextEncoder().encode(svg));
    img.src = `data:image/svg+xml;base64,${b64}`;
  } finally {
    quill._isRendering = false;
  }
}

export const isInQuillEditor = () => !!DOM_ROOT.activeElement?.classList.contains("ql-editor");

export function computeQuillContentRect(quill) {
  const els = quill.container.querySelector(".ql-editor").children;
  let w = 0,
    h = 0;

  for (let i = 0; i < els.length; i++) {
    const el = els[i];
    w = Math.max(w, el.offsetLeft + el.clientWidth);
    h = Math.max(h, el.offsetTop + el.clientHeight);
  }

  return [w, h];
}

export function deltaEndsWith(delta, text) {
  let endText = "";
  for (let i = delta.ops.length - 1; i >= 0 && endText.length < text.length; --i) {
    const op = delta.ops[i];
    if (typeof op.insert !== "string") break;
    endText = op.insert + endText;
  }
  return endText.slice(-1 * text.length) === text;
}

// HACK for safari - this captures the mousedown event when we are in the quill editor, because this causes the element to blur, causing it to disappear.
if (browser.name === "safari") {
  window.addEventListener("mousedown", e => {
    if (!isInQuillEditor()) return;

    const activeElement = DOM_ROOT.activeElement;

    if (activeElement) {
      // Check if the event happened within the client rect of the active element
      const rect = activeElement.getBoundingClientRect();
      const x = e.clientX;
      const y = e.clientY;

      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        setTimeout(() => activeElement.focus());
      }
    }
  });
}
