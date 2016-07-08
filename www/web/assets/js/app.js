function animateSectionOne() {
    hasPlayedSectionTwo || setTimeout(function() {
        $("#animated-phone").attr("src", "assets/img/mocks/iphone-animated.gif")
    }, 0)
}

function animateSectionThree() {
    // hasPlayedSectionThree || $("#apple-watch").attr("src", "assets/img/mocks/apple-watch-dark.gif")
}

var hasPlayedSectionOne = !1,
    hasPlayedSectionTwo = !1,
    hasPlayedSectionThree = !1,
    hasPlayedSectionFour = !1;
$(document).ready(function() {

}), $(window).on("DOMContentLoaded load scroll", function() {
    $(".section-one").bind("inview", function(event, visible) {
        visible && (hasPlayedSectionOne || animateSectionOne(), hasPlayedSectionOne = !0)
    }), $(".section-three").bind("inview", function(event, visible) {
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