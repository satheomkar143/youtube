
// --------------youtube api--------

// var apiKey = "AIzaSyBW14OVGNMXXNRyMCjFbiGKj4VQnzrDAGU"; 
var apiKey = "AIzaSyCbxiDiAbxTmkQSFMC0cYNY4XzNdcjvuBI";


var channelId = "UCyoV63plRyybMKKyna1BVHQ";
const VIDEO_HTTP = "https://www.googleapis.com/youtube/v3/videos";
const CHANNEL_HTTP = "https://www.googleapis.com/youtube/v3/channels";
const SEARCH_HTTP = "https://www.googleapis.com/youtube/v3/search";

$(document).ready(function () {
  $.get(
    VIDEO_HTTP,
    {
      part: "snippet",
      key: apiKey,
      chart: "mostPopular",
      maxResults: 48,
      regionCode: "IN",
    },

    function (data) {
      $.each(data.items, function (i, item) {
        console.log(item);
        getChannelIcon(item);
      });
    }
  );

  function getChannelIcon(video_data , type) {

    var vid_container = $(".video_container");
    vid_container.empty();
    
    $.get(
      CHANNEL_HTTP,
      {
        part: "snippet",
        key: apiKey,
        id: video_data.snippet.channelId,
      },

      function (data) {
        // console.log(data);
        video_data.channelThumbnail =
          data.items[0].snippet.thumbnails.default.url;
        console.log(video_data);
        makeVideoCard(video_data, type);
      }
    );
  }

  function makeVideoCard(item, type) {
    
    var vid_title = item.snippet.title;
    var vid_thumb = item.snippet.thumbnails.medium.url;

    if(type == "search"){
      var vid_id = item.id.videoId;
    }else{
      var vid_id = item.id;
    }

    var vid_container = $(".video_container");
    console.log(vid_id);
    var videoEle = `
    <a href="#top">
											<div class="video vidEle"  data-id="${vid_id}"> 
										<div class="video_thambnail">
											<img src="${vid_thumb}" alt="">
										</div>
										<div class="video_details">
										
											<div class="title">
												<h3>${vid_title}</h3>
												
											</div>
										</div>
									</div>
                  </a>
											`;

    vid_container.append(videoEle);
  }















  

  function searchVideo(search) {

    $(".video_player").removeClass("display_video");
    $(".close_video").removeClass("display_close");

    
    console.log("in Search")
    $.get(
      SEARCH_HTTP,
      {
        part: "snippet",
        key: apiKey,
        q: search,
        maxResults: 48,
      },

      function (data) {
        console.log(data);
        $.each(data.items, function (i, item) {
          // console.log(item);
          getChannelIcon(item ,"search");
        });
      }
    );
  }
  // searchVideo("bollywood");


  // -----------show video div after click ----------------

  $(document).on("click", ".vidEle", function () {
    console.log("cliicking", $(this).data("id"));
    $("#player_vid").attr(
      "src",
      "https://www.youtube.com/embed/" + $(this).data("id") 
    );
    $(".video_player").addClass("display_video");
    $(".close_video").addClass("display_close");
  });


  // ----------------get data related to user search------------

  $("form").on("submit", function (e) {
    // validation code here

    e.preventDefault();
    var search = $("#search_video").val();
    // alert("form submitted " + search);
    searchVideo(search);
    return false;
  });


// ----------------------sidebar toggle-------------------

  $("#menu").on('click', function(){
    console.log("jq menu")
      $("#sidebar").toggleClass("show_sidebar");
      console.log("jq menuuuu")
  });



  // ----------------only show search box in mini window---------------
  
  $(".show-search").on('click', function(){
    console.log("hide search")
    $(".afterSmall").addClass("menuHide");
    $(".smallMenu").addClass("menuShow");
    $("#backBtn").removeClass("menuHide");
  });


// -----------------back to navbar in mini window-------------------

  $("#backBtn").on('click', function(){
    console.log("hide search")
    $(".afterSmall").removeClass("menuHide");
    $(".smallMenu").removeClass("menuShow");
    $("#backBtn").addClass("menuHide");
  });


  // ---------------- day night mode-------------------

  $(".dayNight").on('click', function(){
    console.log("daynight")

    if ($(".dayNight").hasClass("day")) {
      $(".header").css({ 'background': 'var(--black)', 'color': 'var(--white)'});
      $(".searchBtn").css({ 'color': 'var(--white)'});
      $("#search_video").css({ 'color': 'var(--white)'});
      $('.youtubeLogo').attr('src','images/toutubelogo.png');
      $(".sidebar").css({ 'background': 'var(--black)', 'color': 'var(--white)'});
      $(".videos").css({ 'background': 'var(--black)'});
      $("h3").css({ 'color': 'var(--white)'});

      $(".dayNight").removeClass("day");
    } else {
      $(".header").css({ 'background': 'var(--white)', 'color': 'var(--black)'});
      $(".searchBtn").css({ 'color': 'var(--black)'});
      $("#search_video").css({ 'color': 'var(--black)'});
      $('.youtubeLogo').attr('src','images/toutubeBlack.png');
      $(".sidebar").css({ 'background': 'var(--white)', 'color': 'var(--black)'});
      $(".videos").css({ 'background': 'var(--white)'});
      $("h3").css({ 'color': 'var(--black)'});

      $(".dayNight").addClass("day");
    }


    // $(this).css('background-color', '#ff0000');
  });





});
