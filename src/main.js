var THREE = require('three');
var OrbitControls = require('three-orbit-controls')(THREE);

var canvas = document.querySelector('#three-mount');
var renderer = new THREE.WebGLRenderer({canvas});

var camera = new THREE.PerspectiveCamera(
  50,
  canvas.width / canvas.height,
  0.1,
  1000
);
var controls = new OrbitControls(camera, canvas);

var scene = new THREE.Scene();
var plane = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide}),
);
var pointer = new THREE.Mesh(
  new THREE.BoxGeometry(0.5,0.5,1),
  new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide}),
)
var ball = new THREE.Mesh(
  new THREE.SphereGeometry(0.2,24),
  new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide}),
)

scene.add(camera);
scene.add(plane);
scene.add(pointer);
scene.add(ball);

camera.position.z = 10;
camera.lookAt(new THREE.Vector3());
pointer.position.z = 5
pointer.lookAt(plane.position);

var q1 = plane.quaternion.clone().inverse();
var pcvec = pointer.position.clone().sub(plane.position);

function updatePCVec() {
  var dq = plane.quaternion.clone().multiply(q1);
  var npcvec = pcvec.clone().applyQuaternion(dq);
  pointer.position.addVectors(plane.position, npcvec);
  var mplanenorm = npcvec.clone().normalize()
  var mplane = new THREE.Plane(mplanenorm);
  var up = pointer.up.clone();
  var proj = mplane.projectPoint(up);
  pointer.up.copy(proj);
  pointer.lookAt(plane.position);
}

function rotatePlaneBy(angle) {
  plane.rotation.x += angle * Math.PI / 180;
}

window.updatePCVec = updatePCVec;
window.rotatePlaneBy = rotatePlaneBy;

function render() {
  var ballpos = pointer.up.clone().multiplyScalar(2).add(pointer.position);
  ball.position.copy(ballpos);
  rotatePlaneBy(0.2);
  updatePCVec();
  camera.aspect = canvas.width / canvas.height;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();
