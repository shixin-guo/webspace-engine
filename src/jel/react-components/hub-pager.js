import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import nextPageIconSrc from "../assets/images/icons/next-page.svgi";
import prevPageIconSrc from "../assets/images/icons/prev-page.svgi";
import { getMessages } from "../../hubs/utils/i18n";

const HubPagerElement = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-start;
  width: fit-content;
  align-items: center;
  color: var(--canvas-overlay-text-color);
  font-size: var(--canvas-overlay-secondary-text-size);
  font-weight: var(--canvas-overlay-secondary-text-weight);
  display: flex;
  align-items: center;
  position: relative;
  margin: 11px 0 0 8px;
  user-select: none;
`;

const HubPagerPage = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 4px;
  cursor: pointer;
  padding: 6px 10px;
  margin: 0 6px;
  border: 0;
  flex: 3;
  font-weight: var(--canvas-overlay-secondary-text-weight);
  text-align: left;
  max-width: fit-content;
  line-height: calc(var(--canvas-overlay-text-size) + 2px);
  text-shadow: 0px 0px 4px var(--menu-shadow-color);
`;

const HubPagerPageButton = styled.button`
  pointer-events: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 4px;
  cursor: pointer;
  padding: 6px 10px;
  margin: 0 6px;
  border: 0;
  appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  outline-style: none;
  background-color: transparent;
  flex: 3;
  font-weight: var(--canvas-overlay-item-text-weight);
  text-align: left;
  max-width: fit-content;
  line-height: calc(var(--canvas-overlay-text-size) + 2px);
  text-shadow: 0px 0px 4px var(--menu-shadow-color);

  &.short {
    flex: 1;
    font-weight: var(--canvas-overlay-item-secondary-text-weight);
    font-size: var(--canvas-overlay-secondary-text-size);
    line-height: calc(var(--canvas-overlay-secondary-text-size) + 2px);
  }

  &:hover {
    background-color: var(--canvas-overlay-item-hover-background-color);
  }

  &:active {
    background-color: var(--canvas-overlay-item-active-background-color);
  }

  :disabled {
    opacity: 0.4;
    pointer-events: none;

    &:hover {
      background-color: transparent;
    }

    &:active {
      background-color: transparent;
    }
  }
`;

const HubPagerPageButtonIcon = styled.div`
  width: 12px;
  height: 12px;
`;

export default function HubPager({ page, maxPage, onPageChanged }) {
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => setCurrentPage(page), [page]);
  const messages = getMessages();

  return (
    <HubPagerElement>
      <HubPagerPageButton
        onClick={e => {
          e.preventDefault();

          const newPage = Math.max(1, currentPage - 1);

          if (currentPage !== newPage) {
            setCurrentPage(newPage);
            if (onPageChanged) onPageChanged(newPage);
          }
        }}
        disabled={currentPage === 1}
      >
        <HubPagerPageButtonIcon dangerouslySetInnerHTML={{ __html: prevPageIconSrc }} />
      </HubPagerPageButton>
      <HubPagerPage>
        <FormattedMessage id="hub-pager.page" />&nbsp;{currentPage}
      </HubPagerPage>
      <HubPagerPageButton
        onClick={e => {
          e.preventDefault();

          const newPage = Math.min(maxPage, currentPage + 1);

          if (currentPage !== newPage) {
            setCurrentPage(newPage);
            if (onPageChanged) onPageChanged(newPage);
          }
        }}
        disabled={currentPage === maxPage}
      >
        <HubPagerPageButtonIcon dangerouslySetInnerHTML={{ __html: nextPageIconSrc }} />
      </HubPagerPageButton>
    </HubPagerElement>
  );
}

HubPager.propTypes = {
  page: PropTypes.number,
  maxPage: PropTypes.number,
  onPageChanged: PropTypes.func
};
