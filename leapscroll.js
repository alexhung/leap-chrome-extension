var lastFrame;
var TRANSLATION_FACTOR = 20;
var SMOOTHING_FACTOR = 4;

window.onload = function() {
    initThree();
};

function initThree () {
  // set the scene size
  var WIDTH = $(window).width(),
    HEIGHT = $(window).height();

  // set some camera attributes
  var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 1,
    FAR = 10000;

  // create a WebGL renderer, camera
  // and a scene
  camera =
    new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);

  // the camera starts at 0,0,0
  // so pull it back
  camera.position.z = 500;

  scene = new THREE.Scene();

  // add the camera to the scene
  scene.add(camera);

  createSpheres(scene);

  // create a point light
  var pointLight =
    new THREE.PointLight(0xFFFFFF);

  // set its position
  pointLight.position.x = 10;
  pointLight.position.y = 50;
  pointLight.position.z = 130;

  // add to the scene
  scene.add(pointLight);

  // start the renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);

  // attach the render-supplied DOM element
  $('body').append(renderer.domElement);
}

function createSpheres (scene) {
  // set up the sphere vars
  var radius = 10,
      segments = 16,
      rings = 16;

  // create the sphere's material
  var sphereMaterial =
    new THREE.MeshLambertMaterial(
      {
        color: 0xCC0000
      });

  for (var i = 0; i < 5; i++) {
    // create a new mesh with
    // sphere geometry - we will cover
    // the sphereMaterial next!
    var sphere = new THREE.Mesh(
      new THREE.SphereGeometry(
        radius,
        segments,
        rings),
      sphereMaterial);

    // add the sphere to the scene
    scene.add(sphere);
    spheres.push(sphere);
  }
}

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

Leap.loop({enableGestures: true}, function (frame, done) {
  // console.log(frame);

  if (frame.pointables === undefined) {
    return;
  }

  if (frame.hands === undefined || frame.hands.length === 0) {
    $('body').css('transform', 'scale(1.0)');
    $('body').css('transform', 'rotate(0deg)');
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
  $('body').css('transform', 'scale(' + hand._scaleFactor + ')');
  var rotateXDegree = toDegrees(Math.atan(-hand.palmNormal[0], -hand.palmNormal[1]));
  $('body').css('transform', 'rotateX(' + rotateXDegree + 'deg)');
}

function browsePage(gestures) {
  if (gestures[0].type === 'swipe' && gestures[0].state === 'stop') {
    console.log(gestures[0].direction);

    if (gestures[0].direction[0] > 0) {
      history.forward();
    } else {
      history.back();
    }
  }
}