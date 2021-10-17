import React, { useRef, useState, useCallback, forwardRef, useEffect } from "react";
import { FormattedMessage } from "react-intl";
import PropTypes from "prop-types";
import RenamePopup from "./rename-popup";
import AtomTrail from "./atom-trail";
import styled from "styled-components";
import { cancelEventIfFocusedWithin } from "../utils/dom-utils";
import HubContextMenu from "./hub-context-menu";
import dotsIcon from "../../assets/jel/images/icons/dots-horizontal-overlay-shadow.svgi";
import addIcon from "../../assets/jel/images/icons/add-shadow.svgi";
import notificationsIcon from "../../assets/jel/images/icons/notifications-shadow.svgi";
import securityIcon from "../../assets/jel/images/icons/security-shadow.svgi";
import sunIcon from "../../assets/jel/images/icons/sun-shadow.svgi";
import { useAtomBoundPopupPopper } from "../utils/popup-utils";
import { getMessages } from "../../hubs/utils/i18n";
import Tooltip from "./tooltip";
import { useInstallPWA } from "../../hubs/react-components/input/useInstallPWA";
import { ATOM_TYPES } from "../utils/atom-metadata";

const Top = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: flex-start;

  body.paused #jel-interface.hub-type-world & {
    opacity: 0.4;
  }
`;

const CornerButtonElement = styled.button`
  color: var(--canvas-overlay-text-color);
  width: content-width;
  margin: 0px 12px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 4px;
  cursor: pointer;
  pointer-events: auto;
  padding: 6px 10px;
  border: 0;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  outline-style: none;
  background-color: transparent;
  font-weight: var(--canvas-overlay-item-text-weight);
  text-align: left;
  max-width: fit-content;
  text-shadow: 0px 0px 4px;

  &:hover {
    background-color: var(--canvas-overlay-item-hover-background-color);
  }

  &:active {
    background-color: var(--canvas-overlay-item-active-background-color);
  }
`;

const CornerButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 50%;
  padding: 12px 0;

  &.opaque {
    background-color: var(--channel-header-background-color);
  }
`;

const CornerButton = styled.button`
  position: relative;
  color: var(--canvas-overlay-text-color);
  width: content-width;
  margin: 0 12px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 4px;
  cursor: pointer;
  pointer-events: auto;
  padding: 6px 10px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  outline-style: none;
  background-color: transparent;
  font-weight: var(--canvas-overlay-item-text-weight);
  text-align: left;
  max-width: fit-content;
  text-shadow: 0px 0px 4px var(--menu-shadow-color);

  &:hover {
    background-color: var(--canvas-overlay-item-hover-background-color);
  }

  &:active {
    background-color: var(--canvas-overlay-item-active-background-color);
  }

  .panels-collapsed & {
    display: none;
  }
`;

const CornerButtonIcon = styled.div`
  width: 22px;
  height: 22px;
`;

const HubContextButton = forwardRef((props, ref) => {
  return (
    <CornerButtonElement {...props} ref={ref}>
      <CornerButtonIcon dangerouslySetInnerHTML={{ __html: dotsIcon }} />
    </CornerButtonElement>
  );
});

HubContextButton.displayName = "HubContextButton";

const HubCreateButton = forwardRef((props, ref) => {
  const messages = getMessages();

  return (
    <Tooltip content={messages["create.tip"]} placement="top" key="create" delay={500}>
      <CornerButtonElement {...props} ref={ref}>
        <CornerButtonIcon dangerouslySetInnerHTML={{ __html: addIcon }} />
      </CornerButtonElement>
    </Tooltip>
  );
});

HubCreateButton.displayName = "HubCreateButton";

const EnvironmentSettingsButton = forwardRef((props, ref) => {
  const messages = getMessages();

  return (
    <Tooltip content={messages["environment-settings.tip"]} placement="top" key="environment-settings" delay={500}>
      <CornerButtonElement {...props} ref={ref}>
        <CornerButtonIcon dangerouslySetInnerHTML={{ __html: sunIcon }} />
      </CornerButtonElement>
    </Tooltip>
  );
});

EnvironmentSettingsButton.displayName = "EnvironmentSettingsButton";

