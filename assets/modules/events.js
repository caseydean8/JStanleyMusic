import { initializeApp, firebaseConfig } from "./initFirebase.js";

import {
  getDatabase,
  ref,
  get,
  child,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

// multiple attributes helper function
function multiAttributes(elem, attrs) {
  for (const key in attrs) {
    elem.setAttribute(key, attrs[key]);
  }
}

//create  event list
function eventList(id, date, info, link) {
  // event card
  const item = document.createElement("div");
  multiAttributes(item, { id: id, class: "card mb-2" });
  const cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");
  const itemDate = document.createElement("h4");
  itemDate.setAttribute("class", "card-title text-primary");
  itemDate.innerHTML = date;
  const itemInfo = document.createElement("h5");
  itemInfo.setAttribute("class", "lead");
  itemInfo.innerHTML = info;
  const itemLink = document.createElement("a");
  multiAttributes(itemLink, { class: "d-block", href: link });
  itemLink.innerHTML = `facebook link`;

  const eventList = document.getElementById("event-list");
  eventList.append(item);
  item.appendChild(cardBody);
  cardBody.appendChild(itemDate);
  cardBody.appendChild(itemInfo);
  cardBody.appendChild(itemLink);
}

// get data
function getAllEvents() {
  get(child(dbRef, "event")).then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const eventId = childSnapshot.key;
      const eventDate = childSnapshot.val().date;
      const eventInfo = childSnapshot.val().info;
      const eventLink = childSnapshot.val().link;
      eventList(eventId, eventDate, eventInfo, eventLink);
    });
  });
}
window.onload = getAllEvents;
