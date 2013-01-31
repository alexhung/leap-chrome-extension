var lastFrame;
var TRANSLATION_FACTOR = 20;
var SMOOTHING_FACTOR = 4;

Leap.loop(function (frame) {
  // console.log(frame);

  if (frame.pointables === undefined) {
    return;
  }

  if (frame.hands === undefined || frame.hands.length === 0) {
    document.body.style.zoom = 1.0;
  }

  if (frame.pointables.length === 2) {
    scrollPage(frame.pointables);
  } else if (frame.pointables.length > 2) {
    zoomPage(frame.hands);
  }

  if (frame !== undefined && frame.pointables !== undefined && frame.pointables.length > 0) {
    lastFrame = frame;
  }
});

function scrollPage (pointables) {
  if (pointables === undefined || pointables.length === 0 || lastFrame === undefined || lastFrame.pointables.length === 0) {
    return;
  }

  var finger = pointables[0];
  var lastFinger = lastFrame.pointables[0];

  var hTranslation = 0;
  var hDelta = finger.tipPosition[0] - lastFinger.tipPosition[0];
  if (hDelta > 10) {
    hTranslation = TRANSLATION_FACTOR;
  } else if (hDelta < 10) {
    hTranslation = -TRANSLATION_FACTOR;
  }

  var vTranslation = 0;
  var vDelta = finger.tipPosition[1] - lastFinger.tipPosition[1];
  if (vDelta > SMOOTHING_FACTOR) {
    vTranslation = TRANSLATION_FACTOR;
  } else if (vDelta < -SMOOTHING_FACTOR) {
    vTranslation = -TRANSLATION_FACTOR;
  }

  // console.log("hTranslation: " + hTranslation);
  // console.log("vDelta: " + vDelta);

  window.scrollBy(hTranslation, vTranslation);
}

function zoomPage(hands) {
  if (hands === undefined || hands.length === 0) {
    return;
  }

  var hand = hands[0];
  document.body.style.zoom = hand._scaleFactor;
}