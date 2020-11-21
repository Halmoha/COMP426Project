 // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyA7kpv-iyaIVtcmmys_eIekAvRMzM7OIkw",
    authDomain: "redredistribution.firebaseapp.com",
    databaseURL: "https://redredistribution.firebaseio.com",
    projectId: "redredistribution",
    storageBucket: "redredistribution.appspot.com",
    messagingSenderId: "5265188128",
    appId: "1:5265188128:web:26327e636df2f57e01e345",
    measurementId: "G-30Z3SHKGLM"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig); 

  let firestore = firebase.firestore();

  const docRef = firestore.doc("test/test");
  docRef.get().then(doc => {
      console.log(doc.data());
  });