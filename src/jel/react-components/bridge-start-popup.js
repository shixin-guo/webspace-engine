import React, { useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import sharedStyles from "../../assets/jel/stylesheets/shared.scss";
import { waitForDOMContentLoaded } from "../../hubs/utils/async-utils";
import styled from "styled-components";
import PopupPanelMenu from "./popup-panel-menu";
import SmallActionButton from "./small-action-button";
import { handleTextFieldFocus, handleTextFieldBlur } from "../../hubs/utils/focus-utils";
import { FormattedMessage } from "react-intl";
import { getMessages } from "../../hubs/utils/i18n";
import { SCHEMA } from "../../hubs/storage/store";
import { PanelWrap, Info, Tip, Label, TextInputWrap, InputWrap, Input, Checkbox } from "./form-components";

let popupRoot = null;
waitForDOMContentLoaded().then(() => (popupRoot = document.getElementById("jel-popup-root")));

const Footer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const BridgeStartPopup = ({ setPopperElement, styles, attributes, onConnect, children }) => {
  const messages = getMessages();
  const [meetingId, setMeetingId] = useState("");
  const [password, setPassword] = useState("");
  const [shareInvite, setShareInvite] = useState(true);
  const [useHD, setUseHD] = useState(false);

  const popupInput = (
    <div
      tabIndex={-1} // Ensures can be focused
      className={sharedStyles.showWhenPopped}
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
    >
      <PopupPanelMenu style={{ padding: "12px", borderRadius: "12px" }} className={sharedStyles.slideUpWhenPopped}>
        <PanelWrap>
          <Info>
            <FormattedMessage id="bridge-start.title" />
          </Info>
          <Tip>
            <FormattedMessage id="bridge-start.subtitle" />
          </Tip>
          <form
            onSubmit={async e => {
              e.preventDefault();
              e.stopPropagation();
              onConnect();
            }}
          >
            <TextInputWrap>
              <Input
                value={meetingId}
                name="meetingId"
                type="text"
                required
                pattern={"[0-9 ]+"}
                title={messages["bridge-start.meeting_id-validation-warning"]}
                placeholder={messages["bridge-start.meeting_id-placeholder"]}
                onFocus={e => handleTextFieldFocus(e.target)}
                onBlur={e => handleTextFieldBlur(e.target)}
                onChange={e => {
                  const meetingId = e.target.value;
                  setMeetingId(meetingId);
                }}
              />
            </TextInputWrap>
            <TextInputWrap>
              <Input
                type="password"
                name="password"
                value={password}
                pattern={SCHEMA.definitions.profile.properties.displayName.pattern}
                required
                placeholder={messages["bridge-start.password-placeholder"]}
                onFocus={e => handleTextFieldFocus(e.target)}
                onBlur={e => handleTextFieldBlur(e.target)}
                onChange={e => {
                  const password = e.target.value;
                  setPassword(password);
                }}
              />
            </TextInputWrap>
            <InputWrap>
              <Checkbox
                type="checkbox"
                id="share_invite"
                name="share_invite"
                checked={shareInvite}
                onChange={e => {
                  const shareInvite = e.target.checked;
                  setShareInvite(shareInvite);
                }}
              />
              <Label htmlFor="share_invite" style={{ cursor: "pointer" }}>
                <FormattedMessage id="bridge-start.share-invite" />
              </Label>
            </InputWrap>
            <InputWrap>
              <Checkbox
                type="checkbox"
                id="use_hd"
                name="use_hd"
                checked={useHD}
                onChange={e => {
                  const useHD = e.target.checked;
                  setUseHD(useHD);
                }}
              />
              <Label htmlFor="use_hd" style={{ cursor: "pointer" }}>
                <FormattedMessage id="bridge-start.use-hd" />
              </Label>
            </InputWrap>
            <Footer>
              <SmallActionButton type="submit">
                <FormattedMessage id="bridge-start.connect" />
              </SmallActionButton>
              <Tip>
                <FormattedMessage id={"bridge-start.status-connecting"} />&nbsp;
              </Tip>
            </Footer>
          </form>
        </PanelWrap>
      </PopupPanelMenu>
      {children}
    </div>
  );

  if (popupRoot) {
    return ReactDOM.createPortal(popupInput, popupRoot);
  } else {
    return popupInput;
  }
};

BridgeStartPopup.propTypes = {
  onConnect: PropTypes.func
};

export { BridgeStartPopup as default };
