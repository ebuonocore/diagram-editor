# 🧩 Éditeur de Diagrammes de Fonctions

> **Accéder à l'application en ligne :**  
> 🔗 [https://ebuonocore.github.io/diagram-editor/](https://ebuonocore.github.io/diagram-editor/)

---

## 🎯 Objectif du Projet

Cet outil interactif est conçu pour concevoir et visualiser des **diagrammes de flux de données et de fonctions**. Il permet de :

* **Visualiser l'imbrication d'appels de fonctions** au sein d'un programme.
* **Synthétiser les structures de données (types)** échangées entre les éléments.
* **Documenter les spécifications** (entrées, sorties, commentaires explicatifs) sur un support visuel et pédagogique clair.
<img width="1348" height="375" alt="exemple_kpp" src="https://github.com/user-attachments/assets/324c214c-1988-4949-9c14-7d9eab20a4f1" />

---

## 🕹️ Fonctionnalités & Interactions

### 🛠️ Barre d'Outils (Panneau de Contrôle)
<img width="547" height="66" alt="menu" src="https://github.com/user-attachments/assets/5e3c7e81-e041-45bd-8ac2-c11527bc6e0e" />

* **📄 Nouveau / Ouvrir / Sauvegarder :** Réinitialisez le canevas ou gérez vos schémas au format JSON.
* **➕ Ajouter des Éléments :**
  * **Fonction :** Pour représenter un bloc de traitement avec ses arguments et valeurs de retour.
  * **Nœud Simple :** Pour représenter une variable, constante ou donnée d'entrée.
* **🎯 Recentrer le Schéma :** Réajuste automatiquement la vue sur l'ensemble du diagramme.
* **🎨 Personnalisation du Thème :**
  * Ajustement des couleurs (fond, liens, en-têtes, corps des nœuds).
  * Masquage/Affichage des types et des commentaires.
  * **Import / Export JSON** des configurations de thèmes.
* **🖼️ Exportation Image :** Téléchargez votre diagramme en haute résolution au format **PNG** ou **SVG**.

---

### 🖱️ Interactions à la Souris

| Action | Description |
| :--- | :--- |
| **Glisser-Déposer (Drag & Drop)** | Déplacez les nœuds librement sur le canevas. |
| **Création de Liens** | Glissez un fil depuis un port de sortie vers un port d'entrée.|
| **Sélection & Suppression** | Cliquez sur un nœud ou un lien, puis appuyez sur la touche `Suppr` (ou `Backspace`) pour le supprimer. |
| **Zoom & Navigation** | Utilisez la molette de la souris pour zoomer/dézoomer et le clic-glissé sur le fond pour vous déplacer. |
| **Double-clic** | Ouvre la fenêtre d'édition complète :|
  ||**Nœuds simples :** Modification du nom, type de donnée et commentaire multiligne.|
  ||**Fonctions :** Modification du nom, commentaire multiligne, ainsi qu'ajout/suppression/édition dynamique des **entrées** et **sorties**. |


---

## 🛠️ Stack Technique

* **Framework :** React + TypeScript
* **Moteur de Graph :** React Flow (`@xyflow/react`)
* **Build Tool :** Vite
* **Rendu Image :** `html-to-image`
