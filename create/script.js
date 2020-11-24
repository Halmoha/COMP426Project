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
        
        // when the user is sign in, the url's will all be updated to include their userID
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


//
// event handler for adding a new song to the user's playlist
//
const handleAddButtonPress = function (event) {
    event.preventDefault();
    let vidId = this.id.substring(10);
    if (userID != null) {
        // if the user is signed in, add the song to the user's playlist
        add(vidId, userID).then(() => alert('This video was added to your playlist!'),
            () => alert('This video was not added to your playlist :('));
    } else {
        alert('Sign up or log in before creating your playlist!');
    }
}

//
// adds new song to playlist
//
async function add(vidId, userID) {
    let user = null;

    // use firestore.collection to find the user with the current userID
    const data = await firestore.collection("users").where('uid', '==', `${userID}`).get();
    data.forEach(doc => {
        user = doc.data();
    })

    // push the video ID to the user's playlist
    user.playlists.push(vidId);

    // update the user's data in firestore
    firestore.doc(`users/${user.username}`).set(user);
}

$(function () {

    // youtube API key
    let api_key = "AIzaSyAk0dzxvfOC31bFONZV50NXpjgGOTfZMZ4";
    let video = ''
    const $videos = $("#videos");

    // screen automatically shows 10 results from a "Music" search
    videoSearch(api_key, "Music", 10);



    // when the search form is submitted, 10 results from the searchValue will be shown
    $("form").submit(function (event) {
        event.preventDefault();

        let searchValue = $("#search").val();
        videoSearch(api_key, searchValue, 10);
    })

    $videos.on("click", "button.add", handleAddButtonPress);


    // returns results from a YouTube search for a certain searchTerm
    function videoSearch(apiKey, searchTerm, maxResults) {

        $videos.empty();

        // use YouTube API to search videos from the database and display them
        $.get("https://www.googleapis.com/youtube/v3/search?key=" + apiKey
            + "&type=video&part=snippet&maxResults=" + maxResults + "&q=" + searchTerm,
            function (data) {
                data.items.forEach(item => {
                    video = `
                        <div class="addVideo">
                            <iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                            <br>

				            <div class="control">
                                <button class="button add" id="addbutton-${item.id.videoId}">Add to my playlist</button>
                            </div>
                        </div>
                    `
                    $videos.append(video);
                })
            });
    }

});

