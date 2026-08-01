import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import type { DiagramTheme } from '../types/theme';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose }) => {
  const { theme, updateTheme, resetTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Exporter le thème actuel en fichier JSON
  const handleExportTheme = () => {
    const dataStr = JSON.stringify(theme, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `theme-${theme.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Importer un fichier JSON de thème
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedTheme = JSON.parse(event.target?.result as string) as Partial<DiagramTheme>;
        updateTheme(importedTheme);
      } catch (err) {
        alert('❌ Fichier de thème JSON invalide.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Réinitialise l'input file
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', fontFamily: 'sans-serif' }}>
          Personnalisation du Thème
        </h3>

        {/* Input file caché pour l'import */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImportTheme}
          accept=".json"
          style={{ display: 'none' }}
        />

        {/* Boutons d'import / export de thème */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <button onClick={handleExportTheme} style={actionButtonStyle}>
            💾 Sauvegarder (JSON)
          </button>
          <button onClick={handleImportClick} style={actionButtonStyle}>
            📂 Importer (JSON)
          </button>
        </div>

        <div style={scrollContainerStyle}>
          {/* Options Type et Commentaires */}
          <div style={rowStyle}>
            <label htmlFor="showTypes" style={{ fontWeight: 'bold', cursor: 'pointer' }}>
              Afficher les types de données :
            </label>
            <input
              id="showTypes"
              type="checkbox"
              checked={theme.showTypes}
              onChange={(e) => updateTheme({ showTypes: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          <div style={rowStyle}>
            <label htmlFor="showComments" style={{ fontWeight: 'bold', cursor: 'pointer' }}>
              Afficher les commentaires :
            </label>
            <input
              id="showComments"
              type="checkbox"
              checked={theme.showComments ?? true}
              onChange={(e) => updateTheme({ showComments: e.target.checked })}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '4px 0' }} />

          {/* Palette de Couleurs */}
          <div style={rowStyle}>
            <span>Fond du canevas :</span>
            <input
              type="color"
              value={theme.backgroundColor}
              onChange={(e) => updateTheme({ backgroundColor: e.target.value })}
            />
          </div>

          <div style={rowStyle}>
            <span>Couleur des liaisons :</span>
            <input
              type="color"
              value={theme.edgeColor}
              onChange={(e) => updateTheme({ edgeColor: e.target.value })}
            />
          </div>

          <div style={rowStyle}>
            <span>Fond des nœuds simples :</span>
            <input
              type="color"
              value={theme.nodeBackgroundColor}
              onChange={(e) => updateTheme({ nodeBackgroundColor: e.target.value })}
            />
          </div>

          <div style={rowStyle}>
            <span>Bordure des nœuds :</span>
            <input
              type="color"
              value={theme.nodeBorderColor}
              onChange={(e) => updateTheme({ nodeBorderColor: e.target.value })}
            />
          </div>

          <div style={rowStyle}>
            <span>En-tête des fonctions :</span>
            <input
              type="color"
              value={theme.functionHeaderBg}
              onChange={(e) => updateTheme({ functionHeaderBg: e.target.value })}
            />
          </div>

          <div style={rowStyle}>
            <span>Corps des fonctions :</span>
            <input
              type="color"
              value={theme.functionBodyBg}
              onChange={(e) => updateTheme({ functionBodyBg: e.target.value })}
            />
          </div>

          <div style={rowStyle}>
            <span>Ports d'E/S des fonctions :</span>
            <input
              type="color"
              value={theme.functionPortColor}
              onChange={(e) => updateTheme({ functionPortColor: e.target.value })}
            />
          </div>

          <div style={rowStyle}>
            <span>Texte des types :</span>
            <input
              type="color"
              value={theme.typeTextColor}
              onChange={(e) => updateTheme({ typeTextColor: e.target.value })}
            />
          </div>

          <div style={rowStyle}>
            <span>Texte des commentaires :</span>
            <input
              type="color"
              value={theme.commentTextColor ?? '#666666'}
              onChange={(e) => updateTheme({ commentTextColor: e.target.value })}
            />
          </div>
        </div>

        {/* Boutons de pieds de modale */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button onClick={resetTheme} style={resetButtonStyle}>
            Réinitialiser
          </button>
          <button onClick={onClose} style={closeButtonStyle}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// Styles
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
  width: '380px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  boxSizing: 'border-box',
};

const scrollContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  maxHeight: '55vh',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingRight: '6px',
  fontFamily: 'sans-serif',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '13px',
};

const actionButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '6px 10px',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontFamily: 'sans-serif',
};

const resetButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#ff4d4f',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: 'sans-serif',
};

const closeButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#1890ff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontFamily: 'sans-serif',
};