// Dean Attali / Beautiful Jekyll 2016

var main = {

  bigImgEl : null,
  numImgs : null,

  init : function() {
    // Shorten the navbar after scrolling a little bit down
    $(window).scroll(function() {
        if ($(".navbar").offset().top > 50) {
            $(".navbar").addClass("top-nav-short");
        } else {
            $(".navbar").removeClass("top-nav-short");
        }
    });
    
    // On mobile, hide the avatar when expanding the navbar menu
    $('#main-navbar').on('show.bs.collapse', function () {
      $(".navbar").addClass("top-nav-expanded");
    });
    $('#main-navbar').on('hidden.bs.collapse', function () {
      $(".navbar").removeClass("top-nav-expanded");
    });
	
    // On mobile, when clicking on a multi-level navbar menu, show the child links
    $('#main-navbar').on("click", ".navlinks-parent", function(e) {
      var target = e.target;
      $.each($(".navlinks-parent"), function(key, value) {
        if (value == target) {
          $(value).parent().toggleClass("show-children");
        } else {
          $(value).parent().removeClass("show-children");
        }
      });
    });
    
    // Ensure nested navbar menus are not longer than the menu header
    var menus = $(".navlinks-container");
    if (menus.length > 0) {
      var navbar = $("#main-navbar ul");
      var fakeMenuHtml = "<li class='fake-menu' style='display:none;'><a></a></li>";
      navbar.append(fakeMenuHtml);
      var fakeMenu = $(".fake-menu");

      $.each(menus, function(i) {
        var parent = $(menus[i]).find(".navlinks-parent");
        var children = $(menus[i]).find(".navlinks-children a");
        var words = [];
        $.each(children, function(idx, el) { words = words.concat($(el).text().trim().split(/\s+/)); });
        var maxwidth = 0;
        $.each(words, function(id, word) {
          fakeMenu.html("<a>" + word + "</a>");
          var width =  fakeMenu.width();
          if (width > maxwidth) {
            maxwidth = width;
          }
        });
        $(menus[i]).css('min-width', maxwidth + 'px')
      });

      fakeMenu.remove();
    }        
    
    // show the big header image	
    main.initImgs();
  },
  
  initImgs : function() {
    // If the page was large images to randomly select from, choose an image
    if ($("#header-big-imgs").length > 0) {
      main.bigImgEl = $("#header-big-imgs");
      main.numImgs = main.bigImgEl.attr("data-num-img");

          // 2fc73a3a967e97599c9763d05e564189
	  // set an initial image
	  var imgInfo = main.getImgInfo();
	  var src = imgInfo.src;
	  var desc = imgInfo.desc;
  	  main.setImg(src, desc);
  	
	  // For better UX, prefetch the next image so that it will already be loaded when we want to show it
  	  var getNextImg = function() {
	    var imgInfo = main.getImgInfo();
	    var src = imgInfo.src;
	    var desc = imgInfo.desc;		  
	    
		var prefetchImg = new Image();
  		prefetchImg.src = src;
		// if I want to do something once the image is ready: `prefetchImg.onload = function(){}`
		
  		setTimeout(function(){
                  var img = $("<div></div>").addClass("big-img-transition").css("background-image", 'url(' + src + ')');
  		  $(".intro-header.big-img").prepend(img);
  		  setTimeout(function(){ img.css("opacity", "1"); }, 50);
		  
		  // after the animation of fading in the new image is done, prefetch the next one
  		  //img.one("transitioned webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(){
		  setTimeout(function() {
		    main.setImg(src, desc);
			img.remove();
  			getNextImg();
		  }, 1000); 
  		  //});		
  		}, 6000);
  	  };
	  
	  // If there are multiple images, cycle through them
	  if (main.numImgs > 1) {
  	    getNextImg();
	  }
    }
  },
  
  getImgInfo : function() {
  	var randNum = Math.floor((Math.random() * main.numImgs) + 1);
    var src = main.bigImgEl.attr("data-img-src-" + randNum);
	var desc = main.bigImgEl.attr("data-img-desc-" + randNum);
	
	return {
	  src : src,
	  desc : desc
	}
  },
  
  setImg : function(src, desc) {
	$(".intro-header.big-img").css("background-image", 'url(' + src + ')');
	if (typeof desc !== typeof undefined && desc !== false) {
	  $(".img-desc").text(desc).show();
	} else {
	  $(".img-desc").hide();  
	}
  }
};

// 2fc73a3a967e97599c9763d05e564189

document.addEventListener('DOMContentLoaded', main.init);

// d3.js crypto art example, works with d3.v3 but does NOT work with d3.v4"

var dataset = [];
var str = "";
			
for (var i = 0; i < 256; i++) {
	var alea = Math.floor((Math.random() * 20)/10); // alea is between 0 and 2, 2 excluded
	var newNumber = parseInt(alea.toString(2),2); // newNumber is 0 or 1
	str = str + newNumber;  // the 256-bit private key is stored in str as a string
	dataset.push(newNumber);  // the 256-bit private key generated is pushed to dataset
			}
	
var h = 1000;
var h1 = 798;
var w = 670;

var svg = d3.select(".bar-chart") // change "body" to the div class where the SVG image is to be displayed in
	.append("svg")
	.attr("width",w)
	.attr("height",h);
		
for (var i = 0; i < 16; i++) {
	svg.append("text")
	.attr("x", 0)
	.attr("y", h - 230 + i*15)
	.text(function(d) { return str.substring(i*16,(i+1)*16); });  // print str as 16 lines of 16 bits each
		}
			
var circles = svg.selectAll("circle")
	.data(dataset)
	.enter()
	.append("circle");
			
circles.attr("cx", function(d,i) {
		return ((i%16)*(5*h1)+3*h1)/96;
			})
	.attr("cy",function(d,i) {
		return (Math.floor(i/16)*5*h1 + 3*h1)/96; 
			})
	.attr("r", function(d) {
		return 2*h1/96;
			})
	.attr({"fill": function(d) {
		if (d==0) { return "yellow"}
		else { return "blue"};
			},
		"stroke":function(d) {
		if (d==0) { return "green"}
		else { return "red"};
			},
		"stroke-width":function(d) { return h1/96;
			}});