// Pega aquí el objeto de configuración que te da Firebase al crear la app web.
// Estos valores NO son secretos: es normal que aparezcan en el código del navegador.
// La seguridad real la dan las "Firestore rules", no ocultar esto.

const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "000000000000",
  appId: "TU_APP_ID",
};

let firestoreDb = null;
try {
  firebase.initializeApp(firebaseConfig);
  firestoreDb = firebase.firestore();
} catch (e) {
  console.warn("Firebase no configurado todavía, usando solo localStorage.", e);
}
