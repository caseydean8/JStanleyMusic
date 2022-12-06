// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";

import {
  getDatabase,
  ref,
  onChildAdded,
  set,
  get,
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
const db = getDatabase(app);
const dbRef = ref(db);

const date = document.getElementById("date");
const link = document.getElementById("link");
const info = document.getElementById("info");

const insert = document.getElementById("insert");
const select = document.getElementById("select");
const updateBtn = document.getElementById("update");
const deleteBtn = document.getElementById("delete-btn");

// insert data function
function insertData() {
  const eventId = Date.now();
  set(ref(db, `event/ ${eventId}`), {
    date: date.value,
    link: link.value,
    info: info.value,
  })
    .then(() => console.log("data stored successfully"))
    .catch((err) => console.log(err));
}

// insert button event
insert.addEventListener("click", insertData);

//create  event list
function eventList(id, date, link, info) {
  const item = document.createElement("div");
  item.setAttribute("id", id);
  item.setAttribute("class", "card")
  const itemDate = document.createElement("h4");
  const itemLink = document.createElement("a");
  const itemInfo = document.createElement("h5");
  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "btn btn-primary");
  deleteBtn.setAttribute("data-id", id);
  deleteBtn.innerHTML = "DELETE";

  itemDate.innerHTML = date;
  itemLink.innerHTML = `facebook link ${link}`;
  itemInfo.innerHTML = info;

  const eventList = document.getElementById("event-list");
  eventList.append(item);
  item.appendChild(itemDate);
  item.appendChild(itemLink);
  item.appendChild(itemInfo);
  item.appendChild(deleteBtn);

}

// get data
function getAllEvents() {
  get(child(dbRef, "event")).then((snapshot) => {
    let events = [];
    snapshot.forEach((childSnapshot) => {
      console.log(childSnapshot.key)
      let eventId = childSnapshot.key;
      let eventDate = childSnapshot.val().date;
      let eventInfo = childSnapshot.val().info;
      let eventLink = childSnapshot.val().link;
      eventList(eventId, eventDate, eventInfo, eventLink)
      // events.push(childSnapshot.val());
    });
    // console.log(events);
  });
}
window.onload = getAllEvents;
// select data

function selectData() {
  get(child(dbRef.id))
    .then((snapshot) => {
      if (snapshot.exist()) {
        date.value = snapshot.val().date;
        link.value = snapshot.val().link;
        info.value = snapshot.val().info;
      } else {
        console.log("no data found");
      }
    })
    .catch((err) => console.log(err));
}
