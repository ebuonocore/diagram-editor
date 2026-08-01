import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { FunctionNodeData } from '../types/diagram';
import { useTheme } from '../context/ThemeContext';

export const FunctionNode = memo(({ data }: { data: FunctionNodeData & { comment?: string } }) => {
  const { theme } = useTheme();

  return (
    <div
      style={{
        background: theme.functionBodyBg || theme.nodeBackgroundColor,
        borderColor: theme.nodeBorderColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: '8px',
        minWidth: '180px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        color: theme.nodeTextColor,
        fontFamily: 'inherit',
        overflow: 'visible',
      }}
    >
      {/* En-tête */}
      <div
        style={{
          backgroundColor: theme.functionHeaderBg || theme.headerBackgroundColor,
          color: theme.headerTextColor,
          padding: '8px 12px',
          fontWeight: 'bold',
          fontSize: '14px',
          textAlign: 'center',
          borderTopLeftRadius: '6px',
          borderTopRightRadius: '6px',
        }}
      >
        {data.label}
      </div>

      {/* Corps E/S */}
      <div style={{ padding: '12px 10px', display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
        {/* Entrées */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
          {data.inputs?.map((input) => (
            <div
              key={input.id}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                fontSize: '12px',
                minHeight: '16px',
              }}
            >
              <Handle
                type="target"
                position={Position.Left}
                id={input.id}
                style={{
                  left: '-10px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: theme.functionPortColor || theme.edgeColor,
                  border: '1.5px solid #ffffff',
                  zIndex: 10,
                }}
              />
              <span style={{ color: theme.functionPortTextColor || theme.nodeTextColor }}>
                {input.name}
                {theme.showTypes && input.dataType && (
                  <span style={{ color: theme.typeTextColor, marginLeft: '4px', fontStyle: 'italic' }}>
                    : {input.dataType}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Sorties */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
          {data.outputs?.map((output) => (
            <div
              key={output.id}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                fontSize: '12px',
                minHeight: '16px',
              }}
            >
              <span style={{ color: theme.functionPortTextColor || theme.nodeTextColor }}>
                {output.name}
                {theme.showTypes && output.dataType && (
                  <span style={{ color: theme.typeTextColor, marginLeft: '4px', fontStyle: 'italic' }}>
                    : {output.dataType}
                  </span>
                )}
              </span>
              <Handle
                type="source"
                position={Position.Right}
                id={output.id}
                style={{
                  right: '-10px',
                  width: '10px',
                  height: '10px',
                  backgroundColor: theme.functionPortColor || theme.edgeColor,
                  border: '1.5px solid #ffffff',
                  zIndex: 10,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Zone de Commentaire (Bas de la Fonction) */}
      {(theme.showComments ?? true) && data.comment && (
        <div
          style={{
            borderTop: '1px dashed #ddd',
            padding: '4px 8px',
            fontSize: '11px',
            fontStyle: 'italic',
            fontFamily: 'sans-serif',
            color: theme.commentTextColor || '#666666',
            whiteSpace: 'pre-wrap',
            textAlign: 'center',
          }}
        >
          {data.comment}
        </div>
      )}
    </div>
  );
});