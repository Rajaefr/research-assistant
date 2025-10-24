

# 🧠 Research Assistant – Chrome Extension + Spring Boot API

Ce projet est un **assistant de recherche intelligent** combinant :
- une **extension Chrome** pour interagir avec le texte sélectionné sur une page web,
- un **backend Spring Boot** qui communique avec le modèle **Gemini AI** pour résumer ou suggérer du contenu pertinent.

---

## 🚀 Fonctionnalités principales

### 🧩 Côté Extension Chrome
- **Sélection de texte** sur n’importe quelle page web.
- **Deux actions principales :**
  - 🔹 **Summarize** → Résume le texte sélectionné.
  - 🔹 **Suggest** → Suggère des sujets ou lectures connexes.
- **Bloc-notes intégré** pour sauvegarder des notes localement.
- Interface simple et responsive intégrée dans un panneau latéral.

### ⚙️ Côté Backend (Spring Boot)
- Expose une API REST (`/api/research/process`) qui :
  - reçoit le texte et l’opération demandée (`summarize` ou `suggest`),
  - interroge le modèle **Gemini** via son API,
  - renvoie la réponse traitée à l’extension.
- Gère automatiquement les erreurs et formate les résultats.

---

## 🧱 Structure du projet

### 🌐 Extension Chrome
```

research-assistant-extension/
│
├── sidepanel.html      # Interface utilisateur
├── sidepanel.css       # Style du panneau latéral
├── sidepanel.js        # Logique côté client
└── manifest.json       # Fichier de configuration Chrome

```

### 💡 Backend Spring Boot
```

research-assistant-backend/
│
├── src/main/java/com/research/assistant/
│   ├── ResearchService.java        # Service de traitement des requêtes
│   ├── GeminiResponse.java         # Modèle de réponse JSON du modèle Gemini
│   ├── ResearchRequest.java        # Requête envoyée depuis l’extension
│   ├── ResearchController.java     # Point d’entrée de l’API REST
│   └── ...
└── src/main/resources/
└── application.properties      # Configuration du projet

````

---

## ⚙️ Installation et Exécution

### 🖥️ 1. Cloner le projet
```bash
git clone https://github.com/<TON_USERNAME>/research-assistant.git
cd research-assistant
````

---

### 🧠 2. Configuration du Backend

#### 🔑 Ajouter les variables dans `application.properties` :

```properties
server.port=8080

# Gemini API Configuration
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
gemini.api.key=${GEMINI_KEY}
```

> 💡 Remplace `${GEMINI_KEY}` par ta clé d’API **Google Gemini** ou définis-la dans ton environnement :
>
> ```bash
> export GEMINI_KEY=ta_cle_api
> ```

#### ▶️ Démarrer le serveur :

```bash
mvn spring-boot:run
```

Le backend sera disponible sur :
👉 [http://localhost:8080](http://localhost:8080)

---

### 🌐 3. Configuration de l’Extension Chrome

1. Ouvre **Google Chrome** → `chrome://extensions/`
2. Active **Mode développeur**
3. Clique sur **Charger l’extension non empaquetée**
4. Sélectionne le dossier `research-assistant-extension/`
5. L’icône *Research Assistant* apparaîtra dans la barre d’outils.

---

## 🧩 Exemple d’utilisation

1. Ouvre une page web contenant un article ou du texte.
2. Sélectionne un paragraphe.
3. Clique sur :

   * **Summarize** → pour un résumé clair et concis.
   * **Suggest** → pour obtenir des suggestions de lecture ou de recherche.
4. Les résultats apparaissent directement dans le panneau latéral.

---

## 🧠 Exemple de réponse Gemini

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          { "text": "Summary: The text explains the importance of AI in modern research..." }
        ]
      }
    }
  ]
}
```

---

## 🧩 Technologies utilisées

| Côté           | Technologie           | Rôle                                 |
| -------------- | --------------------- | ------------------------------------ |
| 🌐 Frontend    | HTML, CSS, JavaScript | Interface utilisateur de l’extension |
| 🔧 Backend     | Spring Boot (Java)    | API REST pour traiter les requêtes   |
| 🤖 AI          | Google Gemini API     | Génération de texte intelligent      |
| ⚙️ Persistance | Chrome Storage API    | Sauvegarde locale des notes          |

---

## 🧪 Exemple de requête API

### Requête

```bash
POST http://localhost:8080/api/research/process
Content-Type: application/json

{
  "content": "Artificial intelligence is transforming scientific discovery.",
  "operation": "summarize"
}
```

### Réponse

```json
{
  "result": "AI accelerates research by automating data analysis and discovering patterns."
}
```


## 👩‍💻 Auteur

**Rajaa Farid Elidrissi**

## 🪪 Licence

Ce projet est sous licence **MIT**.
Tu es libre de le modifier et de le redistribuer avec mention de l’auteur original.

---

