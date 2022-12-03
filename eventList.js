  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-analytics.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-database.js"

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
    measurementId: "G-CTK9YBJCE4"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getDatabase(app)
  console.log("db in eventList")
  console.log(db)

  db.ref().on("child_added", function(snapshot) {
    console.log(`db.ref().on("child_added"...) fired`)
    const dbData = snapshot.val();
    dbData.id = snapshot.key;
    eventList(dbData);
    sW.taskObjArr.push(dbData);
  });

  const eventList = (data) => {
    console.log("eventList() started")
    const eventDate = $("<div>").attr({ id:data.id, class: "event-date"}).text(`${data.date}`)
    // const eventDetail = $("<div>").attr
    $(".event-listing")
  }