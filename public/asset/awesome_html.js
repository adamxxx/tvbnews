! function(a) {
    a(function() {
        a("[data-toggle=popover]").popover()
    })
}(jQuery);

function news_load_more(a) {
	var uri = FOCUS_URL + '&skip=' + parseInt(a);
	$.get(uri, function(f) {
		console.log(f);
		var g = (a / 8) % 2 ? "active" : "";

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
    // var c = Parse.Object.extend("Focus");
    // var b = new Parse.Query(c);
    // b.descending("createdAt");
    // b.limit(8);
    // b.skip(a);
    // b.find({
    //     success: function(f) {
    //         console.log(f);
    //         var g = (a / 8) % 2 ? "active" : "";

    //         for (var e = 0; e < f.length; e++) {
    //             var d = f[e];
    //             $('<tr class="' + g + '"><td style="line-height:65px" ><img  class="img-rounded video-img" alt="點我睇視頻" video-src="' + d.video300k + '" style="width: 120px; height: 65px; cursor: pointer;" src="' + d.image_url + '"></td><td style="line-height:65px" >' + d.title + '</td><td style="line-height:65px">' + moment(d.pubDate).startOf("hour").fromNow() + '</td><td><button type="button" style="margin-top:20%" class="newtextbtn btn btn-default btn-sm"  data_date="' + moment(d.pubDate).format("llll") + '" data-content="' + d.description + '" data-title="' + d.title + '">正文</button></td></tr>').insertBefore("#loadtr")
    //         }
    //         $("[data-toggle=popover]").popover();
    //         $("#loading-content").fadeOut("fast");
    //         $("#loading-mask").fadeOut("fast");
    //         $(".video-img").click(function() {
    //             document.getElementById("video-palyer").autoplay = true;
    //             var h = event.target.getAttribute("video-src");
    //             if (h != "undefined") {
    //                 document.getElementById("video-palyer").setAttribute("src", h);
    //                 $("#video-mask").fadeIn("fast");
    //                 $("#video-content").fadeIn("show")
    //             } else {
    //                 alert("Soooorry,no video~")
    //             }
    //         });
    //         $(".newtextbtn").bind("click", function(h) {
    //             $("#myModalBody_date").text($(h.target).attr("data_date"));
    //             $("#myModalBody_text").text($(h.target).attr("data-content"));
    //             $("#myModal").modal("show");
    //             $("#myModalTitle").text($(h.target).attr("data-title"))
    //         })
    //     },
    //     error: function(d) {}
    // });
    offset = a + 8
}
function live_load() {
    var a = Parse.Object.extend("Live");
    var b = new Parse.Query(a);
    b.descending("createdAt");
    b.limit(1);
    b.find({
        success: function(e) {
            for (var d = 0; d < e.length; d++) {
                var c = e[d];
                console.log(c.get("title"));
                $('<tr><td style="line-height:65px" ><img  class="img-rounded video-img" alt="直播" video-src="' + c.get("video") + '" style="width: 120px; height: 65px; cursor: pointer;" src="' + c.get("image_url_0") + '"></td><td style="line-height:65px" >' + c.get("description") + '</td><td style="line-height:65px">' + moment(c.get("pubDate")).format("llll") + '</td><td><button id="watch_live" type="button" style="margin-top:20%" class="video-img btn btn-default btn-sm" video-src="' + c.get("video") + '">正文</button></td></tr>').insertBefore("#live_loadtr")
            }
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
            })
        },
        error: function(c) {}
    })
}
function Programmes_list_load() {
    var b = Parse.Object.extend("Programmes");
    var a = new Parse.Query(b);
    a.limit(27);
    a.ascending("show_order");
    a.equalTo("is_post", 1);
    a.find({
        success: function(e) {
            for (var d = 0; d < e.length; d++) {
                var c = e[d];
                console.log(c.get("title"));
                $('<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title"><a pressed="no" class="pro_click_to_load" data-toggle="collapse" data-toggle="collapse" data-parent="#accordion" href="#collapse_' + c.get("path") + '" id="' + c.get("path") + '">' + c.get("title") + '</a></h4></div><div id="collapse_' + c.get("path") + '" class="panel-collapse collapse"><table class="table table-hover"><tbody><tr id="collapse_loadmore_' + c.get("path") + '"  align="center"><td class="program_loadmore" colspan="4" style="line-height:65px" isnull="no" id="more_' + c.get("path") + '" path="' + c.get("path") + '" >....</td></tr></tbody></table></div></div>').insertBefore("#list_insert_before_me")
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
        },
        error: function(c) {}
    })
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
    var d = Parse.Object.extend("ProgrammeDetail");
    var b = new Parse.Query(d);
    b.limit(6);
    b.descending("onair_episode_no");
    b.equalTo("path", a);
    b.skip(programmes_offset_list[a]);
    b.find({
        success: function(g) {
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
                console.log(e.get("title"));
                $('<tr "' + h + '"><td style="line-height:65px" ><img  class="img-rounded video-img" alt="點我睇視頻" video-src="' + e.get("video300k") + '" style="width: 120px; height: 65px; cursor: pointer;" src="' + e.get("image_url_0") + '"></td><td style="line-height:65px" >' + e.get("title") + '</td><td style="line-height:65px">' + e.get("onair_episode_no") + '</td><td><button type="button" style="margin-top:20%" class="newtextbtn btn btn-default btn-sm"  data_date="' + moment(e.get("first_time_onair")).format("llll") + '" data-content="' + e.get("description") + '" data-title="' + e.get("title") + '">節目介紹</button></td></tr>').insertBefore("#collapse_loadmore_" + a)
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
        },
        error: function(e) {}
    });
    programmes_offset_list[a] = programmes_offset_list[a] + 6
}
function eaaxport() {
    var b = Parse.Object.extend("Programmes");
    var a = new Parse.Query(b);
    a.find({
        success: function(e) {
            alert(e.length);
            for (var d = 0; d < e.length; d++) {
                var c = e[d];
                console.log('"' + c.get("path") + '":"' + c.get("title") + '"')
            }
        },
        error: function(c) {}
    })
}

var offset = 0,
live_loaded = 0,
programmes_loaded = 0;
var programmes_offset_list = {};
var programmes_first_list = {};
var FOCUS_URL = '/v1/focus?limit=8';
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
        live_load()
    }
});
$("#programmes_a").click(function() {
    if (!programmes_loaded) {
        $("#loading-mask").fadeIn("fast");
        $("#loading-content").fadeIn("show");
        Programmes_list_load()
    }
});
