import React, { useState, ChangeEvent } from 'react';
import { Option } from '../types/dataTypes';

interface AutoCompleteProps {
  options: Option[];
  onSelect: (option: Option) => void;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({ options, onSelect }) => {
  const [query, setQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    if (value) {
      const filtered = options.filter(option =>
        option.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
      setShowDropdown(true);
    } else {
      setFilteredOptions([]);
      setShowDropdown(false);
    }
  };

  const handleSelect = (option: Option) => {
    setQuery(option.name);
    setFilteredOptions([]);
    setShowDropdown(false);
    onSelect(option); // Call the callback with the selected option
  };

  const handleClickOutside = (event: Event) => {
    if (event instanceof MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown')) {
        setShowDropdown(false);
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className="border rounded p-2 w-full"
        placeholder="Enter area..."
      />
      {showDropdown && filteredOptions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded mt-1 w-full max-h-60 overflow-y-auto dropdown">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSelect(option)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoComplete;
