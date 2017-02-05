! function(a) {
    a(function() {
        a("[data-toggle=popover]").popover()
    })
}(jQuery);

function news_load_more(a) {
	var uri = FOCUS_URL + '&skip=' + parseInt(a);
	$.get(uri, function(f) {
		console.log(f);
		var g = (a / 8) % 2 ? "" : "";

		for (var e = 0; e < f.length; e++) {
		    var d = f[e];
		    $('<tr class="' + g + '"><td style="line-height:65px" ><img  class="img-rounded video-img" alt="點我睇視頻" video-src="' + d.video300k + '" style="width: 120px; height: 65px; cursor: pointer;" src="' + d.image_url + '"></td><td style="line-height:65px" >' + d.title + '</td><td style="line-height:65px">' + moment(d.pubDate).startOf("hour").fromNow() + '</td><td><button type="button" style="margin-top:20%" class="newtextbtn btn btn-default btn-sm"  data_date="' + moment(d.pubDate).format("llll") + '" data-content="' + d.description + '" data-title="' + d.title + '">正文</button></td></tr>').insertBefore("#loadtr")
		}
		$("[data-toggle=popover]").popover();
		$("#loading-content").fadeOut("fast");
		$("#loading-mask").fadeOut("fast");
		$(".video-img").click(function() {
		    document.getElementById("video-palyer").autoplay = true;
		    var h = event.target.getAttribute("video-src");
		    console.log('===>', h);
		    if (h != "undefined") {
		        document.getElementById("video-palyer").setAttribute("src", h);
		        $("#video-mask").fadeIn("fast");
		        $("#video-content").fadeIn("show")
		    } else {
		        // alert("Soooorry,no video~")
		    }
		});
		$(".newtextbtn").bind("click", function(h) {
		    $("#myModalBody_date").text($(h.target).attr("data_date"));
		    $("#myModalBody_text").text($(h.target).attr("data-content"));
		    $("#myModal").modal("show");
		    $("#myModalTitle").text($(h.target).attr("data-title"))
		})
	});
    offset = a + 8
}

function live_load() {
	var uri = LIVE_URL;
	$.get(uri, function(live) {
		    $('<tr><td style="line-height:65px" ><img  class="img-rounded video-img" alt="直播" video-src="' +
		     live.video_android +
		     '" style="width: 120px; height: 65px; cursor: pointer;" src="' +
		     live.image + '"></td><td style="line-height:65px" >' +
		     live.description + '</td><td style="line-height:65px">' +
		     moment(live.pubDate).format("llll") + '</td><td><button id="watch_live" type="button" style="margin-top:20%" class="video-img btn btn-default btn-sm" video-src="' +
		     live.video_android + '">正文</button></td></tr>').insertBefore("#live_loadtr")
		    live_loaded = 1;
		    $("#loading-content").fadeOut("fast");
		    $("#loading-mask").fadeOut("fast");
		    $(".video-img").click(function() {
		        document.getElementById("video-palyer").autoplay = true;
		        var f = event.target.getAttribute("video-src");
		        if (f != "undefined") {
		            document.getElementById("video-palyer").setAttribute("src", f);
		            $("#video-mask").fadeIn("fast");
		            $("#video-content").fadeIn("show")
		        } else {
		            alert("Soooorry,no video~")
		        }
		    });
	});
}

