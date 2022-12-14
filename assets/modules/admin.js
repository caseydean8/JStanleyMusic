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
// Attribute helper function
function multiAttributes(elem, attrs) {
  for (const key in attrs) {
    elem.setAttribute(key, attrs[key]);
  }
}

// Create Event Form onload
function addEvent() {
  console.log(`addEvent fired, step 1`)
  const addEventTitle = document.createElement("h3");
  addEventTitle.innerHTML = "Add Event";
  formContainer.appendChild(addEventTitle);
  updateFormCreate("form-container");
}
addEvent();

// update form
function updateFormCreate(id) {
  console.log(`upDateFormCreate fired, step 2`)
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
  // add button creator function?
  if (id != "form-container") {
    // SUBMIT UPDATE BUTTON
    buttonCreator("update-btn", "submitBtn", id, "submit", "danger", formCardBody)
  } else {
    // CREATE BUTTON
    buttonCreator("insert-btn", "insertBtn", "", "insert", "primary", formCardBody, insertData);
    // const insertBtn = document.getElementById("insert-btn");
    // insertBtn.onclick = function(e) {
    //   e.preventDefault();
    //   insertData();
    // }
  }
}


// GET EVENTS FROM DB
function getAllEvents() {
  console.log(`getAllEvents fired, step 3`)
  get(child(dbRef, "event")).then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const eventId = childSnapshot.key;
      const eventDate = childSnapshot.val().date;
      const eventInfo = childSnapshot.val().info;
      const eventLink = childSnapshot.val().link;
      eventListCreate(eventId, eventDate, eventInfo, eventLink);
    })
  })
}
window.onload = getAllEvents;


//create  event list
function eventListCreate(id, date, info, link) {
  console.log(`eventListCreate fired,step 4`)
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

  const eventList = document.getElementById("event-list");
  eventList.append(item);
  item.appendChild(cardBody);
  cardBody.appendChild(itemDate);
  cardBody.appendChild(itemInfo);
  cardBody.appendChild(itemLink);
  buttonCreator("delete-btn", "deleteBtn", id, "delete", "outline-danger d-inline-block mt-2 me-2", cardBody, "delete");
  buttonCreator("review-update-btn", "reviewUpdateBtn", id, "update", "outline-primary d-inline-block mt-2", cardBody, "review");
}


// CREATE
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

// READ
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

// UPDATE
function updateData(id, date, info, link) {
  update(ref(db, `event/${id}`), {
    date: date,
    info: info,
    link: link,
  })
    .then(() => window.location.reload())
}

// DELETE
function deleteEvent(id) {
  remove(ref(db, `event/${id}`))
    .then(() => {
      console.log("data deleted successfully");
      window.location.reload();
    })
}

// CANCEL update
function cancelUpdate() {
  document.getElementById("form").reset();
}

// BUTTON CREATOR
function buttonCreator(id, name, dataId, title, color, appendee, func) {
  name = document.createElement("button");
  multiAttributes(name, {
    id: id ? id : null,
    class: `btn btn-${color}`,
    type: "button",
    "data-id": dataId ? dataId : "none"
  });
  name.innerHTML = `${title}`;
  appendee.appendChild(name);
  if (func) {
    name.onclick = function(e) {
      e.preventDefault();
      if (func === "delete") {
        deleteEvent(dataId)
      } else if (func === "review") {
        formContainer.remove();
        updateFormCreate(dataId);
        reviewUpdate(dataId);
      } else {
        func()
      }
    }
  }
}
