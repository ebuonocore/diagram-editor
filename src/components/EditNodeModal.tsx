import React, { useState, useEffect } from 'react';
import type { FunctionNodeData, Port, DataType } from '../types/diagram';
import { TypeSelect } from './TypeSelect';

interface EditNodeModalProps {
  isOpen: boolean;
  initialData: FunctionNodeData;
  onSave: (data: FunctionNodeData) => void;
  onClose: () => void;
}

export const EditNodeModal: React.FC<EditNodeModalProps> = ({
  isOpen,
  initialData,
  onSave,
  onClose,
}) => {
  if (!isOpen) return null;

  const [label, setLabel] = useState(initialData.label);
  const [inputs, setInputs] = useState<Port[]>(initialData.inputs || []);
  const [outputs, setOutputs] = useState<Port[]>(initialData.outputs || []);

  useEffect(() => {
    setLabel(initialData.label);
    setInputs(initialData.inputs || []);
    setOutputs(initialData.outputs || []);
  }, [initialData]);

  // Entrées
  const handleInputChange = (index: number, field: 'name' | 'dataType', value: string) => {
    const updated = [...inputs];
    updated[index] = { ...updated[index], [field]: value as DataType };
    setInputs(updated);
  };

  const handleAddInput = () => {
    const newPort: Port = {
      id: `in_${Date.now()}`,
      name: `entree_${inputs.length + 1}`,
      dataType: 'float',
    };
    setInputs([...inputs, newPort]);
  };

  const handleRemoveInput = (index: number) => {
    setInputs(inputs.filter((_, i) => i !== index));
  };

  // Sorties
  const handleOutputChange = (index: number, field: 'name' | 'dataType', value: string) => {
    const updated = [...outputs];
    updated[index] = { ...updated[index], [field]: value as DataType };
    setOutputs(updated);
  };

  const handleAddOutput = () => {
    const newPort: Port = {
      id: `out_${Date.now()}`,
      name: `sortie_${outputs.length + 1}`,
      dataType: 'float',
    };
    setOutputs([...outputs, newPort]);
  };

  const handleRemoveOutput = (index: number) => {
    setOutputs(outputs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...initialData,
      label,
      inputs,
      outputs,
    });
    onClose();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
          Édition de la Fonction
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Nom de la fonction :</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              style={inputStyle}
              required
            />
          </div>

          {/* Section Entrées */}
          <div>
            <div style={sectionHeaderStyle}>
              <span style={labelStyle}>Entrées ({inputs.length})</span>
              <button type="button" onClick={handleAddInput} style={addButtonStyle}>
                + Ajouter
              </button>
            </div>
            <div style={listContainerStyle}>
              {inputs.map((port, idx) => (
                <div key={port.id} style={rowStyle}>
                  <input
                    type="text"
                    value={port.name}
                    onChange={(e) => handleInputChange(idx, 'name', e.target.value)}
                    placeholder="Nom du port"
                    style={{ ...inputStyle, flex: 1 }}
                    required
                  />
                  <TypeSelect
                    value={port.dataType}
                    onChange={(newType) => handleInputChange(idx, 'dataType', newType)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInput(idx)}
                    style={deleteButtonStyle}
                    title="Supprimer la port"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section Sorties */}
          <div>
            <div style={sectionHeaderStyle}>
              <span style={labelStyle}>Sorties ({outputs.length})</span>
              <button type="button" onClick={handleAddOutput} style={addButtonStyle}>
                + Ajouter
              </button>
            </div>
            <div style={listContainerStyle}>
              {outputs.map((port, idx) => (
                <div key={port.id} style={rowStyle}>
                  <input
                    type="text"
                    value={port.name}
                    onChange={(e) => handleOutputChange(idx, 'name', e.target.value)}
                    placeholder="Nom du port"
                    style={{ ...inputStyle, flex: 1 }}
                    required
                  />
                  <TypeSelect
                    value={port.dataType}
                    onChange={(newType) => handleOutputChange(idx, 'dataType', newType)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOutput(idx)}
                    style={deleteButtonStyle}
                    title="Supprimer la port"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
            <button type="button" onClick={onClose} style={cancelButtonStyle}>
              Annuler
            </button>
            <button type="submit" style={saveButtonStyle}>
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles Modale
const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '450px',
  maxHeight: '85vh',
  overflowY: 'auto',
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#333',
};

const inputStyle: React.CSSProperties = {
  padding: '6px',
  fontSize: '12px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  boxSizing: 'border-box',
};

const sectionHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
};

const listContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  maxHeight: '160px',
  overflowY: 'auto',
  paddingRight: '4px',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  alignItems: 'flex-start',
};

const addButtonStyle: React.CSSProperties = {
  fontSize: '11px',
  padding: '2px 8px',
  backgroundColor: '#e6f7ff',
  color: '#1890ff',
  border: '1px solid #91d5ff',
  borderRadius: '4px',
  cursor: 'pointer',
};

const deleteButtonStyle: React.CSSProperties = {
  padding: '4px 8px',
  backgroundColor: '#ff4d4f',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#ccc',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
};

const saveButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#1890ff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px',
};