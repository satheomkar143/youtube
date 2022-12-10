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
      maxResults: 1,
      regionCode: "IN",
    },

    function (data) {
      $.each(data.items, function (i, item) {
        console.log(item);
        getChannelIcon(item);
      });
    }
  );

  function getChannelIcon(video_data, type) {
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
    var channelLogo = item.channelThumbnail;

    if (type == "search") {
      var vid_id = item.id.videoId;
    } else {
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
        <div class="author"><img src="${channelLogo}" alt=""> </div>                    
          <div class="title">
            <h3>${vid_title}</h3>                     
          </div>
        </div>
      </div>
    </a>
		`;

    vid_container.append(videoEle);
    if ($(".dayNight").hasClass("day")) {
      $("h3").css({ color: "var(--black)" });
    } else {
      $("h3").css({ color: "var(--white)" });
    }
  }

  function searchVideo(search) {
    $(".video_player").removeClass("display_video");
    $(".close_video").removeClass("display_close");

    console.log("in Search");
    $.get(
      SEARCH_HTTP,
      {
        part: "snippet",
        key: apiKey,
        q: search,
        maxResults: 1,
      },

      function (data) {
        console.log(data);
        $.each(data.items, function (i, item) {
          // console.log(item);
          getChannelIcon(item, "search");
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
    $(".video_player").attr("id", $(this).data("id"));
    videoIdPresent($(this).data("id"));
    videoWatchPresent($(this).data("id"));
    updateHistoryVideos($(this).data("id"));
  });

  function videoIdPresent(id) {
    let likedVideos = JSON.parse(localStorage.getItem("likedVideos"));
    let index = likedVideos.indexOf(id);
    console.log("videoidpresent", index);
    if (index > -1) {
      $("#likeVidBtn").addClass("like");
      $("#likeVidBtn").css({ color: "red" });
    } else {
      $("#likeVidBtn").removeClass("like");
      $("#likeVidBtn").css({ color: "var(--gray)" });
    }
  }

  function videoWatchPresent(id) {
    let watchLaterVideos = JSON.parse(localStorage.getItem("watchLaterVideos"));
    let index = watchLaterVideos.indexOf(id);
    console.log("video id watch present", index);
    if (index > -1) {
      $("#watchLaterBtn").addClass("watchLater");
      $("#watchLaterBtn").css({ color: "red" });
    } else {
      $("#watchLaterBtn").removeClass("watchLater");
      $("#watchLaterBtn").css({ color: "var(--gray)" });
    }
  }

  // ----------------get data related to user search------------

  $("form").on("submit", function (e) {
    // validation code here

    e.preventDefault();
    var search = $("#search_video").val();
    // alert("form submitted " + search);
    searchVideo(search);
    $("#search_video").val("");
    return false;
  });

  //----------------get data related to tab button-----------
  const tabs = document.querySelectorAll(".tabs-box .tab");

  tabs.forEach((tab) => {
    $(tab).on("click", () => {
      console.log("id= ", tab.id);
      searchVideo(tab.id);
    });
  });

  // ----------------------sidebar toggle-------------------

  $("#menu").on("click", function () {
    console.log("jq menu");
    $("#sidebar").toggleClass("show_sidebar");
    console.log("jq menuuuu");
  });

  // ----------------only show search box in mini window---------------

  $(".show-search").on("click", function () {
    console.log("hide search");
    $(".afterSmall").addClass("menuHide");
    $(".smallMenu").addClass("menuShow");
    $("#backBtn").removeClass("menuHide");
  });

  // -----------------back to navbar in mini window-------------------

  $("#backBtn").on("click", function () {
    console.log("hide search");
    $(".afterSmall").removeClass("menuHide");
    $(".smallMenu").removeClass("menuShow");
    $("#backBtn").addClass("menuHide");
  });

  // ---------- user liked videos--------------

  function updateLikedVideos() {
    const videoId = $(".video_player").attr("id");
    console.log("likedVideos =", videoId);

    let likedVideos = JSON.parse(localStorage.getItem("likedVideos"));
    if (!likedVideos) {
      likedVideos = [];
    }

    if (videoId != "undefined") {
      likedVideos.push(videoId);
      localStorage.setItem("likedVideos", JSON.stringify(likedVideos));

      $("#likeVidBtn").css({ color: "red" });
      $("#likeVidBtn").addClass("like");
      console.log("successfully updated video id");
    } else {
      console.log("error in updated video id");
    }
  }

  function updateUnlikeVideos() {
    let likedVideos = JSON.parse(localStorage.getItem("likedVideos"));
    const videoId = $(".video_player").attr("id");
    let index = likedVideos.indexOf(videoId);

    likedVideos.splice(index, 1);
    localStorage.setItem("likedVideos", JSON.stringify(likedVideos));

    $("#likeVidBtn").removeClass("like");
    $("#likeVidBtn").css({ color: "var(--gray)" });
    console.log("unlike successfully");
  }

  $("#likeVidBtn").on("click", () => {
    if ($("#likeVidBtn").hasClass("like")) {
      updateUnlikeVideos();
    } else {
      updateLikedVideos();
    }
  });

  // ---------------------user watch later videos--------------

  function updateWatchedVideos() {
    const videoId = $(".video_player").attr("id");
    console.log("watchLaterVideos =", videoId);

    let watchLaterVideos = JSON.parse(localStorage.getItem("watchLaterVideos"));
    if (!watchLaterVideos) {
      watchLaterVideos = [];
    }

    if (videoId != "undefined") {
      watchLaterVideos.push(videoId);
      localStorage.setItem(
        "watchLaterVideos",
        JSON.stringify(watchLaterVideos)
      );

      $("#watchLaterBtn").css({ color: "red" });
      $("#watchLaterBtn").addClass("watchLater");
      console.log("successfully updated video watch later id");
    } else {
      console.log("error in updated watch later video id");
    }
  }

  function updateUnwatchLaterVideos() {
    let watchLaterVideos = JSON.parse(localStorage.getItem("watchLaterVideos"));
    const videoId = $(".video_player").attr("id");
    let index = watchLaterVideos.indexOf(videoId);

    watchLaterVideos.splice(index, 1);
    localStorage.setItem("watchLaterVideos", JSON.stringify(watchLaterVideos));

    $("#watchLaterBtn").removeClass("watchLater");
    $("#watchLaterBtn").css({ color: "var(--gray)" });
    console.log("un watch later successfully");
  }

  $("#watchLaterBtn").on("click", () => {
    if ($("#watchLaterBtn").hasClass("watchLater")) {
      updateUnwatchLaterVideos();
    } else {
      updateWatchedVideos();
    }
  });

  // -----------------user video history------------

  function updateHistoryVideos(id) {
    let historyVideos = JSON.parse(localStorage.getItem("historyVideos"));
    if (!historyVideos) {
      historyVideos = [];
    }

    if (id != "undefined") {
      let index = historyVideos.indexOf(id);

      if (index == -1) {
        historyVideos.push(id);
        localStorage.setItem("historyVideos", JSON.stringify(historyVideos));
        console.log("successfully updated video history id");
      } else {
        console.log("id already in history");
      }
    } else {
      console.log("error in updated history video id");
    }
  }

  // --------------------get video data using localstorage video id-----

  function getVideoDataByVideoId(videoArrayList) {
    let localVideosIds = JSON.parse(localStorage.getItem(videoArrayList));
    if (localVideosIds) {

      var vid_container = $(".video_container");
      vid_container.empty();
      $(".video_player").removeClass("display_video");

      let vidId;
      let respVideoData = [];
      localVideosIds.forEach(function (vid) {
        vidId = vid;

        console.log("saidebar == " + vidId);
        $.get(
          VIDEO_HTTP,
          {
            part: "snippet",
            key: apiKey,
            id: vidId,
          },

          function (data) {
            console.log("history videos by id in sidebar", data);
            respVideoData.push(data);
            // let finalData = getChannelIconForLocal(data)
            makeVideoCardForLocal(data);

          }
        );
      });
      console.log("final data", respVideoData);
      console.log("final data resp", respVideoData);

    } else {
      console.log("no data found in sidebar history");
    }
  }

  $("#historySideBtn").on("click", function () {
    console.log("sidebar history");
    getVideoDataByVideoId("historyVideos");
  });

  $("#watchLaterSideBtn").on("click", function () {
    console.log("sidebar watch later");
    getVideoDataByVideoId("watchLaterVideos");
  });

  $("#likeSideBtn").on("click", function () {
    console.log("sidebar like ");
    getVideoDataByVideoId("likedVideos");
  });



  // ---------------------make video card for localstorage ids data-----------



  function makeVideoCardForLocal(item){
    // item.channelThumbnail = "omkarsathe"
    
    // console.log("in test fun ",item.items[0].id);
    // console.log("in test fun ",item.items[0].snippet.title);
    // console.log("in test fun ",item.items[0].snippet.thumbnails.medium.url);
    // console.log("in test fun final result",item)
    // console.log("in test fun channel ",item.channelLogo);

    var vid_title = item.items[0].snippet.title;
    var vid_thumb = item.items[0].snippet.thumbnails.medium.url;
    // var channelLogo = item.channelLogo;
    var vid_id = item.items[0].id;

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
    if ($(".dayNight").hasClass("day")) {
      $("h3").css({ color: "var(--black)" });
    } else {
      $("h3").css({ color: "var(--white)" });
    }
  }

  function getChannelIconForLocal(video_data) {

    $.get(
      CHANNEL_HTTP,
      {
        part: "snippet",
        key: apiKey,
        id: video_data.items[0].snippet.channelId
      },
     function (data) {
        // console.log(data);
        video_data.channelLogo =
          data.items[0].snippet.thumbnails.default.url;
        // console.log(video_data);      
      }
      );
      return video_data;
  }










  // ---------------- day night mode-------------------

  $(".dayNight").on("click", function () {
    console.log("daynight");

    if ($(".dayNight").hasClass("day")) {
      $(".header").css({ background: "var(--black)", color: "var(--white)" });
      $(".searchBtn").css({ color: "var(--white)" });
      $("#search_video").css({ color: "var(--white)" });
      $(".youtubeLogo").attr("src", "images/toutubelogo.png");
      $(".sidebar").css({ background: "var(--black)", color: "var(--white)" });
      $(".videos").css({ background: "var(--black)" });
      $("h3").css({ color: "var(--white)" });
      $(".wrapper").css({ color: "var(--white)" });
      $(".sliderArrow").css({ color: "var(--white)" });
      $(".tab").css({ background: "var(--darkgray)" });
      $(".icon:first-child").css({
        background: "linear-gradient(90deg, var(--black) 50%, transparent)",
      });
      $(".icon:last-child").css({
        background: "linear-gradient(-90deg, var(--black) 50%, transparent)",
      });

      $(".sidebar_catagory").hover(
        function () {
          $(this).css("background-color", "var(--gray)");
        },
        function () {
          $(this).css("background-color", "transparent");
        }
      );

      $(".sliderArrow").hover(
        function () {
          $(this).css("background-color", "var(--darkgray)");
        },
        function () {
          $(this).css("background-color", "transparent");
        }
      );

      $(".tab").hover(
        function () {
          $(this).css("background-color", "var(--gray)");
        },
        function () {
          $(this).css("background-color", "var(--darkgray)");
        }
      );

      $(".dayNight").removeClass("day");
    } else {
      $(".header").css({ background: "var(--white)", color: "var(--black)" });
      $(".searchBtn").css({ color: "var(--black)" });
      $("#search_video").css({ color: "var(--black)" });
      $(".youtubeLogo").attr("src", "images/toutubeBlack.png");
      $(".sidebar").css({ background: "var(--white)", color: "var(--black)" });
      $(".videos").css({ background: "var(--white)" });
      $("h3").css({ color: "var(--black)" });
      $(".wrapper").css({ color: "var(--black)" });
      $(".sliderArrow").css({ color: "var(--black)" });
      $(".tab").css({ background: "var(--darkwhite)" });
      $(".icon:first-child").css({
        background: "linear-gradient(90deg, var(--white) 50%, transparent)",
      });
      $(".icon:last-child").css({
        background: "linear-gradient(-90deg, var(--white) 50%, transparent)",
      });

      $(".sidebar_catagory").hover(
        function () {
          $(this).css("background-color", "var(--midwhite)");
        },
        function () {
          $(this).css("background-color", "transparent");
        }
      );

      $(".sliderArrow").hover(
        function () {
          $(this).css("background-color", "var(--darkwhite)");
        },
        function () {
          $(this).css("background-color", "transparent");
        }
      );

      $(".tab").hover(
        function () {
          $(this).css("background-color", "var(--midwhite)");
        },
        function () {
          $(this).css("background-color", "var(--darkwhite)");
        }
      );

      $(".dayNight").addClass("day");
    }
  });
});
