import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import { getMessages } from "./i18n";
import "quill-emoji";
import Quill from "quill";
import { getProjectionType, PROJECTION_TYPES } from "../utils/dom-utils";

hljs.registerLanguage("javascript", javascript);

hljs.configure({
  languages: ["javascript"]
});

const isFlatProjection = () => getProjectionType() === PROJECTION_TYPES.FLAT;

export const EDITOR_WIDTH = 600;
export const EDITOR_HEIGHT = Math.floor(EDITOR_WIDTH * 0.5625);

// These aren't quite accurate but result in proper texturing
export const EDITOR_PADDING_X = 18.0;
export const EDITOR_PADDING_Y = 20.0;

// Create one quill for initial renders of text upon spawn
// Create one quill for on-screen text editor
// Create a map of network id -> quill for each 'active' text being edited for continuous rendering.
const quills = {};

export function hasQuill(networkId) {
  return !!quills[networkId];
}

export function destroyQuill(networkId) {
  const id = `#quill-${networkId}`;
  const node = DOM_ROOT.querySelector(id);

  if (node) {
    node.parentElement.removeChild(node);
  }

  if (quills[networkId]) {
    quills[networkId].quill.enable(false);
  }

  delete quills[networkId];
}

export function getQuill(networkId) {
  if (quills[networkId]) return quills[networkId].quill;

  const el = document.createElement("div");
  const id = `quill-${networkId}`;
  el.setAttribute("id", id);
  el.classList.add("quill-editor-wrap");
  el.classList.add("fast-show-when-popped");

  const container = document.createElement("div");
  container.setAttribute("id", `${id}-editor`);

  el.prepend(container);

  const toolbar = {
    container: [
      [{ header: 1 }, { header: 2 }], // custom button values
      ["bold", "italic", "underline", "strike"], // toggled buttons
      [{ indent: "-1" }, { indent: "+1" }],
      ["emoji"],
      ["code-block", "blockquote"],
      isFlatProjection() ? ["link", "image"] : ["image"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }]
    ],
    handlers: {
      emoji: function() {},
      image: function() {
        const range = this.quill.getSelection();
        const value = prompt("please copy paste the image url here.");
        if (value) {
          this.quill.insertEmbed(range.index, "image", value, Quill.sources.USER);
        }
      }
    }
  };

  DOM_ROOT.querySelector("#webspace-ui-wrap").appendChild(el);
  const messages = getMessages();

  const quill = (quills[networkId] = {
    quill: new Quill(`#${id}-editor`, {
      modules: {
        /*
         * TODO highlighting - need to inline CSS
         * syntax: { highlight: c => hljs.highlightAuto(c).value }, */
        toolbar,
        "emoji-textarea": true,
        "emoji-shortname": true
      },
      theme: "bubble",
      placeholder: messages["text-editor.placeholder"],
      container
    }),
    lastUpdated: performance.now()
  });

  // Prevent cycling via tab
  const editor = DOM_ROOT.querySelector(`#${id}-editor [contenteditable=true]`);
  editor.tabIndex = -1;

  container.__quill = quill;

  return getQuill(networkId);
}

let scratchQuill = null;

function getScratchQuill() {
  if (!scratchQuill) {
    scratchQuill = getQuill("scratch");
  }

  return scratchQuill;
}

export function htmlToDelta(html) {
  const quill = getScratchQuill();
  return quill.clipboard.convert({ html });
}
