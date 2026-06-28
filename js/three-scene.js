/* ============================================================
   three-scene.js
   Pure page ke peeche chalne wala fullscreen 3D background.
   - Har section ke peeche roughly ek low-poly gradient shape
     hai; scroll karne par sab shapes upar se neeche guzarte
     hain (parallax).
   - Mouse move par halki si 3D tilt parallax hoti hai.
   - prefers-reduced-motion ka khayal rakha gaya hai.
   ============================================================ */

(function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Core scene setup ---------- */

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    /* ---------- Gradient-colored lights ----------
       Ye teen lights hi "colorful gradient" look ka raaz hain —
       jaise jaise ye orbit karti hain, shapes ki rangat shift hoti hai. */

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const lightCoral = new THREE.PointLight(0xff5f6d, 2.2, 40);
    lightCoral.position.set(-8, 4, 6);
    scene.add(lightCoral);

    const lightViolet = new THREE.PointLight(0x7c4dff, 2.4, 40);
    lightViolet.position.set(8, -2, 6);
    scene.add(lightViolet);

    const lightAqua = new THREE.PointLight(0x00d9c0, 2, 40);
    lightAqua.position.set(0, 6, -4);
    scene.add(lightAqua);

    /* ---------- Shapes: roughly one per section ---------- */

    const shapesGroup = new THREE.Group();
    scene.add(shapesGroup);

    function makeShape(geometry, color, position, scale) {
        const material = new THREE.MeshStandardMaterial({
            color,
            metalness: 0.35,
            roughness: 0.4,
            flatShading: true
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(position[0], position[1], position[2]);
        mesh.scale.setScalar(scale);
        shapesGroup.add(mesh);

        // faint wireframe twin for extra definition against the dark background
        const wireMesh = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.07 })
        );
        wireMesh.position.copy(mesh.position);
        wireMesh.scale.setScalar(scale * 1.01);
        shapesGroup.add(wireMesh);

        return mesh;
    }

    // Vertical spacing here roughly lines up with hero / about / skills / work / contact
    const heroShape    = makeShape(new THREE.IcosahedronGeometry(2.2, 1), 0x7c4dff, [4, 0, -2], 1);
    const aboutShape   = makeShape(new THREE.TorusKnotGeometry(1.1, 0.35, 120, 16), 0x00d9c0, [-4.5, -14, -3], 0.9);
    const skillsShape  = makeShape(new THREE.OctahedronGeometry(1.6, 0), 0xffc65c, [4.5, -26, -2], 1);
    const workShape    = makeShape(new THREE.IcosahedronGeometry(1.8, 0), 0xff5f6d, [-4, -40, -3], 1);
    const contactShape = makeShape(new THREE.SphereGeometry(1.4, 32, 32), 0x7c4dff, [0, -54, -2], 0.8);

    const allShapes = [heroShape, aboutShape, skillsShape, workShape, contactShape];

    /* ---------- Ambient particle field ---------- */

    const particleCount = 220;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 40;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
        particleGeometry,
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.4 })
    );
    scene.add(particles);

    /* ---------- Scroll-driven movement ---------- */

    let targetY = 0;
    let currentY = 0;

    function updateScrollTarget() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        targetY = progress * 58; // total travel distance, matches shape spacing above
    }
    window.addEventListener('scroll', updateScrollTarget, { passive: true });
    updateScrollTarget();

    /* ---------- Mouse parallax ---------- */

    let mouseX = 0, mouseY = 0;
    let rotX = 0, rotY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    /* ---------- Resize / visibility handling ---------- */

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let isPageVisible = true;
    document.addEventListener('visibilitychange', () => {
        isPageVisible = document.visibilityState === 'visible';
    });

    /* ---------- Render loop ---------- */

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        if (!isPageVisible) return;

        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        currentY += (targetY - currentY) * 0.07;
        shapesGroup.position.y = currentY;

        if (!prefersReducedMotion) {
            rotX += (mouseY * 0.15 - rotX) * 0.04;
            rotY += (mouseX * 0.2 - rotY) * 0.04;
            shapesGroup.rotation.x = rotX;
            shapesGroup.rotation.y = rotY;
        }

        allShapes.forEach((shape, i) => {
            shape.rotation.x += delta * (0.08 + i * 0.01);
            shape.rotation.y += delta * (0.1 + i * 0.015);
        });

        // orbiting colored lights keep the gradient lighting alive across the whole page
        lightCoral.position.x = Math.sin(elapsed * 0.2) * 9;
        lightCoral.position.z = Math.cos(elapsed * 0.2) * 9;
        lightViolet.position.x = Math.sin(elapsed * 0.18 + 2) * 9;
        lightViolet.position.y = Math.cos(elapsed * 0.15) * 5;
        lightAqua.position.z = Math.sin(elapsed * 0.22) * 9;

        particles.rotation.y = elapsed * 0.015;

        renderer.render(scene, camera);
    }

    animate();
})();
