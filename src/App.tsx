import React, { useState, useCallback, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react';
import type { Connection } from '@xyflow/react';
import { toPng, toSvg } from 'html-to-image';
import '@xyflow/react/dist/style.css';

import { FunctionNode } from './components/FunctionNode';
import { SimpleNode } from './components/SimpleNode';
import { ThemeModal } from './components/ThemeModal';
import { useTheme } from './context/ThemeContext';
import { initialNodes, initialEdges } from './initialData';
import type { FunctionNodeData, DataType } from './types/diagram';

// Import des images PNG
import iconTrash from './assets/delete.png';
import iconEdit from './assets/edit.png';
import iconSave from './assets/save.png';
import iconAddFunc from './assets/add_function.png';
import iconAddNode from './assets/add_simple_node.png';
import iconAutoLayout from './assets/auto_layout.png';
import iconTools from './assets/tools.png';

const nodeTypes = {
  functionNode: FunctionNode,
  simpleNode: SimpleNode,
};

function downloadImage(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.setAttribute('download', filename);
  a.setAttribute('href', dataUrl);
  a.click();
}

function FlowContent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { theme } = useTheme();
  const { fitView } = useReactFlow();

  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation des connexions
  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      let sourceType: DataType | undefined;
      let targetType: DataType | undefined;

      if (sourceNode?.type === 'simpleNode') {
        sourceType = sourceNode.data.dataType as DataType;
      } else if (sourceNode?.type === 'functionNode') {
        const funcData = sourceNode.data as FunctionNodeData;
        const output = funcData.outputs?.find((o) => o.id === params.sourceHandle);
        sourceType = output?.dataType;
      }

      if (targetNode?.type === 'simpleNode') {
        targetType = targetNode.data.dataType as DataType;
      } else if (targetNode?.type === 'functionNode') {
        const funcData = targetNode.data as FunctionNodeData;
        const input = funcData.inputs?.find((i) => i.id === params.targetHandle);
        targetType = input?.dataType;
      }

      if (sourceType && targetType && sourceType !== targetType) {
        alert(`❌ Incompatibilité de type !\nSource: ${sourceType}\nCible: ${targetType}`);
        return;
      }

      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { stroke: theme.edgeColor } }, eds)
      );
    },
    [nodes, setEdges, theme.edgeColor]
  );

  // Édition d'un nœud (Double clic)
  const onNodeDoubleClick = (_: React.MouseEvent, node: any) => {
    setEditingNode(JSON.parse(JSON.stringify(node)));
  };

  const handleSaveNodeEdit = () => {
    if (!editingNode) return;
    setNodes((nds) => nds.map((n) => (n.id === editingNode.id ? editingNode : n)));
    setEditingNode(null);
  };

  // Exportation PNG / SVG
  const handleExport = (format: 'png' | 'svg') => {
    const viewportEl = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewportEl) return;

    const nodesBounds = getNodesBounds(nodes);
    const imageWidth = nodesBounds.width + 100;
    const imageHeight = nodesBounds.height + 100;

    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      0.2
    );

    const options = {
      backgroundColor: theme.backgroundColor,
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    };

    if (format === 'png') {
      toPng(viewportEl, options).then((dataUrl) => downloadImage(dataUrl, 'diagramme.png'));
    } else {
      toSvg(viewportEl, options).then((dataUrl) => downloadImage(dataUrl, 'diagramme.svg'));
    }
  };

  // Actions Toolbar
  const handleNew = () => {
    if (confirm('Voulez-vous réinitialiser le schéma ?')) {
      setNodes([]);
      setEdges([]);
    }
  };

  const handleOpenClick = () => fileInputRef.current?.click();

  const handleOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.nodes && json.edges) {
          setNodes(json.nodes);
          setEdges(json.edges);
          setTimeout(() => fitView(), 100);
        }
      } catch (err) {
        alert('Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagramme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddFunction = () => {
    const newId = `func_${Date.now()}`;
    const newNode = {
      id: newId,
      type: 'functionNode',
      position: { x: 100, y: 100 },
      data: {
        label: 'nouvelle_fonction',
        comment: 'Commentaire optionnel',
        inputs: [{ id: `in_${Date.now()}`, name: 'arg1', dataType: 'int' as DataType }],
        outputs: [{ id: `out_${Date.now()}`, name: 'res', dataType: 'int' as DataType }],
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleAddSimpleNode = () => {
    const newId = `node_${Date.now()}`;
    const newNode = {
      id: newId,
      type: 'simpleNode',
      position: { x: 100, y: 100 },
      data: {
        label: 'variable',
        dataType: 'int' as DataType,
        comment: '',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: theme.backgroundColor,
        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background color="#aaa" gap={16} />

        {/* Barre d'outils (Panel) */}
        <Panel position="top-left" style={panelStyle}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleOpen}
            accept=".json"
            style={{ display: 'none' }}
          />

          <button onClick={handleNew} title="Nouveau" style={iconButtonStyle}>
            <img src={iconTrash} alt="Nouveau" style={iconImgStyle} />
          </button>
          <button onClick={handleOpenClick} title="Ouvrir JSON" style={iconButtonStyle}>
            <img src={iconEdit} alt="Ouvrir" style={iconImgStyle} />
          </button>
          <button onClick={handleSave} title="Sauvegarder JSON" style={iconButtonStyle}>
            <img src={iconSave} alt="Sauvegarder" style={iconImgStyle} />
          </button>

          <div style={separatorStyle} />

          <button onClick={handleAddFunction} title="Ajouter une Fonction" style={iconButtonStyle}>
            <img src={iconAddFunc} alt="Ajouter Fonction" style={iconImgStyle} />
          </button>
          <button onClick={handleAddSimpleNode} title="Ajouter Nœud Simple" style={iconButtonStyle}>
            <img src={iconAddNode} alt="Ajouter Nœud" style={iconImgStyle} />
          </button>
          <button onClick={() => fitView()} title="Recentrer le schéma" style={iconButtonStyle}>
            <img src={iconAutoLayout} alt="Recentrer" style={iconImgStyle} />
          </button>

          <div style={separatorStyle} />

          <button onClick={() => setIsThemeModalOpen(true)} title="Personnaliser les thèmes" style={iconButtonStyle}>
            <img src={iconTools} alt="Thèmes" style={iconImgStyle} />
          </button>

          <div style={separatorStyle} />

          {/* Boutons d'exportation rétablis */}
          <button onClick={() => handleExport('png')} title="Exporter en image PNG" style={textButtonStyle}>
            PNG
          </button>
          <button onClick={() => handleExport('svg')} title="Exporter en vecteur SVG" style={textButtonStyle}>
            SVG
          </button>
        </Panel>
      </ReactFlow>

      {/* Modale Thèmes */}
      <ThemeModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />

      {/* Modale d'Édition Nœud */}
      {editingNode && (
        <div style={overlayStyle}>
          <div style={editModalStyle}>
            <h3>Éditer le Nœud</h3>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Nom / Label :</label>
              <input
                type="text"
                value={editingNode.data.label || ''}
                onChange={(e) =>
                  setEditingNode({
                    ...editingNode,
                    data: { ...editingNode.data, label: e.target.value },
                  })
                }
                style={inputStyle}
              />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Commentaire (afficher sous l'élément) :</label>
              <textarea
                rows={3}
                placeholder="Description courte ou note sur plusieurs lignes..."
                value={editingNode.data.comment || ''}
                onChange={(e) =>
                  setEditingNode({
                    ...editingNode,
                    data: { ...editingNode.data, comment: e.target.value },
                  })
                }
                style={{
                  ...inputStyle,
                  resize: 'vertical', // Permet d'étirer la zone de saisie si besoin
                  fontFamily: 'sans-serif',
                }}
              />
            </div>

            {editingNode.type === 'simpleNode' && (
              <div style={formGroupStyle}>
                <label style={labelStyle}>Type de donnée :</label>
                <input
                  type="text"
                  value={editingNode.data.dataType || ''}
                  onChange={(e) =>
                    setEditingNode({
                      ...editingNode,
                      data: { ...editingNode.data, dataType: e.target.value },
                    })
                  }
                  style={inputStyle}
                />
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button onClick={() => setEditingNode(null)} style={cancelButtonStyle}>
                Annuler
              </button>
              <button onClick={handleSaveNodeEdit} style={saveButtonStyle}>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ReactFlowProvider>
        <FlowContent />
      </ReactFlowProvider>
    </ThemeProvider>
  );
}

// Styles
// Styles de la barre d'outils agrandie
const panelStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  backgroundColor: '#ffffff',
  padding: '8px 12px',
  borderRadius: '10px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.18)',
  alignItems: 'center',
  border: '1px solid #d0d0d0',
};

const iconButtonStyle: React.CSSProperties = {
  background: '#f8f9fa',
  border: '1px solid #ffffff',
  borderRadius: '8px',
  width: '29px',          // 👈 Agrandie de 32px à 42px
  height: '29px',         // 👈 Agrandie de 32px à 42px
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0',
  transition: 'background-color 0.2s',
};

const iconImgStyle: React.CSSProperties = {
  width: '25px',          // 👈 Icône agrandie de 20px à 28px
  height: '25px',         // 👈 Icône agrandie de 20px à 28px
  objectFit: 'contain',
};

const textButtonStyle: React.CSSProperties = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #cccccc',
  borderRadius: '8px',
  padding: '0 12px',
  fontSize: '13px',
  fontWeight: 'bold',
  cursor: 'pointer',
  height: '29px',         // 👈 Alignée sur la hauteur de 42px
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const separatorStyle: React.CSSProperties = {
  width: '1px',
  height: '28px',         // 👈 Séparateur réajusté à 28px
  backgroundColor: '#d0d0d0',
  margin: '0 4px',
};

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const editModalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '350px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
};

const formGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  marginBottom: '12px',
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 'bold',
  color: '#333',
};

const inputStyle: React.CSSProperties = {
  padding: '6px 8px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '13px',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#888',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const saveButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  backgroundColor: '#1890ff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};