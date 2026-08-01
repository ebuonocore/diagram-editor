import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useTheme } from '../context/ThemeContext';
import type { DataType } from '../types/diagram';

interface SimpleNodeData {
  label: string;
  dataType?: DataType;
  comment?: string;
}

export const SimpleNode = memo(({ data }: { data: SimpleNodeData }) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'inherit',
        position: 'relative',
      }}
    >
      {/* Label + Type au-dessus */}
      <div
        style={{
          fontSize: '12px',
          fontWeight: 'bold',
          color: theme.nodeTextColor,
          whiteSpace: 'nowrap',
          marginBottom: '6px',
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '2px 6px',
          borderRadius: '4px',
          pointerEvents: 'none',
        }}
      >
        {data.label}
        {theme.showTypes && data.dataType && (
          <span style={{ color: theme.typeTextColor, fontWeight: 'normal', marginLeft: '4px', fontStyle: 'italic' }}>
            : {data.dataType}
          </span>
        )}
      </div>

      {/* Disque unique */}
      <div
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          backgroundColor: theme.nodeBackgroundColor || '#ffffff',
          border: `2.5px solid ${theme.nodeBorderColor || '#333333'}`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
          position: 'relative',
        }}
      >
        <Handle
          type="target"
          position={Position.Left}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
          }}
        />
        <Handle
          type="source"
          position={Position.Right}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
          }}
        />
      </div>

      {/* Commentaire au-dessous du disque */}
      {(theme.showComments ?? true) && data.comment && (
        <div
          style={{
            fontSize: '11px',
            fontStyle: 'italic',
            fontFamily: 'sans-serif',
            color: theme.commentTextColor || '#666666',
            marginTop: '4px',
            whiteSpace: 'pre-wrap', // 👈 Permet de conserver les sauts de ligne !
            wordBreak: 'break-word',
            maxWidth: '160px',     // Empêche le commentaire d'être trop large
            lineHeight: '1.3',
          }}
        >
          {data.comment}
        </div>
      )}
    </div>
  );
});