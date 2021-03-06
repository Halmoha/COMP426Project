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

// If user is logged in, the urls in the navbar will end in their user ID
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
  console.log(userID);
}
)

$(async function () {

  // removes video from the user's playlist
  const removeButtonHandler = function (event) {
    event.preventDefault();
    let vidId = event.target.id.substring(4);
    if (userID != null) {
      //POST request to playlist of current user
      remove(vidId, userID).then(() => alert('This video was removed from your playlist!'),
        () => alert('This video was not removed your playlist :('));
    } else {
      alert('Sign up or log in before creating your playlist!');
    }
  }

  async function remove(vidId, userID) {
    let user = null;
    const data = await firestore.collection("users").where('uid', '==', `${userID}`).get();
    data.forEach(doc => {
      user = doc.data();
    })
    user.playlists.splice(user.playlists.indexOf(vidId), 1);

    firestore.doc(`users/${user.username}`).set(user);

    $('#' + vidId).empty();
  }

  // logs user out and returns them to the home page
  const logoutButtonHandler = function (event) {
    event.preventDefault();
    firebase.auth().signOut()
      .then(function () {
        alert("Logout successful!");
        window.location.href = "..";
      });
  }

  // displays each video in the user's playlist, along with a delete button
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
              <div class="control">
                <button class="button del" id="del_${data.items[0].id}">Delete</button>
              </div>
            </div>
          `;
          vidDiv.append(vid);
        });
    })
  }

  // youtube api key
  let apiKey = "AIzaSyCHxnQSu0Kk4hENt09HFgqYnLEaSV46dSc";


  // DISPLAYED ON PAGE:

  let userID = window.location.href;
  userID = userID.substring(userID.indexOf('#') + 1);
  let playlist;
  const data = await firestore.collection("users").where('uid', '==', `${userID}`).get();
  data.forEach(doc => {
    playlist = doc.data().playlists;
  });
  if (playlist.length == 0) {
    $("#topcontainer").append($('<h1>You do not have any saved videos</h1>'));
  }

  injectPlaylist(playlist, apiKey);

  let logoutButton = `<div class="control">
      <button class="button is-danger" id="logout">Logout</button>
    </div>`

  $("#backtotop").append(logoutButton)



  // button event handlers
  $(document).on('click', ".del", removeButtonHandler);
  $(document).on('click', "#logout", logoutButtonHandler);
})