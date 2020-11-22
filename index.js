
//const firebase = require("firebase");
// Required for side-effects
//const firestore = require("firebase/firestore");
console.log("hello");
window.onload = function(){
    let db = firebase.firestore();
    const test = db.collection('test').get('test');
    console.log(test);
}
