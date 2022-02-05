
import { getApp, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, browserLocalPersistence } from "firebase/auth";
import { collection, doc, getDoc, getFirestore, connectFirestoreEmulator, setDoc  } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEHnSf_CKhsYS7uUJB4D-extQSgijvT0o",
  authDomain: "wordle-sync.firebaseapp.com",
  projectId: "wordle-sync",
  storageBucket: "wordle-sync.appspot.com",
  messagingSenderId: "1002299152764",
  appId: "1:1002299152764:web:74d8321735098a9491acf9"
};

console.log('init firebase');
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const db = getFirestore();
// ******
//connectFirestoreEmulator(db, 'localhost', 8080); 
// ******
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let errorMessage;
    switch (request.reason) {
      case "app":
        sendResponse({content: app});
        break;
      
      case "user":
        console.log(auth.currentUser)
        sendResponse({content: auth.currentUser});
        break;

      case "get":
        if (auth.currentUser) {
          console.log("get data");
          const docRef = doc(db, "users", auth.currentUser.uid);
          getDoc(docRef)
          .then((docSnap) => {
            if (docSnap.exists()) {
              console.log("data is: " + docSnap.data().data);
              chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {"reason": "data", "data": docSnap.data().data}, function(response) {});
              });
            } else {
              chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {"reason": "data", "data": ""}, function(response) {});
              });
            }
          }) 
          } else {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.sendMessage(tabs[0].id, {"reason": "data", "data": "unauthenticated"}, function(response) {});
            });
        }

        sendResponse({value: true});
        break;

      case "set":
        if (auth.currentUser) {
          console.log(request.data);
          const docRef = doc(db, "users", auth.currentUser.uid);
          setDoc(docRef, {data: request.data});
        }

        sendMessage(true);
        break;

      case "create":
        console.log('signup');
        createUserWithEmailAndPassword(auth, request.email, request.password)
        .then(() => {
          chrome.runtime.sendMessage({reason: "useraction"});
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"reason": "reload"}, function(response) {});
          });
        })
        .catch((error) => {
          chrome.runtime.sendMessage({reason: "useraction", error: error.message});
        });
        sendResponse(true);
        break;
      
      case "signin":
        console.log('signin');
        signInWithEmailAndPassword(auth, request.email, request.password)
        .then(() => {
          chrome.runtime.sendMessage({reason: "useraction"});
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"reason": "reload"}, function(response) {});
          });
        })
        .catch((error) => {
          chrome.runtime.sendMessage({reason: "useraction", error: error.message});
        });
        
        sendResponse(true);
        break;

      case "logout":
        auth.signOut();
        chrome.runtime.sendMessage({reason: "useraction"});
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {"reason": "reload"}, function(response) {});
        });
        break;

      default:
        break;
    }
  });