// Import the functions you need from the SDKs you need
import { initializeApp, firebaseConfig } from "./initFirebase.js";

import {
  getDatabase,
  ref,
  set,
  get,
  child,
  remove,
  update,
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

let date;
let link;
let info;

const formContainer = document.getElementById("form-container");

// Add event form //////////////////////////
function addEvent() {
  const addEvent = document.createElement("h3");
  addEvent.innerHTML = "Add Event";
  formContainer.appendChild(addEvent);
  updateForm("form-container");
}
addEvent();

// insert data function
function insertData() {
  date = document.getElementById("date").value;
  info = document.getElementById("info").value;
  link = document.getElementById("link").value;
  if (date && info && link) {
    console.log('data is true')
    const eventId = Date.now();
    console.log(date, info, link);
    set(ref(db, `event/ ${eventId}`), {
      date: date,
      link: link,
      info: info,
    })
      .then(() => {
        console.log("data stored successfully");
        document.getElementById("form").reset();
        window.location.reload();
      })
  } else {
    console.log(date, info, link);
    return false;
  }
}

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
  itemInfo.innerHTML = info;
  const itemLink = document.createElement("a");
  multiAttributes(itemLink, { class: "d-block", href: link });
  itemLink.innerHTML = `facebook link`;
  // delete and update buttons
  const deleteBtn = document.createElement("button");
  multiAttributes(deleteBtn, {
    type: "button",
    class: "btn btn-outline-danger d-inline-block mt-2 me-2",
    "data-id": id,
  });
  deleteBtn.innerHTML = "delete";
  deleteBtn.onclick = function() {
    deleteEvent(id);
  };

  // UPDATE BUTTON
  const updateBtn = document.createElement("button");
  multiAttributes(updateBtn, {
    type: "button",
    class: "btn btn-outline-primary d-inline-block mt-2",
    "data-id": id,
  });
  updateBtn.innerHTML = "update";
  updateBtn.onclick = function(e) {
    e.preventDefault();
    formContainer.remove();
    updateForm(id);
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
    })
  })
}
window.onload = getAllEvents;

// fetch and review data to update
function reviewUpdate(id) {
  get(child(dbRef, `event/${id}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        date = document.getElementById("date");
        info = document.getElementById("info");
        link = document.getElementById("link");
        date.value = snapshot.val().date;
        info.value = snapshot.val().info;
        link.value = snapshot.val().link;
        const updateWarn = document.createElement("p");
        multiAttributes(updateWarn, { class: "ms-3 text-danger" });
        updateWarn.innerHTML = "review info and click submit";
        document.getElementById(id).appendChild(updateWarn);
        const dataSubmit = document.getElementById("update-btn");
        dataSubmit.onclick = () => {
          updateData(id, date.value, info.value, link.value)
        }
      } else {
        console.log("no data found");
      }
    })
}

// update form
function updateForm(id) {
  const inputs = [date, info, link];
  const labels = ["date", "info", "link"];

  const updateForm = document.getElementById(id);
  const formCardBody = document.createElement("form");
  multiAttributes(formCardBody, { id: "form", class: "card-body" });
  updateForm.appendChild(formCardBody);

  for (let i = 0; i < inputs.length; i++) {
    const floatingForm = document.createElement("form");
    floatingForm.setAttribute("class", "form-floating");
    labels[i] === "info"
      ? (inputs[i] = document.createElement("textarea"))
      : (inputs[i] = document.createElement("input"));
    multiAttributes(inputs[i], {
      id: labels[i],
      class: "form-control mb-3",
      type: "text",
      placeholder: labels[i],
    });
    inputs[i].required = true;
    const label = document.createElement("label");
    label.setAttribute("for", labels[i]);
    label.innerHTML = labels[i];
    formCardBody.appendChild(floatingForm);
    floatingForm.appendChild(inputs[i]);
    floatingForm.appendChild(label);
  }
  if (id != "form-container") {
    const submitBtn = document.createElement("button");
    multiAttributes(submitBtn, {
      id: "update-btn",
      type: "button",
      class: "btn btn-outline-danger",
      "data-id": id,
    });
    submitBtn.innerHTML = "submit";
    formCardBody.appendChild(submitBtn);
  } else {
    const insertBtn = document.createElement("button");
    multiAttributes(insertBtn, {
      class: "btn btn-primary",
      type: "button",
    });
    insertBtn.innerHTML = "insert";
    insertBtn.onclick = function(e) {
      e.preventDefault();
      insertData();
    };
    formCardBody.appendChild(insertBtn);
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
}

// cancel update
function cancelUpdate() {
  document.getElementById("form").reset();
}
// cancel.addEventListener("click", cancelUpdate);

// update data
function updateData(id, date, info, link) {
  update(ref(db, `event/${id}`), {
    date: date,
    info: info,
    link: link,
  })
    .then(() => console.log("data updated"))
}
