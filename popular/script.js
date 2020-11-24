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

let userID = null;

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
      userID = user.uid;
      
      $(".navbar-end").empty();
      let pages = `
      <a class="navbar-item has-text-weight-bold" href="..#${userID}">Home</a>
  <a class="navbar-item has-text-weight-bold" href="../popular/#${userID}">Search Playlists</a>
  <a class="navbar-item has-text-weight-bold" href="../create/#${userID}">Create a Playlist</a>
  <a class="navbar-item has-text-weight-bold" href="../account/#${userID}">My Account</a>
      `;
      $(".navbar-end").append(pages);


  } else {
      userID = null;
  }
}
)


$(function(){
  // var firebaseConfig = {
  //   apiKey: "AIzaSyBbmKCsD4_f9_BDSBCCB0oFP1Lhvm_4xvo",
  //   authDomain: "redredistribution.firebaseapp.com",
  //   databaseURL: "https://redredistribution.firebaseio.com",
  //   projectId: "redredistribution",
  //   storageBucket: "redredistribution.appspot.com",
  //   messagingSenderId: "5265188128",
  //   appId: "1:5265188128:web:26327e636df2f57e01e345",
  //   measurementId: "G-30Z3SHKGLM"
  // };
  // // Initialize Firebase
  // firebase.initializeApp(firebaseConfig); 

  // let firestore = firebase.firestore();
  
  var usernames = [];
  const docRef = firestore.collection("users").get().then(function(value){
    value.forEach(function(doc){
      let strUsername = doc.data().username;
      usernames.push(strUsername);
    });
    var inputBox = document.getElementById('myInput');
    autocomplete(inputBox, usernames);
  });

  $("#submitButton").on('click', function(){
    let submitText = $("#myInput").val();
    submitHandler(submitText);
  })

  function submitHandler(user){
    event.preventDefault();
    let playlist = null;
    const users = firestore.collection("users").get().then(function(value){
      value.forEach(function(doc){
        let strUsername = doc.data().username;
        if (strUsername == user){
          playlist = doc.data().playlists;
        }
      })
      console.log(playlist);
      if(playlist == null){
        $("#vidDiv").empty();
        $("#vidDiv").append($("<h1>User not found</h1>"));
      }
      else{
        let api_key = "AIzaSyABYzTlftX2TFVyBwLF0C9mxJ1MmXqbqEw";
        mainVid(playlist[0], api_key).then(() => injectPlaylist(playlist,api_key));
      }
    });
  }
})

function mainVid(vidID, api){
  return new Promise((resolve, reject) =>{
    let vidDiv = $("#vidDiv");
    vidDiv.empty();
    $.get('https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=' + vidID + '&key=' + api,
      function(data){
        console.log(data);
          video = `
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${data.items[0].id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          `
          vidDiv.append(video);
      }
    ).then(() => resolve());
  })
  

    
}

function injectPlaylist(playlist,api){
  let vidDiv = $("#vidDiv");

  playlist.forEach(videoID => {
    $.get('https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=' + videoID + '&key=' + api,
    function(data){
      let title = data.items[0].snippet.title;
      let thumbnail = data.items[0].snippet.thumbnails.default.url;  
      let desc = data.items[0].snippet.description;

      let vid = `
      <div id=${data.items[0].id}>
      <img src="${thumbnail}" alt="" class="thumb">
      <h2><strong>${title}</strong></h2>
      <p>${desc}</p>
      </div>
    `;
    vidDiv.append(vid);
    });
  })
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function(e) {
                /*insert the value for the autocomplete text field:*/
                inp.value = this.getElementsByTagName("input")[0].value;
                /*close the list of autocompleted values,
                (or any other open lists of autocompleted values:*/
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      /*close all autocomplete lists in the document,
      except the one passed as an argument:*/
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }