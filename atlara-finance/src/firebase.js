import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjHTZ5BJLsSqI-k1G9oK5yRVTtjwJUiHg",
  authDomain: "atlara-finance.firebaseapp.com",
  projectId: "atlara-finance",
  appId: "1:1090455273027:web:5f630c30e2c4371cf5def6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);