import { ReactNode, useEffect, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface SidePanelProps {
  title?: string;
  position?: "left" | "right";
  isOpen?: boolean;
  onClose?: () => void;
  children?: ReactNode;
  widthClasses?: string;
}

const SidePanel = ({
  title = "",
  position = "left",
  isOpen = false,
  onClose,
  children,
  widthClasses,
}: SidePanelProps) => {
  const [isPanelOpen, setIsPanelOpen] = useState(isOpen);

  useEffect(() => {
    setIsPanelOpen(isOpen);
  }, [isOpen]);

  const handlePanelClose = () => {
    setIsPanelOpen(false);
    onClose && onClose();
  };

  const panelPosition = position === "left" ? "left-0" : "right-0";

  return (
    <div
      className={`fixed top-0 ${panelPosition} h-full ${widthClasses} z-50 bg-white transition-transform duration-300 ease-in-out transform ${
        isPanelOpen ? "translate-x-0" : `translate-x-full ${panelPosition}`
      }`}
      style={{ willChange: "transform", zIndex: 9999 }}
    >
      <div className="flex justify-between items-center bg-primary text-white p-2">
        <div className="text-lg font-extrabold pl-2">{title}</div>
        <button
          onClick={handlePanelClose}
          className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
        >
          <XMarkIcon className="h-6 w-6 text-white" />
        </button>
      </div>
      <div className="p-4 overflow-y-auto">{children}</div>
    </div>
  );
};

export default SidePanel;
