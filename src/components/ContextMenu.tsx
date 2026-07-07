import { Icon } from "@iconify/react";
import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MESSAGES } from "@/constants/messages";
import styles from "./ContextMenu.module.css";

export type ContextMenuProps = {
  position: { x: number; y: number };
  onClose: () => void;
  onRename: () => void;
  onMove?: () => void;
  onTrash: () => void;
};

const MENU_WIDTH = 140;
const MENU_ESTIMATED_HEIGHT = 160;
const MENU_MARGIN = 8;

const ContextMenu = ({
  onClose,
  onRename,
  onMove,
  onTrash,
  position,
}: ContextMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuHeight, setMenuHeight] = useState(MENU_ESTIMATED_HEIGHT);

  useLayoutEffect(() => {
    if (menuRef.current) {
      setMenuHeight(menuRef.current.offsetHeight);
    }
  }, []);

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const menuPosition = {
    left: Math.max(
      MENU_MARGIN,
      Math.min(
        position.x - MENU_WIDTH / 2,
        windowWidth - MENU_WIDTH - MENU_MARGIN,
      ),
    ),
    top: Math.max(
      MENU_MARGIN,
      Math.min(
        position.y + MENU_MARGIN,
        windowHeight - menuHeight - MENU_MARGIN,
      ),
    ),
  };

  return createPortal(
    <div className={styles.overlay} onPointerDown={onClose} role="presentation">
      <div
        ref={menuRef}
        className={styles.menu}
        style={{
          left: `${menuPosition.left}px`,
          top: `${menuPosition.top}px`,
        }}
        onPointerDown={(e) => e.stopPropagation()}
        role="menu"
        aria-label={MESSAGES.FILE_ACTIONS}
      >
        <button
          type="button"
          className={styles.button}
          onClick={onRename}
          role="menuitem"
        >
          <Icon icon="mdi:rename-outline" className={styles.icon} />
          <span>{MESSAGES.RENAME}</span>
        </button>

        {onMove && (
          <button
            type="button"
            className={styles.button}
            onClick={onMove}
            role="menuitem"
          >
            <Icon icon="mdi:folder-move-outline" className={styles.icon} />
            <span>{MESSAGES.MOVE}</span>
          </button>
        )}

        <button
          type="button"
          className={styles.button}
          onClick={onTrash}
          role="menuitem"
        >
          <Icon icon="mdi:trash-can-outline" className={styles.icon} />
          <span>{MESSAGES.DELETE}</span>
        </button>
      </div>
    </div>,
    document.body,
  );
};

export default ContextMenu;
