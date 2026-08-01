import React, { useState, useEffect } from 'react';
import type { DataType } from '../types/diagram';

export const BASE_TYPES: DataType[] = [
  'float',
  'int',
  'str',
  'bool',
  'list',
  'tuple',
  'dict',
  'set',
  'bytes',
];

interface TypeSelectProps {
  value: DataType;
  onChange: (value: DataType) => void;
  style?: React.CSSProperties;
}

export const TypeSelect: React.FC<TypeSelectProps> = ({ value, onChange, style }) => {
  const isCustomType = !BASE_TYPES.includes(value);
  const [selectedOption, setSelectedOption] = useState<string>(isCustomType ? 'custom' : value);
  const [customValue, setCustomValue] = useState<string>(isCustomType ? value : '');

  useEffect(() => {
    if (!BASE_TYPES.includes(value)) {
      setSelectedOption('custom');
      setCustomValue(value);
    } else {
      setSelectedOption(value);
    }
  }, [value]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedOption(val);
    if (val !== 'custom') {
      onChange(val);
    } else {
      onChange(customValue || 'CustomType');
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomValue(val);
    onChange(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', ...style }}>
      <select value={selectedOption} onChange={handleSelectChange} style={selectStyle}>
        {BASE_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
        <option value="custom">Autre (Saisie libre)...</option>
      </select>

      {selectedOption === 'custom' && (
        <input
          type="text"
          placeholder="Ex: MyClass, Any..."
          value={customValue}
          onChange={handleCustomInputChange}
          style={customInputStyle}
          required
        />
      )}
    </div>
  );
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px',
  fontSize: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  backgroundColor: '#fff',
};

const customInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 6px',
  fontSize: '11px',
  border: '1px solid #1890ff',
  borderRadius: '4px',
  boxSizing: 'border-box',
};