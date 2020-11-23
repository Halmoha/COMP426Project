var firebaseConfig = {
    apiKey: "AIzaSyABYzTlftX2TFVyBwLF0C9mxJ1MmXqbqEw",
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

$(async function(){

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
        user.playlists.splice(user.playlists.indexOf(vidId),1);
    
        firestore.doc(`users/${user.username}`).set(user);

        $('#' + vidId).empty();
    }

    function mainVid(vidID, api){
        return new Promise((resolve, reject) =>{
          let vidDiv = $("#vidDiv");
          vidDiv.empty();
          $.get('https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=' + vidID + '&key=' + api,
            function(data){
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
            <button type="submit" class="del" id="del_${data.items[0].id}">Delete</button>
            </div>
          `;
          vidDiv.append(vid);
          });
        })
      }



    let userID = window.location.href;
    userID = userID.substring(userID.indexOf('#') + 1);
    let playlist;
    const data = await firestore.collection("users").where('uid', '==', `${userID}`).get();
    data.forEach(doc => {
        playlist = doc.data().playlists;
    });
    if(playlist.length == 0){
        $("#topcontainer").append($('<h1>You do not have any saved videos</h1>'));
    }
    mainVid(playlist[0], firebaseConfig.apiKey).then(()=> injectPlaylist(playlist, firebaseConfig.apiKey));

    $(document).on('click', ".del", removeButtonHandler);
})