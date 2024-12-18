import { useEffect, useRef, useState } from 'react';

interface CustomSelectProps {
  label: string;
  options: string[];
  selectedOption: string;
  onChange: (value: string) => void;
}

const CustomSelect = ({
  label,
  options,
  selectedOption,
  onChange,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  const toggleSelect = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [selectedOption]);

  return (
    <div className="w-full mx-auto" ref={selectRef}>
      <label
        htmlFor="custom-select"
        className="block text-gray-700 font-semibold mb-2 text-base"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id="custom-select"
          value={selectedOption}
          onChange={handleChange}
          onClick={toggleSelect}
          className="cursor-pointer block w-full px-5 py-4 border border-gray-100 rounded-full shadow-sm focus:ring-0 appearance-none"
        >
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>

        <div
          className={`absolute top-1/2 right-4 transform -translate-y-1/2 transition-transform ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-500"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 12a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 9.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 12z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;
