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
    } else {
        userID = null;
    }
}
)

// adds new song to playlist
// is the link right? do i understand how axios requests work? so many questions to ask
async function add(vidId, userID) {
    // let user = null;
    // // const data = await firestore.collection("users").where('uid', '==', `${userID}`);
    // const docRef = firestore.collection("users").get().then(function(value){
    //     value.forEach(function(doc){
    //       let strUsername = doc.data().uid;
    //       if (strUsername == userID) {
    //           user = doc;
    //       }
    //     });
    // console.log("here! " + user);

    // data.forEach(doc => {
    //     user = doc.data();
    // })

    // user.playlists.push(vidId); 

    // await firestore.doc(`users/${user.username}`).set(user);
    //   });

    let user = null;
    const data = await firestore.collection("users").where('uid', '==', `${userID}`).get();
    data.forEach(doc => {
        user = doc.data();
    })
    console.log(user);

    user.playlists.push(vidId);

    firestore.doc(`users/${user.username}`).set(user);

}

const handleAddButtonPress = function (event) {
    event.preventDefault();
    let vidId = this.id.substring(10);
    if (userID != null) {
        //POST request to playlist of current user
        add(vidId, userID).then(() => alert('This video was added to your playlist!'),
            () => alert('This video was not added to your playlist :('));
    } else {
        alert('Sign up or log in before creating your playlist!');
    }
}


$(function () {

    let api_key = "AIzaSyBbmKCsD4_f9_BDSBCCB0oFP1Lhvm_4xvo";
    let video = ''
    const $videos = $("#videos");

    videoSearch(api_key, "Music", 10);



    $("form").submit(function (event) {
        event.preventDefault();

        let searchValue = $("#search").val();
        videoSearch(api_key, searchValue, 10);
    })

    $videos.on("click", "button.add", handleAddButtonPress);


    function videoSearch(apiKey, searchTerm, maxResults) {

        $videos.empty();

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

