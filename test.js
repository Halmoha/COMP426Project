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

  const docRef = firestore.collection("users").get().then(function(value){
    value.forEach(function(doc){
      console.log(doc.id, " => ", doc.data().playlists);
    });
  });
  console.log("loaded");
  console.log(docRef);
  for(var i = 0; i < docRef.length; i++){
    console.log(user.data());
  }
  //docRef.get().then(doc => {
   //   console.log(doc);
  //});