const HubPermissionsButton = forwardRef((props, ref) => {
  const messages = getMessages();

  return (
    <Tooltip content={messages["hub-permissions.tip"]} placement="top" key="hub-permissions" delay={500}>
      <CornerButtonElement {...props} ref={ref}>
        <CornerButtonIcon dangerouslySetInnerHTML={{ __html: securityIcon }} />
      </CornerButtonElement>
    </Tooltip>
  );
});

HubPermissionsButton.displayName = "HubPermissionsButton";

const HubNotificationButton = forwardRef((props, ref) => {
  const messages = getMessages();

  return (
    <Tooltip content={messages["hub-notifications.tip"]} placement="top" key="hub-notifications" delay={500}>
      <CornerButtonElement {...props} ref={ref}>
        <CornerButtonIcon dangerouslySetInnerHTML={{ __html: notificationsIcon }} />
      </CornerButtonElement>
    </Tooltip>
  );
});

HubNotificationButton.displayName = "HubNotificationButton";

const CameraProjectionButton = forwardRef(() => {
  const { cameraSystem } = SYSTEMS;
  const messages = getMessages();
  const [isOrtho, setIsOrtho] = useState(cameraSystem.isRenderingOrthographic());

  useEffect(() => {
    const handler = () => {
      setIsOrtho(SYSTEMS.cameraSystem.isRenderingOrthographic());
    };

    cameraSystem.addEventListener("settings_changed", handler);
    return () => cameraSystem.removeEventListener("settings_changed", handler);
  });

  return (
    <Tooltip content={messages["camera-projection.tip"]} placement="top" key="projection" delay={500}>
      <CornerButton
        onClick={useCallback(
          () => {
            cameraSystem.toggleOrthoCamera();
            document.activeElement.blur();
          },
          [cameraSystem]
        )}
      >
        <FormattedMessage id={isOrtho ? "camera-projection.ortho" : "camera-projection.pers"} />
      </CornerButton>
    </Tooltip>
  );
});

CameraProjectionButton.displayName = "CameraProjectionButton";

const ToggleWorldButton = forwardRef(() => {
  const { cameraSystem } = SYSTEMS;
  const messages = getMessages();
  const [showWorld, setShowWorld] = useState(cameraSystem.showWorld);

  useEffect(() => {
    const handler = () => {
      setShowWorld(SYSTEMS.cameraSystem.showWorld);
    };

    cameraSystem.addEventListener("settings_changed", handler);
    () => cameraSystem.removeEventListener("settings_changed", handler);
  });

  return (
    <Tooltip content={messages["toggle-world.tip"]} placement="top" key="projection" delay={500}>
      <CornerButton
        onClick={useCallback(
          () => {
            cameraSystem.toggleShowWorldWithCursor();
            document.activeElement.blur();
          },
          [cameraSystem]
        )}
      >
        <FormattedMessage id={showWorld ? "toggle-world.hide-world" : "toggle-world.show-world"} />
      </CornerButton>
    </Tooltip>
  );
});

ToggleWorldButton.displayName = "ToggleWorldButton";

const ToggleFloorButton = forwardRef(() => {
  const { cameraSystem } = SYSTEMS;
  const messages = getMessages();
  const [showFloor, setShowFloor] = useState(cameraSystem.showFloor);

  useEffect(() => {
    const handler = () => {
      setShowFloor(SYSTEMS.cameraSystem.showFloor);
    };

    cameraSystem.addEventListener("settings_changed", handler);
    () => cameraSystem.removeEventListener("settings_changed", handler);
  });

  return (
    <Tooltip content={messages["toggle-floor.tip"]} placement="top" key="projection" delay={500}>
      <CornerButton
        onClick={useCallback(
          () => {
            cameraSystem.toggleShowFloor();
            document.activeElement.blur();
          },
          [cameraSystem]
        )}
      >
        <FormattedMessage id={showFloor ? "toggle-floor.hide-floor" : "toggle-floor.show-floor"} />
      </CornerButton>
    </Tooltip>
  );
});

ToggleFloorButton.displayName = "ToggleFloorButton";

