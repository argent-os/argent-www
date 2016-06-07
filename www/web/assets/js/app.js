function animateSectionFour() {
    setTimeout(function() {
        $(".roommate-left").addClass("active")
    }, 0), setTimeout(function() {
        $(".roommate-top").addClass("active")
    }, 200), setTimeout(function() {
        $(".roommate-right").addClass("active")
    }, 400), setTimeout(function() {
        $(".dot").addClass("active")
    }, 600)
}

function animateSectionOne() {
    hasPlayedSectionTwo || setTimeout(function() {
        $("#animated-phone").attr("src", "assets/img/mocks/iphone-animated.gif")
    }, 0)
}

function animateSectionThree() {
    hasPlayedSectionThree || $("#apple-watch").attr("src", "assets/img/mocks/apple-watch-dark.gif")
}

var hasPlayedSectionOne = !1,
    hasPlayedSectionTwo = !1,
    hasPlayedSectionThree = !1,
    hasPlayedSectionFour = !1,
    s3Path = "https://s3-us-west-2.amazonaws.com/cdn.unbill.com",
    apiPath = "https://unbill.co",
    branchBiller = void 0;
$(document).ready(function() {

}), $(window).on("DOMContentLoaded load resize scroll", function() {
    $(".section-one .bill-assistant").bind("inview", function(event, visible) {
        visible && (hasPlayedSectionOne || animateSectionOne(), hasPlayedSectionOne = !0)
    }), $(".section-three .badge").bind("inview", function(event, visible) {
        visible && (hasPlayedSectionOne || animateSectionThree(), hasPlayedSectionThree = !0)
    })
});

$(document).scroll(function() {
  var y = $(this).scrollTop();
  if (y > 1900 && y < 1950) {
    animateSectionThree()
  } else {
  }
});