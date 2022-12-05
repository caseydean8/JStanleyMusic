// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  child,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCdlQ3E4jj7X4nxK9nVEwsaZS4dHzZmTI0",
  authDomain: "jstanleymusic-37bec.firebaseapp.com",
  databaseURL: "https://jstanleymusic-37bec-default-rtdb.firebaseio.com",
  projectId: "jstanleymusic-37bec",
  storageBucket: "jstanleymusic-37bec.appspot.com",
  messagingSenderId: "376619570226",
  appId: "1:376619570226:web:f108a90173e8ff76b9982b",
  measurementId: "G-CTK9YBJCE4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

const date = document.getElementById("date");
const link = document.getElementById("link");
const info = document.getElementById("info");

const insert = document.getElementById("insert");
const select = document.getElementById("select");
const updateBtn = document.getElementById("update");
const deleteBtn = document.getElementById("delete-btn");

// insert data function
function insertData() {
  set(ref(db, "event added"), {
    date: date.value,
    link: link.value,
    info: info.value,
  })
    .then(() => console.log("data stored successfully"))
    .catch((err) => console.log(err));
}

// insert button event
insert.addEventListener("click", insertData);
