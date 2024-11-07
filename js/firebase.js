// js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCl2iQ5sqaxsMRCTubLBHmWzFzFR18Pn0s",
  authDomain: "navepuntuacion.firebaseapp.com",
  projectId: "navepuntuacion",
  storageBucket: "navepuntuacion.firebasestorage.app",
  messagingSenderId: "454997211417",
  appId: "1:454997211417:web:058b192ea8442c1eb16d88"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportamos `db` para usarlo en otros archivos
export { db };
