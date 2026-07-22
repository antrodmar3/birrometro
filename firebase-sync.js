import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, setPersistence, browserLocalPersistence, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getFirestore, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, collection, arrayUnion, arrayRemove, serverTimestamp, writeBatch, onSnapshot } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

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
let cachedState = null;
let cachedGroupIds = [];
let groupOperationPending = false;
let unsubscribeDrinks = null;
let localSavePending = false;

const publicUser = (user) => user ? ({ uid:user.uid, displayName:user.displayName, email:user.email, photoURL:user.photoURL }) : null;
const userDocument = (uid) => doc(db, "users", uid);
const userDrinksCollection = (uid) => collection(db, "users", uid, "drinks");
const userDrinkDocument = (uid, drinkId) => doc(db, "users", uid, "drinks", drinkId);
const groupDocument = (groupId) => doc(db, "groups", groupId);
const groupMemberDocument = (groupId, uid) => doc(db, "groups", groupId, "members", uid);
const normalizedGroupIds = (value) => [...new Set((Array.isArray(value) ? value : []).map((item) => String(item || "").trim().toUpperCase()).filter(Boolean))];

function groupStats(state) {
  const drinks = Array.isArray(state?.drinks) ? state.drinks : [];
  const now = new Date();
  const year = drinks.filter((drink) => new Date(drink.date).getFullYear() === now.getFullYear());
  const month = year.filter((drink) => new Date(drink.date).getMonth() === now.getMonth());
  const formats = new Map();
  year.forEach((drink) => formats.set(drink.type, (formats.get(drink.type) || 0) + 1));
  const favoriteType = [...formats.entries()].sort((a,b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), "es"))[0]?.[0] || "—";
  return {
    displayName:currentUser?.displayName || currentUser?.email?.split("@")[0] || "Miembro",
    photoURL:currentUser?.photoURL || "",
    yearCount:year.length,
    monthCount:month.length,
    yearMl:year.reduce((sum, drink) => sum + Number(drink.volume || 0), 0),
    favoriteType,
    updatedAt:serverTimestamp()
  };
}

async function syncOwnGroupStats(state = cachedState) {
  if (!currentUser || !state || !cachedGroupIds.length) return;
  const stats = groupStats(state);
  await Promise.allSettled(cachedGroupIds.map((groupId) => setDoc(groupMemberDocument(groupId, currentUser.uid), {uid:currentUser.uid,...stats}, {merge:true})));
}

async function loadGroups() {
  if (!currentUser) return;
  const groups = (await Promise.all(cachedGroupIds.map(async (groupId) => {
    try {
      const groupSnapshot = await getDoc(groupDocument(groupId));
      if (!groupSnapshot.exists()) return null;
      const memberSnapshots = await getDocs(collection(db, "groups", groupId, "members"));
      return {id:groupId,...groupSnapshot.data(),members:memberSnapshots.docs.map((member) => ({id:member.id,...member.data()}))};
    } catch { return null; }
  }))).filter(Boolean);
  window.dispatchEvent(new CustomEvent("birrometro-groups", {detail:groups}));
}

function randomGroupCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = crypto.getRandomValues(new Uint8Array(8));
  return [...values].map((value) => alphabet[value % alphabet.length]).join("");
}

async function uniqueGroupCode() {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = randomGroupCode();
    if (!(await getDoc(groupDocument(code))).exists()) return code;
  }
  throw new Error("No se pudo generar un código. Inténtalo de nuevo.");
}

async function createGroup(name) {
  const cleanName = String(name || "").trim().slice(0, 40);
  if (cleanName.length < 2) throw new Error("Escribe un nombre de al menos 2 caracteres.");
  const code = await uniqueGroupCode();
  await setDoc(groupDocument(code), {name:cleanName,ownerId:currentUser.uid,memberIds:[currentUser.uid],createdAt:serverTimestamp(),updatedAt:serverTimestamp()});
  cachedGroupIds = [...cachedGroupIds,code];
  await setDoc(userDocument(currentUser.uid), {groupIds:arrayUnion(code)}, {merge:true});
  await setDoc(groupMemberDocument(code,currentUser.uid), {uid:currentUser.uid,...groupStats(cachedState)}, {merge:true});
  return `Grupo creado · código ${code}`;
}

