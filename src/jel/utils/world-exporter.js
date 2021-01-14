import { downloadText, vecRgbToCssRgb } from "./dom-utils";
import cleaner from "clean-html";
import { FONT_FACES } from "./quill-utils";

const tmpPos = new THREE.Vector3();
const tmpQuat = new THREE.Quaternion();
const tmpScale = new THREE.Vector3();
const tmpVec4 = new THREE.Vector4();

export default class WorldExporter {
  downloadCurrentWorldHtml() {
    this.currentWorldToHtml().then(html => {
      const pathParts = document.location.pathname.split("/");
      const slugParts = pathParts[1].split("-");
      slugParts.pop();
      const filename = `${slugParts.join("-") || "world"}.html`;
      downloadText(filename, "text/html", html);
    });
  }

  async currentWorldToHtml() {
    const { hubMetadata, hubChannel } = window.APP;
    const metadata = hubMetadata.getMetadata(hubChannel.hubId);
    const doc = document.implementation.createHTMLDocument(metadata.displayName);
    doc.body.setAttribute("data-jel-format", "world");
    doc.body.setAttribute("data-jel-version", "1");

    const mediaEls = [...document.querySelectorAll("[shared]")].filter(el => el.components["media-loader"]);

    mediaEls.sort((x, y) => (x.id > y.id ? -1 : x.id < y.id ? 1 : 0));

    for (const el of mediaEls) {
      const exportEl = this.elToExportEl(doc, el);
      if (!exportEl) continue;

      doc.body.appendChild(exportEl);
    }

    return new Promise(res => {
      cleaner.clean(
        new XMLSerializer().serializeToString(doc).replaceAll("<", "\n<"),
        { "add-break-around-tags": ["embed", "img", "video", "audio"] },
        res
      );
    });
  }

  elToExportEl(doc, el) {
    const { terrainSystem } = AFRAME.scenes[0].systems["hubs-systems"];
    const { src, fileId, contentSubtype } = el.components["media-loader"].data;

    let exportEl;
    let style = "";

    if (el.components["media-image"]) {
      exportEl = doc.createElement("img");
      exportEl.setAttribute("crossorigin", "anonymous");
    }

    if (el.components["media-pdf"]) {
      const { index } = el.components["media-pdf"].data;

      exportEl = doc.createElement("embed");
      exportEl.setAttribute("type", "application/pdf");
      exportEl.setAttribute("data-index", index);
    }

    if (el.components["media-vox"]) {
      exportEl = doc.createElement("embed");
      exportEl.setAttribute("type", "model/vox-binary");
    }

    if (el.components["gltf-model-plus"]) {
      exportEl = doc.createElement("embed");
      exportEl.setAttribute("type", "model/gltf-binary");
    }

    if (el.components["media-text"]) {
      const mediaText = el.components["media-text"];
      const { fitContent, foregroundColor, backgroundColor, transparent, font } = mediaText.data;

      exportEl = doc.createElement("div");

      let fontFamily;

      style += `color: ${vecRgbToCssRgb(foregroundColor)}; `;

      if (fitContent) {
        style += `width: fit-content; height: fit-content; `;
      }

      if (transparent) {
        style += `background-color: transparent; text-stoke: 4px ${vecRgbToCssRgb(backgroundColor)}; `;
      } else {
        style += `background-color: ${vecRgbToCssRgb(backgroundColor)}; `;
      }

      switch (font) {
        case FONT_FACES.SANS_SERIF:
          fontFamily = "sans-serif";
          break;
        case FONT_FACES.SERIF:
          fontFamily = "serif";
          break;
        case FONT_FACES.MONO:
          fontFamily = "monospaced";
          break;
        case FONT_FACES.COMIC:
          fontFamily = "fantasy";
          break;
        case FONT_FACES.COMIC2:
          fontFamily = "fantasy-2";
          break;
        case FONT_FACES.WRITING:
          fontFamily = "cursive";
          break;
        case FONT_FACES.WRITING2:
          fontFamily = "cursive-2";
          break;
      }

      style += `font-family: ${fontFamily}; `;

      if (mediaText.quill) {
        const html = mediaText.quill.container.querySelector(".ql-editor").innerHTML;
        exportEl.innerHTML = html;
      }
    }

    if (el.components["media-emoji"]) {
      const { emoji } = el.components["media-emoji"].data;

      exportEl = doc.createElement("div");
      style += `font-family: emoji; `;
      exportEl.innerHTML = emoji;
    }

    if (el.components["media-video"]) {
      exportEl = doc.createElement("video");
      const { audioSrc, volume, loop, time, videoPaused } = el.components["media-video"].data;

      exportEl.setAttribute("crossorigin", "anonymous");
      exportEl.setAttribute("controls", "");

      if (videoPaused) {
        exportEl.setAttribute("currenttime", time);
      } else {
        exportEl.setAttribute("autoplay", "");
      }

      if (loop) {
        exportEl.setAttribute("loop", "");
      }

      if (volume <= 0) {
        exportEl.setAttribute("muted", "");
      }

      if (audioSrc && audioSrc !== src) {
        exportEl.setAttribute("data-audio-src", audioSrc);
      }
    }

    if (exportEl) {
      const { object3D, id } = el;

      exportEl.src = src;
      exportEl.id = id.replaceAll("naf-", "");

      if (fileId) {
        exportEl.setAttribute("data-file-id", fileId);
      }

      if (contentSubtype) {
        exportEl.setAttribute("data-content-subtype", contentSubtype);
      }

      object3D.updateMatrices();
      object3D.matrix.decompose(tmpPos, tmpQuat, tmpScale);

      // Normalize Y to be terrain-agnostic
      const height = terrainSystem.getTerrainHeightAtWorldCoord(tmpPos.x, tmpPos.z);
      const x = tmpPos.x;
      const y = tmpPos.y - height;
      const z = tmpPos.z;

      // Axis angle
      tmpVec4.setAxisAngleFromQuaternion(tmpQuat);

      style += `transform: translate3d(${x * 100}cm, ${y * 100}cm, ${z * 100}cm) rotate3d(${tmpVec4.x}, ${tmpVec4.y}, ${
        tmpVec4.z
      }, ${tmpVec4.w}rad) scale3D(${tmpScale.x}, ${tmpScale.y}, ${tmpScale.z});`;

      exportEl.setAttribute("style", style);
    }

    return exportEl;
  }
}