function CanvasTop(props) {
  const {
    history,
    hubCan,
    voxCan,
    hub,
    environmentSettingsPopupElement,
    showEnvironmentSettingsPopup,
    hubPermissionsPopupElement,
    showHubPermissionsPopup,
    hubNotificationPopupElement,
    showHubNotificationPopup,
    worldTree,
    channelTree,
    showCreateSelectPopup,
    createSelectPopupElement,
    scene,
    spaceCan,
    roomForHubCan,
    memberships,
    worldTreeData,
    channelTreeData
  } = props;

  const { cameraSystem } = SYSTEMS;
  const { store, hubChannel } = window.APP;

  const {
    styles: hubContextMenuStyles,
    attributes: hubContextMenuAttributes,
    atomId: hubContextMenuHubId,
    show: showHubContextMenuPopup,
    setPopup: setHubContextMenuElement,
    popupOpenOptions: hubContextMenuOpenOptions,
    popupElement: hubContextMenuElement
  } = useAtomBoundPopupPopper();

  const atomRenameFocusRef = useRef();
  const {
    styles: atomRenamePopupStyles,
    attributes: atomRenamePopupAttributes,
    setPopup: setAtomRenamePopupElement,
    atomId: atomRenameAtomId,
    atomMetadata: atomRenameMetadata,
    show: showAtomRenamePopup,
    popupElement: atomRenamePopupElement
  } = useAtomBoundPopupPopper(atomRenameFocusRef, "bottom-start", [0, 8]);

  const [canSpawnAndMoveMedia, setCanSpawnAndMoveMedia] = useState(
    hubCan && hub && hubCan("spawn_and_move_media", hub.hub_id)
  );
  const [isInspecting, setIsInspecting] = useState(cameraSystem.isInspecting());

  const treeForCurrentHub = hub && hub.type === "world" ? worldTree : channelTree;

  const atomId = isInspecting ? cameraSystem.getInspectedAtomId() : hub && hub.hub_id;
  const atomType = isInspecting ? cameraSystem.getInspectedAtomType() : ATOM_TYPES.HUB;

  let atomTrailAtomIds = null;

  if (isInspecting && atomId) {
    atomTrailAtomIds = [atomId];
  } else if (!isInspecting) {
    atomTrailAtomIds =
      (treeForCurrentHub && hub && treeForCurrentHub.getAtomTrailForAtomId(hub.hub_id)) || (hub && [hub.hub_id]) || [];
  }

  const hubMetadata = worldTree && worldTree.atomMetadata;
  const metadata = atomType === ATOM_TYPES.VOX ? window.APP.voxMetadata : hubMetadata;
  const isWorld = hub && hub.type === "world";
  const [pwaAvailable, installPWA] = useInstallPWA();
  const environmentSettingsButtonRef = useRef();
  const hubNotificationButtonRef = useRef();
  const hubPermissionsButtonRef = useRef();
  const hubCreateButtonRef = useRef();
  const hubContextButtonRef = useRef();

  useEffect(
    () => {
      const handler = () => setIsInspecting(SYSTEMS.cameraSystem.isInspecting());
      cameraSystem.addEventListener("mode_changed", handler);
      return () => cameraSystem.removeEventListener("mode_changed", handler);
    },
    [cameraSystem]
  );

  useEffect(
    () => {
      const handler = () => setCanSpawnAndMoveMedia(hubCan && hub && hubCan("spawn_and_move_media", hub.hub_id));
      setCanSpawnAndMoveMedia(hubCan && hub && hubCan("spawn_and_move_media", hub.hub_id));
      hubChannel && hubChannel.addEventListener("permissions_updated", handler);
      return () => hubChannel && hubChannel.removeEventListener("permissions_updated", handler);
    },
    [hub, hubCan, hubChannel]
  );

  let cornerButtons;

  if (!isInspecting) {
    cornerButtons = (
      <CornerButtons className={hub && hub.type === "world" ? "" : "opaque"}>
        {pwaAvailable && (
          <CornerButton onClick={installPWA}>
            <FormattedMessage id="install.desktop" />
          </CornerButton>
        )}
        {isWorld && (
          <EnvironmentSettingsButton
            ref={environmentSettingsButtonRef}
            onMouseDown={e => cancelEventIfFocusedWithin(e, environmentSettingsPopupElement)}
            onClick={() => showEnvironmentSettingsPopup(environmentSettingsButtonRef)}
          />
        )}
        {isWorld &&
          hubCan &&
          hubCan("update_hub_roles", hub && hub.hub_id) && (
            <HubPermissionsButton
              ref={hubPermissionsButtonRef}
              onMouseDown={e => cancelEventIfFocusedWithin(e, hubPermissionsPopupElement)}
              onClick={() => showHubPermissionsPopup(hubPermissionsButtonRef)}
            />
          )}
        {isWorld && (
          <HubNotificationButton
            ref={hubNotificationButtonRef}
            onMouseDown={e => cancelEventIfFocusedWithin(e, hubNotificationPopupElement)}
            onClick={() => showHubNotificationPopup(hubNotificationButtonRef)}
          />
        )}
        {isWorld &&
          canSpawnAndMoveMedia && (
            <HubCreateButton
              ref={hubCreateButtonRef}
              onMouseDown={e => cancelEventIfFocusedWithin(e, createSelectPopupElement)}
              onClick={() => {
                store.handleActivityFlag("createMenu");
                showCreateSelectPopup(hubCreateButtonRef, "bottom-end");
              }}
            />
          )}
        <HubContextButton
          ref={hubContextButtonRef}
          onMouseDown={e => cancelEventIfFocusedWithin(e, hubContextMenuElement)}
          onClick={() => {
            showHubContextMenuPopup(hub.hub_id, hubMetadata, hubContextButtonRef, "bottom-end", [0, 8], {
              hideRename: true,
              showExport: isWorld,
              isCurrentWorld: hub.hub_id === hubChannel.hubId,
              showReset: !!hub.template.name
            });
          }}
        />
      </CornerButtons>
    );
  } else {
    cornerButtons = (
      <CornerButtons>
        {cameraSystem.allowCursor && <CameraProjectionButton />}
        {cameraSystem.allowCursor && <ToggleWorldButton />}
        {cameraSystem.allowCursor && <ToggleFloorButton />}
      </CornerButtons>
    );
  }

  return (
    <Top>
      {atomTrailAtomIds && (
        <AtomTrail
          atomIds={atomTrailAtomIds}
          history={history}
          metadata={metadata}
          can={atomType === ATOM_TYPES.VOX ? voxCan : hubCan}
          viewPermission={atomType === ATOM_TYPES.VOX ? "view_vox" : "join_hub"}
          editPermission={atomType === ATOM_TYPES.VOX ? "edit_vox" : "update_hub_meta"} // TODO bug need to check matrix room permissions
          opaque={!isWorld}
          renamePopupElement={atomRenamePopupElement}
          showRenamePopup={showAtomRenamePopup}
        />
      )}
      {cornerButtons}
      <HubContextMenu
        setPopperElement={setHubContextMenuElement}
        hideRename={!!hubContextMenuOpenOptions.hideRename}
        showExport={!!hubContextMenuOpenOptions.showExport}
        showReset={!!hubContextMenuOpenOptions.showReset}
        isCurrentWorld={!!hubContextMenuOpenOptions.isCurrentWorld}
        showAtomRenamePopup={showAtomRenamePopup}
        worldTree={worldTree}
        styles={hubContextMenuStyles}
        attributes={hubContextMenuAttributes}
        hubId={hubContextMenuHubId}
        spaceCan={spaceCan}
        hubCan={hubCan}
        roomForHubCan={roomForHubCan}
        scene={scene}
        channelTree={channelTree}
        worldTreeData={worldTreeData}
        channelTreeData={channelTreeData}
        memberships={memberships}
        hub={hub}
        history={history}
      />
      <RenamePopup
        setPopperElement={setAtomRenamePopupElement}
        styles={atomRenamePopupStyles}
        attributes={atomRenamePopupAttributes}
        atomId={atomRenameAtomId}
        atomMetadata={atomRenameMetadata}
        ref={atomRenameFocusRef}
      />
    </Top>
  );
}
CanvasTop.propTypes = {
  history: PropTypes.object,
  hub: PropTypes.object,
  hubCan: PropTypes.func,
  voxCan: PropTypes.func,
  scene: PropTypes.object,
  environmentSettingsPopupElement: PropTypes.object,
  showEnvironmentSettingsPopup: PropTypes.func,
  hubPermissionsPopupElement: PropTypes.object,
  showHubPermissionsPopup: PropTypes.func,
  hubNotificationPopupElement: PropTypes.object,
  showHubNotificationPopup: PropTypes.func,
  createSelectPopupElement: PropTypes.object,
  showCreateSelectPopup: PropTypes.func,
  worldTree: PropTypes.object,
  channelTree: PropTypes.object,
  worldTreeData: PropTypes.array,
  channelTreeData: PropTypes.array,
  spaceCan: PropTypes.func,
  memberships: PropTypes.array,
  roomForHubCan: PropTypes.func
};

export default CanvasTop;
