import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, setPersistence, browserLocalPersistence, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  projectId: "birrometro-antrodmar3",
  appId: "1:311614438746:web:112695f719bfe89bc9c763",
  storageBucket: "birrometro-antrodmar3.firebasestorage.app",
  apiKey: "AIzaSyCq6T9NKyPHq9OpgRzhhs4DRRsOPW63Lwk",
  authDomain: "birrometro-antrodmar3.firebaseapp.com",
  messagingSenderId: "311614438746"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
let currentUser = null;
let syncTimer = null;

const publicUser = (user) => user ? ({ uid:user.uid, displayName:user.displayName, email:user.email, photoURL:user.photoURL }) : null;
const userDocument = (uid) => doc(db, "users", uid);

async function syncState(state) {
  if (!currentUser || !state) return;
  await setDoc(userDocument(currentUser.uid), { drinks:state.drinks || [], imports:state.imports || {}, updatedAt:serverTimestamp() }, { merge:true });
}

window.addEventListener("birrometro-state-save", (event) => {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncState(event.detail).catch(() => window.dispatchEvent(new Event("birrometro-sync-error"))), 350);
});
window.addEventListener("birrometro-login", () => signInWithPopup(auth, provider).catch(() => window.dispatchEvent(new Event("birrometro-auth-error"))));
window.addEventListener("birrometro-logout", () => signOut(auth));

setPersistence(auth, browserLocalPersistence).then(() => onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  window.dispatchEvent(new CustomEvent("birrometro-auth", { detail:publicUser(user) }));
  if (!user) return;
  const reference = userDocument(user.uid);
  const snapshot = await getDoc(reference);
  if (snapshot.exists()) {
    window.dispatchEvent(new CustomEvent("birrometro-cloud-state", { detail:snapshot.data() }));
    return;
  }
  const local = JSON.parse(localStorage.getItem("birrometro-v1") || localStorage.getItem(["cervezo", "metro-v1"].join("")) || "{}");
  await syncState({ drinks:local.drinks || [], imports:local.imports || {} });
})).catch(() => window.dispatchEvent(new Event("birrometro-auth-error")));
