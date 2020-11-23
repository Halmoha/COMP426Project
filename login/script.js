let firebaseConfig = {
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

let userID;

async function register(username, email, password) {
   const result = await axios({
    method: 'post',
    url: 'https://us-central1-redredistribution.cloudfunctions.net/api/signup',
    data : {
        "username": username,
        "password": password,
        "email": email
    }
   });
   return result;
};

async function login(email, password){
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(async (user) => {
        alert("Logged in");
        const data = await firestore.collection("users").where('email', '==', `${email}`).get();
        data.forEach(doc => {
            userID = doc.data().uid;
        })
        window.location.href = '../account#' + userID;
      // Signed in 
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(errorMessage);
    });

}

$(function() {
     // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    

    $(document).on('click','#register', function (event){
        event.preventDefault();
        try {
            const username = $("#usernameR").val();
            const password = $("#passwordR").val();
            const email = $("#emailR").val();
            register(username, email, password);
            alert("Registration Successful. Login above.");
        } catch(err){
            console.log(err);
            alert(err.error.email);
        }
    })


    $(document).on('click','#login', function (event){
        event.preventDefault();
        try {
            const email = $("#email").val();
            const password = $("#password").val();
            login(email, password);
        } catch(err){
            alert(err.error.email);
        }
    })
})