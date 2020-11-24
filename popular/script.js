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
        injectPlaylist(playlist,api_key);
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

function injectPlaylist(playlist, api) {
  let vidDiv = $("#vidDiv");

  playlist.forEach(videoID => {
    $.get('https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=' + videoID + '&key=' + api,
      function (data) {
        let title = data.items[0].snippet.title;
        let desc = data.items[0].snippet.description;

        let vid = `
          <div class="video" id=${data.items[0].id}>
          <div class="iframe">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${data.items[0].id}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          </div>
          <h2><strong>${title}</strong></h2>
          <p class="description">${desc}</p>
          </div>
        `;
        vidDiv.append(vid);
      });
  })
}

function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);

        for (i = 0; i < arr.length; i++) {
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            b = document.createElement("DIV");
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function(e) {
                inp.value = this.getElementsByTagName("input")[0].value;
                closeAllLists();
            });
            a.appendChild(b);
          }
        }
    });
    
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) { //down
          currentFocus++;
          addActive(x);
        } else if (e.keyCode == 38) { //up
          currentFocus--;
          addActive(x);
        } else if (e.keyCode == 13) { //enter
          e.preventDefault();
          if (currentFocus > -1) {
            if (x) x[currentFocus].click();
          }
        }
    });
    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
  }