async function joinGroup(rawCode) {
  const code = String(rawCode || "").trim().toUpperCase().replace(/[^A-Z2-9]/g, "");
  if (code.length !== 8) throw new Error("El código debe tener 8 caracteres.");
  const reference = groupDocument(code); const snapshot = await getDoc(reference);
  if (!snapshot.exists()) throw new Error("No existe ningún grupo con ese código.");
  const members = Array.isArray(snapshot.data().memberIds) ? snapshot.data().memberIds : [];
  if (!members.includes(currentUser.uid) && members.length >= 20) throw new Error("Este grupo ya ha alcanzado el límite de 20 miembros.");
  if (!members.includes(currentUser.uid)) await updateDoc(reference, {memberIds:arrayUnion(currentUser.uid),updatedAt:serverTimestamp()});
  cachedGroupIds = [...new Set([...cachedGroupIds,code])];
  await setDoc(userDocument(currentUser.uid), {groupIds:arrayUnion(code)}, {merge:true});
  await setDoc(groupMemberDocument(code,currentUser.uid), {uid:currentUser.uid,...groupStats(cachedState)}, {merge:true});
  return `Ya formas parte de ${snapshot.data().name || "este grupo"}`;
}

async function leaveGroup(groupId) {
  const code = String(groupId || "").trim().toUpperCase();
  const reference = groupDocument(code); const snapshot = await getDoc(reference);
  if (!snapshot.exists()) throw new Error("Este grupo ya no existe.");
  if (snapshot.data().ownerId === currentUser.uid) throw new Error("El creador no puede abandonar el grupo.");
  await updateDoc(reference, {memberIds:arrayRemove(currentUser.uid),updatedAt:serverTimestamp()});
  await deleteDoc(groupMemberDocument(code,currentUser.uid));
  await setDoc(userDocument(currentUser.uid), {groupIds:arrayRemove(code)}, {merge:true});
  cachedGroupIds = cachedGroupIds.filter((item) => item !== code);
  return "Has salido del grupo";
}

async function runGroupOperation(operation) {
  if (!currentUser || groupOperationPending) return;
  groupOperationPending = true;
  window.dispatchEvent(new Event("birrometro-group-pending"));
  try {
    const message = await operation();
    await loadGroups();
    window.dispatchEvent(new CustomEvent("birrometro-group-success", {detail:message}));
  } catch (error) {
    window.dispatchEvent(new CustomEvent("birrometro-group-error", {detail:error?.message || "No se pudo actualizar el grupo."}));
  } finally { groupOperationPending = false; }
}

const normalizedDrink = (drink) => JSON.parse(JSON.stringify(drink || {}));
const orderedDrinks = (drinks) => [...drinks].sort((a,b) => String(a.id).localeCompare(String(b.id)));
const drinksSignature = (drinks) => JSON.stringify(orderedDrinks(drinks).map(normalizedDrink));

async function commitDrinkOperations(operations) {
  for (let start = 0; start < operations.length; start += 400) {
    const batch = writeBatch(db);
    operations.slice(start,start + 400).forEach((operation) => {
      const reference = userDrinkDocument(currentUser.uid,operation.id);
      if (operation.kind === "delete") batch.delete(reference);
      else batch.set(reference,normalizedDrink(operation.drink));
    });
    await batch.commit();
  }
}

async function syncDrinkDocuments(previousDrinks, nextDrinks) {
  const previous = new Map((Array.isArray(previousDrinks) ? previousDrinks : []).map((drink) => [String(drink.id),drink]));
  const next = new Map((Array.isArray(nextDrinks) ? nextDrinks : []).map((drink) => [String(drink.id),drink]));
  const operations = [];
  next.forEach((drink,id) => { if (!previous.has(id) || JSON.stringify(normalizedDrink(previous.get(id))) !== JSON.stringify(normalizedDrink(drink))) operations.push({kind:"set",id,drink}); });
  previous.forEach((drink,id) => { if (!next.has(id)) operations.push({kind:"delete",id}); });
  if (operations.length) await commitDrinkOperations(operations);
}

async function loadDrinkDocuments(user, legacyState) {
  const snapshots = await getDocs(userDrinksCollection(user.uid));
  const stored = snapshots.docs.map((entry) => ({...entry.data(),id:entry.id}));
  if (stored.length || Number(legacyState?.drinksStorageVersion || 0) >= 2) return stored;
  const legacy = Array.isArray(legacyState?.drinks) ? legacyState.drinks : [];
  if (legacy.length) await commitDrinkOperations(legacy.map((drink) => ({kind:"set",id:String(drink.id),drink})));
  await setDoc(userDocument(user.uid),{drinksStorageVersion:2,updatedAt:serverTimestamp()},{merge:true});
  return legacy;
}

function watchDrinkDocuments(user) {
  if (unsubscribeDrinks) unsubscribeDrinks();
  unsubscribeDrinks = onSnapshot(userDrinksCollection(user.uid),(snapshot) => {
    if (!cachedState || localSavePending) return;
    const drinks = snapshot.docs.map((entry) => ({...entry.data(),id:entry.id}));
    if (drinksSignature(drinks) === drinksSignature(cachedState.drinks || [])) return;
    cachedState = {...cachedState,drinks};
    window.dispatchEvent(new CustomEvent("birrometro-cloud-state",{detail:cachedState}));
  },() => window.dispatchEvent(new Event("birrometro-sync-error")));
}

async function syncState(state) {
  if (!currentUser || !state) return;
  await syncDrinkDocuments(cachedState?.drinks || [],state.drinks || []);
  cachedState = state;
  await setDoc(userDocument(currentUser.uid), { drinks:state.drinks || [],drinksStorageVersion:2,historical:state.historical || [],imports:state.imports || {},album:state.album || [],driver:state.driver || {},updatedAt:serverTimestamp() }, { merge:true });
  await syncOwnGroupStats(state);
}

window.addEventListener("birrometro-state-save", (event) => {
  clearTimeout(syncTimer);
  localSavePending = true;
  syncTimer = setTimeout(() => syncState(event.detail)
    .catch(() => window.dispatchEvent(new Event("birrometro-sync-error")))
    .finally(() => { localSavePending = false; }), 350);
});
window.addEventListener("birrometro-login", () => signInWithPopup(auth, provider).catch(() => window.dispatchEvent(new Event("birrometro-auth-error"))));
window.addEventListener("birrometro-logout", () => signOut(auth));
window.addEventListener("birrometro-group-create", (event) => runGroupOperation(() => createGroup(event.detail?.name)));
window.addEventListener("birrometro-group-join", (event) => runGroupOperation(() => joinGroup(event.detail?.code)));
window.addEventListener("birrometro-group-leave", (event) => runGroupOperation(() => leaveGroup(event.detail?.groupId)));

setPersistence(auth, browserLocalPersistence).then(() => onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  cachedState = null;
  cachedGroupIds = [];
  localSavePending = false;
  if (unsubscribeDrinks) { unsubscribeDrinks(); unsubscribeDrinks = null; }
  clearTimeout(syncTimer);
  window.dispatchEvent(new CustomEvent("birrometro-auth", { detail:publicUser(user) }));
  if (!user) { window.dispatchEvent(new CustomEvent("birrometro-groups", {detail:[]})); return; }
  try {
    const reference = userDocument(user.uid);
    const snapshot = await getDoc(reference);
    if (snapshot.exists()) {
      const legacyState = snapshot.data(); const drinks = await loadDrinkDocuments(user,legacyState);
      cachedState = {...legacyState,drinks,drinksStorageVersion:2};
      cachedGroupIds = normalizedGroupIds(snapshot.data().groupIds);
      window.dispatchEvent(new CustomEvent("birrometro-cloud-state", { detail:cachedState }));
      watchDrinkDocuments(user);
      await syncOwnGroupStats(cachedState);
      await loadGroups();
      return;
    }
    const initialState = { drinks:[],drinksStorageVersion:2,historical:[],imports:{},album:[],driver:{enabled:true,weight:null,height:null},groupIds:[] };
    cachedState = initialState;
    await syncState(initialState);
    window.dispatchEvent(new CustomEvent("birrometro-cloud-state", { detail:initialState }));
    watchDrinkDocuments(user);
    window.dispatchEvent(new CustomEvent("birrometro-groups", {detail:[]}));
  } catch {
    window.dispatchEvent(new Event("birrometro-sync-error"));
  }
})).catch(() => window.dispatchEvent(new Event("birrometro-auth-error")));
