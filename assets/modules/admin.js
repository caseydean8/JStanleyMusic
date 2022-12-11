// Import the functions you need from the SDKs you need
import { initializeApp, firebaseConfig } from "./initFirebase.js";

import {
  getDatabase,
  ref,
  set,
  get,
  child,
  remove,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

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

// insert data function
function insertData() {
  const eventId = Date.now();
  set(ref(db, `event/ ${eventId}`), {
    date: date.value,
    link: link.value,
    info: info.value,
  })
    .then(() => {
      console.log("data stored successfully");
      document.getElementById("form").reset();
    })
    .catch((err) => console.log(err));
}

// insert button event
insert.addEventListener("click", insertData);

// multiple attributes helper function
function multiAttributes(elem, attrs) {
  for (const key in attrs) {
    elem.setAttribute(key, attrs[key]);
  }
}

//create  event list
function eventList(id, date, link, info) {
  // event card
  const item = document.createElement("div");
  multiAttributes(item, { id: id, class: "card mb-2" });
  const cardBody = document.createElement("div");
  cardBody.setAttribute("class", "card-body");
  const itemDate = document.createElement("h4");
  itemDate.setAttribute("class", "card-title text-primary");
  itemDate.innerHTML = date;
  const itemInfo = document.createElement("h5");
  itemInfo.innerHTML = info;
  const itemLink = document.createElement("a");
  multiAttributes(itemLink, { class: "d-block", href: link });
  itemLink.innerHTML = `facebook link`;
  // delete and update buttons
  const deleteBtn = document.createElement("button");
  multiAttributes(deleteBtn, {
    class: "btn btn-outline-danger d-inline-block mt-2 me-2",
    "data-id": id,
  });
  deleteBtn.innerHTML = "delete";
  deleteBtn.onclick = function () {
    deleteEvent(id);
  };
  const updateBtn = document.createElement("button");
  multiAttributes(updateBtn, {
    class: "btn btn-outline-primary d-inline-block mt-2",
    "data-id": id,
  });
  updateBtn.innerHTML = "update";
  updateBtn.onclick = function () {
    reviewUpdate(id);
  };

  const eventList = document.getElementById("event-list");
  eventList.append(item);
  item.appendChild(cardBody);
  cardBody.appendChild(itemDate);
  cardBody.appendChild(itemInfo);
  cardBody.appendChild(itemLink);
  cardBody.appendChild(deleteBtn);
  cardBody.appendChild(updateBtn);
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

// fetch and review data to update
function reviewUpdate(id) {
  get(child(dbRef, `event/${id}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        date.value = snapshot.val().date;
        info.value = snapshot.val().info;
        link.value = snapshot.val().link;
        const updateWarn = document.createElement("p");
        updateWarn.innerHTML = "update info at form on top of page.";
        multiAttributes(updateWarn, { class: "ms-3 text-danger" });
        document.getElementById(id).appendChild(updateWarn);
        updateForm(id);
      } else {
        console.log("no data found");
      }
    })
    .catch((err) => console.log(err));
}

// update form
function updateForm(id) {
  const dateInput = document.createElement("input");
  multiAttributes(dateInput, {
    id: "upDate",
    class: "form-control mb-3",
    type: "text",
    placeholder: "date",
  });
  const dateLabel = document.createElement("label");
  dateLabel.setAttribute("for", "floatingInput");
  dateLabel.innerHTML = "date";

  const infoInput = document.createElement("textarea");
  multiAttributes(infoInput, {
    id: "upInfo",
    class: "form-control mb-3",
    type: "text",
    placeholder: "info",
  });
  const infoLabel = document.createElement("label");
  dateLabel.setAttribute("for", "floatingInput");
  infoLabel.innerHTML = "info";

  const linkInput = document.createElement("input");
  multiAttributes(linkInput, {
    id: "uplink",
    class: "form-control mb-3",
    type: "link",
    placeholder: "link",
  });
  const linkLabel = document.createElement("label");
  linkLabel.setAttribute("for", "floatingInput");
  linkLabel.innerHTML = "link";

  const updateDbBtn = document.createElement("button");
  multiAttributes(updateDbBtn, {
    class: "btn btn-outline-primary mt-2",
    "data-id": id,
  });
  updateDbBtn.innerHTML = "update";

  const inputs = [dateInput, infoInput, linkInput];
  const labels = [dateLabel, infoLabel, linkLabel];

  const updateForm = document.getElementById(id);

  for (let i = 0; i < inputs.length; i++) {
    const floatingForm = document.createElement("form");
    floatingForm.setAttribute("class", "form-floating mx-3");
    floatingForm.setAttribute("id", inputs[i]);
    updateForm.appendChild(floatingForm);
    floatingForm.appendChild(inputs[i])
    floatingForm.appendChild(labels[i])
  }
}

// delete data
function deleteEvent(id) {
  remove(ref(db, `event/${id}`))
    .then(() => {
      console.log("data deleted successfully");
      document.getElementById("form").reset();
      window.location.reload();
    })
    .catch((err) => console.log(err));
}

// cancel update
function cancelUpdate() {
  document.getElementById("form").reset();
}
cancel.addEventListener("click", cancelUpdate);