function Programmes_list_load() {
	var uri = PGM_URL;
	$.get(uri, function(e) {
        for (var d = 0; d < e.length; d++) {
            var c = e[d];
            $('<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a pressed="no" class="pro_click_to_load" data-toggle="collapse" data-toggle="collapse" data-parent="#accordion" href="#collapse_'
            	+ c.path + '" id="'
            	+ c.path + '">'
            	+ c.title + '</a></h4></div><div id="collapse_'
            	+ c.path
            	+ '" class="panel-collapse collapse"><table class="table table-hover"><tbody><tr id="collapse_loadmore_'
            	+ c.path
            	+ '"  align="center"><td class="program_loadmore" colspan="4" style="line-height:65px" isnull="no" id="more_'
            	+ c.path
            	+ '" path="'
            	+ c.path
            	+ '" >....</td></tr></tbody></table></div></div>').insertBefore("#list_insert_before_me")
        }
        programmes_loaded = 1;
        $("#loading-content").fadeOut("fast");
        $("#loading-mask").fadeOut("fast");
        if ($(".pro_click_to_load").attr("pressed") == "no") {
            $(".pro_click_to_load").bind("click", function(f) {
                Programmes_specific_load(f.target.id, "pro_click_to_load")
            })
        }
        $(".program_loadmore").bind("click", function(f) {
            console.log($(f.target).attr("path"));
            $("#loading-mask").fadeIn("fast");
            $("#loading-content").fadeIn("show");
            Programmes_specific_load($(f.target).attr("path"), "program_loadmore")
        })
    });
}
function Programmes_specific_load(a, c) {
    if ($("#more_" + a).attr("isnull") === "yes") {
        console.log("isnull");
        $("#more_" + a).text($("#more_" + a).text() + ".");
        $("#loading-content").fadeOut("fast");
        $("#loading-mask").fadeOut("fast");
        return
    }
    if (programmes_offset_list[a] === undefined) {
        programmes_offset_list[a] = 0
    }
    if ($("#" + a).attr("pressed") === "yes" && c === "pro_click_to_load") {
        console.log("bar bar ");
        return
    }

    var uri = PGM_DETAIL_URL + a + '?skip=' + programmes_offset_list[a];

	$.get(uri, function(g) {
        var h = "";
        if ((programmes_offset_list[a] / 6) % 2) {
            h = "active"
        } else {
            h = ""
        }
        if (g.length === 0) {
            $("#more_" + a).text("冇野了.....");
            $("#more_" + a).attr("isnull", "yes")
        }
        for (var f = 0; f < g.length; f++) {
            var e = g[f];
            // console.log(e.title);
            $('<tr class=""><td style="line-height:65px" ><img  class="img-rounded video-img" alt="點我睇視頻" video-src="'
            	+ e.video_android_500k + '" style="width: 120px; height: 65px; cursor: pointer;" src="'
            	+ e.image_url_0 + '"></td><td style="line-height:65px" >'
            	+ e.title + '</td><td style="line-height:65px">'
            	+ e.onair_episode_no
            	+ '</td><td><button type="button" style="margin-top:20%" class="newtextbtn btn btn-default btn-sm"  data_date="'
            	+ moment(e.first_time_onair).format("llll") + '" data-content="'
            	+ e.description
            	+ '" data-title="'
            	+ e.title + '">節目介紹</button></td></tr>').insertBefore("#collapse_loadmore_" + a)
        }
        $("#loading-content").fadeOut("fast");
        $("#loading-mask").fadeOut("fast");
        $("#" + a).attr("pressed", "yes");
        $(".video-img").click(function() {
            document.getElementById("video-palyer").autoplay = true;
            var i = event.target.getAttribute("video-src");
            if (i != "undefined") {
                document.getElementById("video-palyer").setAttribute("src", i);
                $("#video-mask").fadeIn("fast");
                $("#video-content").fadeIn("show")
            } else {
                alert("Soooorry,no video~")
            }
        });
        $(".newtextbtn").bind("click", function(i) {
            $("#myModalBody_date").text($(i.target).attr("data_date"));
            $("#myModalBody_text").text($(i.target).attr("data-content"));
            $("#myModal").modal("show");
            $("#myModalTitle").text($(i.target).attr("data-title"))
        })
    });
    programmes_offset_list[a] = programmes_offset_list[a] + 6
}

var offset = 0,
live_loaded = 0,
programmes_loaded = 0;
var programmes_offset_list = {};
var programmes_first_list = {};
var FOCUS_URL = '/v1/focus?limit=8';
var LIVE_URL = '/v1/live';
var PGM_URL = '/v1/pgm?limit=100';
var PGM_DETAIL_URL = '/v1/pgm/';

news_load_more(offset);
$("#leadstyle").click(function() {
    $("html, body").animate({
        scrollTop: $(document).height()
    }, 1000)
});
$("#loadtr").click(function() {
    news_load_more(offset);
    $("#loading-mask").fadeIn("fast");
    $("#loading-content").fadeIn("show")
});
$("#video-mask").click(function() {
    document.getElementById("video-palyer").pause();
    $("#video-mask").fadeOut("fast");
    $("#video-content").fadeOut("show")
});
$("#live_a").click(function() {
    if (!live_loaded) {
        $("#loading-mask").fadeIn("fast");
        $("#loading-content").fadeIn("show");
        live_load();
    }
});
$("#programmes_a").click(function() {
    if (!programmes_loaded) {
        $("#loading-mask").fadeIn("fast");
        $("#loading-content").fadeIn("show");
        Programmes_list_load()
    }
});
