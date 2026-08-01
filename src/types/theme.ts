export interface DiagramTheme {
  name: string;
  backgroundColor: string;
  edgeColor: string;

  // Nœuds & Fonctions
  nodeBackgroundColor: string;
  nodeColor: string;
  nodeBorderColor: string;
  nodeTextColor: string;

  headerBackgroundColor: string;
  headerTextColor: string;
  functionHeaderBg: string;
  functionBodyBg: string;

  functionPortColor: string;
  functionPortTextColor: string;

  // Types de données
  showTypes: boolean;
  typeTextColor: string;

  // NOUVEAU : Commentaires
  showComments: boolean;
  commentTextColor: string;
}

export const defaultTheme: DiagramTheme = {
  name: 'Défaut (Clair)',
  backgroundColor: '#ffffff',
  edgeColor: '#555555',

  nodeBackgroundColor: '#ffffff',
  nodeColor: '#2c3e50',
  nodeBorderColor: '#cccccc',
  nodeTextColor: '#333333',

  headerBackgroundColor: '#2c3e50',
  headerTextColor: '#ffffff',
  functionHeaderBg: '#2c3e50',
  functionBodyBg: '#ffffff',

  functionPortColor: '#2c3e50',
  functionPortTextColor: '#333333',

  showTypes: true,
  typeTextColor: '#888888',

  showComments: true,
  commentTextColor: '#666666',
};