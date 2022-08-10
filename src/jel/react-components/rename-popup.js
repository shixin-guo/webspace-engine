import PropTypes from "prop-types";
import React, { forwardRef, useCallback } from "react";
import { ATOM_TYPES } from "../utils/atom-metadata";
import ReactDOM from "react-dom";
import NameInputPanel from "./name-input-panel";
import { waitForDOMContentLoaded } from "../../hubs/utils/async-utils";

let popupRoot = null;
waitForDOMContentLoaded().then(() => (popupRoot = UI_ROOT.getElementById("jel-popup-root")));

const RenamePopup = forwardRef(({ styles, attributes, atomMetadata, setPopperElement, atomId }, ref) => {
  const { spaceChannel, accountChannel, dynaChannel } = window.APP;

  const popupInput = (
    <div
      tabIndex={-1} // Ensures can be focused
      className="show-when-popped"
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
    >
      <NameInputPanel
        className="slide-down-when-popped"
        atomId={atomId}
        atomMetadata={atomMetadata}
        onNameChanged={useCallback(
          name => {
            const { atomType } = atomMetadata;

            if (atomType === ATOM_TYPES.HUB) {
              spaceChannel.updateHub(atomId, { name });
            } else if (atomType === ATOM_TYPES.VOX) {
              accountChannel.updateVox(atomId, { name });
            } else if (atomType === ATOM_TYPES.SPACE) {
              dynaChannel.updateSpace(atomId, { name });
            }
          },
          [spaceChannel, accountChannel, dynaChannel, atomId, atomMetadata]
        )}
        ref={ref}
      />
    </div>
  );

  return ReactDOM.createPortal(popupInput, popupRoot);
});

RenamePopup.displayName = "RenamePopup";
RenamePopup.propTypes = {
  styles: PropTypes.object,
  attributes: PropTypes.object,
  atomMetadata: PropTypes.object,
  setPopperElement: PropTypes.func,
  atomId: PropTypes.string
};

export default RenamePopup;
