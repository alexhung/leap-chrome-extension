var lastFrame;
var TRANSLATION_FACTOR = 20;
var SMOOTHING_FACTOR = 4;

var scene;

Leap.loop({enableGestures: true}, function (frame, done) {

  if (frame.pointables === undefined) {
    return;
  }
  console.log(frame.pointables.length);

  if (frame.hands === undefined || frame.hands.length === 0) {
    $('body').css('transform', 'scale(1.0) rotate(0deg)');
  }

  if (frame.gestures && frame.gestures.length > 0) {
    browsePage(frame.gestures);
  } else if (frame.pointables.length === 2) {
    scrollPage(frame.pointables);
  } else if (frame.pointables.length > 2) {
    transformPage(frame.hands);
  }

  if (frame !== undefined && frame.pointables !== undefined && frame.pointables.length > 0) {
    lastFrame = frame;
  }

  done();
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

function toDegrees (angle) {
  return angle * (180 / Math.PI);
}

function transformPage(hands) {
  if (hands === undefined || hands.length === 0) {
    return;
  }

  var hand = hands[0];
  var rotateDegree = toDegrees(Math.atan(-hand.palmNormal[0], -hand.palmNormal[1]));
  $('body').css('transform', 'scale(' + hand._scaleFactor + ')' + ' rotateZ(' + rotateDegree + 'deg)');
}

function browsePage(gestures) {
  if (gestures[0].type === 'swipe' && gestures[0].state === 'stop') {
    if (gestures[0].direction[0] > 0) {
      history.forward();
    } else {
      history.back();
    }
  }
}