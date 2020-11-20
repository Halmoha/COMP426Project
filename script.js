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