	//
	// if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
	//
	// var group, camera, scene, renderer;
	//
	// init();
	// animate();
	//
	// function init() {
	//
	// 	scene = new THREE.Scene();
	//
	// 	renderer = new THREE.WebGLRenderer( { antialias: true } );
	// 	renderer.setPixelRatio( window.devicePixelRatio );
	// 	renderer.setSize( window.innerWidth, window.innerHeight );
	// 	document.body.appendChild( renderer.domElement );
	//
	// 	// camera
	//
	// 	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
	// 	camera.position.set( 15, 20, 30 );
	// 	scene.add( camera );
	//
	// 	// controls
	//
	// 	var controls = new THREE.OrbitControls( camera, renderer.domElement );
	// 	controls.minDistance = 20;
	// 	controls.maxDistance = 50;
	// 	controls.maxPolarAngle = Math.PI / 2;
	//
	// 	scene.add( new THREE.AmbientLight( 0x222222 ) );
	//
	// 	// light
	//
	// 	var light = new THREE.PointLight( 0xffffff, 1 );
	// 	camera.add( light );
	//
	// 	// helper
	//
	// 	scene.add( new THREE.AxesHelper(2000));
	// 	const size = 10;
	// 	const divisions = 10;
	//
	// 	// scene.add(new THREE.GridHelper( size, divisions ));
	//
	// 	// textures
	//
	// 	var loader = new THREE.TextureLoader();
	// 	var texture = loader.load( 'textures/sprites/disc.png' );
	//
	// 	group = new THREE.Group();
	// 	scene.add( group );
	//
	// 	// points
	// 	const x = 1;
	// 	const y = 1;
	// 	const z = 1;
	//
	// 	var pointsMaterial = new THREE.PointsMaterial( {
	//
	// 		color: 0x0080ff,
	// 		map: texture,
	// 		size: 1,
	// 		alphaTest: 0.5
	//
	// 	} );
	//
	// 	var meshMaterial = new THREE.MeshLambertMaterial( {
	// 		color: 0xffffff,
	// 		opacity: 0.5,
	// 		transparent: true
	// 	} );
	//
	//
	// 	addData(x, y, z, pointsMaterial, group, meshMaterial, i);
	//
	// 	//
	//
	// 	window.addEventListener( 'resize', onWindowResize, false );
	//
	// }
	//
	// function randomPoint() {
	//
	// 	return new THREE.Vector3( THREE.Math.randFloat( - 1, 1 ), THREE.Math.randFloat( - 1, 1 ), THREE.Math.randFloat( - 1, 1 ) );
	//
	// }
	//
	// function onWindowResize() {
	//
	// 	camera.aspect = window.innerWidth / window.innerHeight;
	// 	camera.updateProjectionMatrix();
	//
	// 	renderer.setSize( window.innerWidth, window.innerHeight );
	//
	// }
	//
	// function animate() {
	//
	// 	requestAnimationFrame( animate );
	//
	// 	// group.rotation.y += 0.005;
	//
	// 	render();
	//
	// }
	//
	// function render() {
	//
	// 	renderer.render( scene, camera );
	//
	// }
	//
	//
	// function addData( x, y, z, pointsMaterial, group, meshMaterial, i) {
	// 	// xyz are coordinates of original block
	// 	// pointsMaterial and meshMaterial are the material data passed
	// 	// i is the counter
	//
	// 	const shape = new THREE.BoxGeometry(x,y,z);
	// 	shape.translate( (x/2), (y/2), (z/2) );
	//
	// 	const points = new THREE.Points( shape, pointsMaterial );
	// 	group.add( points );
	//
	// 	// convex hull
	// 	const meshGeometry = new THREE.ConvexBufferGeometry( shape.vertices );
	//
	// 	const mesh = new THREE.Mesh( meshGeometry, meshMaterial );
	// 	mesh.material.side = THREE.BackSide; // back faces
	// 	mesh.renderOrder = i;
	// 	group.add( mesh );
	// }
