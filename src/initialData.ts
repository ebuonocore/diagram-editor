import type { Node, Edge } from '@xyflow/react';

export const initialNodes: Node[] = [
  {
    id: "1",
    type: "functionNode",
    position: {
      x: 130.4593506653336,
      y: 90.45129866933274
    },
    data: {
      label: "liste_distances",
      comment: "Pour chaque donnée d'apprentissage calcule la distance avec la référence.\nRenvoie la liste des distances  et la classe.",
      inputs: [
        {
          id: "in_a",
          name: "référence",
          dataType: "tuple"
        },
        {
          id: "in_1785580088174",
          name: "données_apprentissage",
          dataType: "list(tuple)"
        }
      ],
      outputs: [
        {
          id: "out_res",
          name: "distances_classes",
          dataType: "list(tuple)"
        }
      ]
    }
  },
  {
    id: "node_1",
    type: "simpleNode",
    position: {
      x: 4.6011925866236965,
      y: 19.219097502014506
    },
    data: {
      label: "k",
      dataType: "int",
      comment: "Nombre de voisins"
    }
  },
  {
    id: "func_1785580147912",
    type: "functionNode",
    position: {
      x: 627.2257325282277,
      y: -1.6924543306373572
    },
    data: {
      label: "k_plus_proches",
      comment: "Pour les k plus petites distances,\nrenvoie la liste des distances et la classe correspondante.",
      inputs: [
        {
          id: "in_1785580147912",
          name: "k",
          dataType: "int"
        },
        {
          id: "in_1785580155811",
          name: "distances_classes",
          dataType: "list(tuple)"
        }
      ],
      outputs: [
        {
          id: "out_1785580147912",
          name: "kpp",
          dataType: "list(tuple)"
        }
      ]
    }
  },
  {
    id: "node_1785580203342",
    type: "simpleNode",
    position: {
      x: -4.492562449637383,
      y: 111.0710455060136
    },
    data: {
      label: "référence",
      dataType: "tuple",
      comment: "Coordonnées\nde la référence"
    }
  },
  {
    id: "node_1785580225367",
    type: "simpleNode",
    position: {
      x: -66.54992544154949,
      y: 230.1584393143718
    },
    data: {
      label: "données_apprentissage",
      dataType: "list(tuple)",
      comment: "Liste de tuples comprenant coordonnées et classe."
    }
  },
  {
    id: "func_1785580547551",
    type: "functionNode",
    position: {
      x: 998.335447219984,
      y: -1.2118049959709865
    },
    data: {
      label: "prédiction_classe",
      comment: "Vote majoritaire des kpp",
      inputs: [
        {
          id: "in_1785580547551",
          name: "kpp",
          dataType: "list(tuple)"
        }
      ],
      outputs: [
        {
          id: "out_1785580547551",
          name: "classe_prédite",
          dataType: "str"
        }
      ]
    }
  }
];

export const initialEdges: Edge[] = [
  {
    id: "xy-edge__node_1-func_1785580147912in_1785580147912",
    source: "node_1",
    target: "func_1785580147912",
    targetHandle: "in_1785580147912",
    animated: true,
    style: {
      stroke: "#555555"
    }
  },
  {
    id: "xy-edge__node_1785580203342-1in_a",
    source: "node_1785580203342",
    target: "1",
    targetHandle: "in_a",
    animated: true,
    style: {
      stroke: "#555555"
    }
  },
  {
    id: "xy-edge__node_1785580225367-1in_1785580088174",
    source: "node_1785580225367",
    target: "1",
    targetHandle: "in_1785580088174",
    animated: true,
    style: {
      stroke: "#555555"
    }
  },
  {
    id: "xy-edge__1out_res-func_1785580147912in_1785580155811",
    source: "1",
    sourceHandle: "out_res",
    target: "func_1785580147912",
    targetHandle: "in_1785580155811",
    animated: true,
    style: {
      stroke: "#555555"
    }
  },
  {
    id: "xy-edge__func_1785580147912out_1785580147912-func_1785580547551in_1785580547551",
    source: "func_1785580147912",
    sourceHandle: "out_1785580147912",
    target: "func_1785580547551",
    targetHandle: "in_1785580547551",
    animated: true,
    style: {
      stroke: "#555555"
    }
  }
];