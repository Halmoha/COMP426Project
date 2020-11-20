$(function(){
    let api_key = "AIzaSyDrxzwKb_8gmqdWtdiW5_emiFcDYroEa34";
    let playlist = ''

    videoSearch(api_key, "Hit Songs", 10); 
   

    $("form").submit(function (event) {
        event.preventDefault();
       
        let searchValue = $("#search").val();
        videoSearch(api_key,searchValue,10);
    })


    function videoSearch(apiKey, searchTerm, maxResults) {

        $("#playlists").empty();

        $.get("https://www.googleapis.com/youtube/v3/search?key="+ apiKey 
        +"&type=playlist&part=snippet&maxResults=" + maxResults +"&q=" + searchTerm, 
        function(data){
            data.items.forEach(item => {
                playlist = `
                <iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=${item.id.playlistId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                `
                $("#playlists").append(playlist);
            })
        });
    }

});