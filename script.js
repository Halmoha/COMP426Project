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
        <a class="navbar-item has-text-weight-bold" href=".#${userID}">Home</a>
		<a class="navbar-item has-text-weight-bold" href="popular/#${userID}">Search Playlists</a>
		<a class="navbar-item has-text-weight-bold" href="create/#${userID}">Create a Playlist</a>
		<a class="navbar-item has-text-weight-bold" href="account/#${userID}">My Account</a>
        `;
        $(".navbar-end").append(pages);


    } else {
        userID = null;
    }
}
)

$(function(){
    let api_key = "AIzaSyDrxzwKb_8gmqdWtdiW5_emiFcDYroEa34";
    let video = ''

    videoSearch(api_key, "Music", 10); 
   

    $("form").submit(function (event) {
        event.preventDefault();
       
        let searchValue = $("#search").val();
        videoSearch(api_key,searchValue,10);
    })


    function videoSearch(apiKey, searchTerm, maxResults) {

        $("#videos").empty();

        $.get("https://www.googleapis.com/youtube/v3/search?key="+ apiKey 
        +"&type=video&part=snippet&maxResults=" + maxResults +"&q=" + searchTerm, 
        function(data){
            data.items.forEach(item => {
                video = `
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${item.id.videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                `
                $("#videos").append(video);
            })
        });
    }

});