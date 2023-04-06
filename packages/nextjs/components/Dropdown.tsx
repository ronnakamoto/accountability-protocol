import React, { useState } from "react";

interface DropdownProps {
  title: string;
  options: string[];
  onSelect: (selected: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ title, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (selectedOption: string) => {
    onSelect(selectedOption);
    setIsOpen(false);
  };

  return (
    <div className="dropdown dropdown-end">
      <label tabIndex={0} onClick={() => setIsOpen(!isOpen)} className="btn btn-primary btn-sm">
        {title}
      </label>
      {isOpen && (
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
          {options.map(option => (
            <li
              key={option}
              onClick={() => handleClick(option)}
              className="text-left w-full text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              role="menuitem"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
