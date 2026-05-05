import * as THREE from 'three';

// Load configuration
let config = null;

async function loadConfig() {
    try {
        const response = await fetch('config.json');
        config = await response.json();
        populateContent();
        initThreeJS();
        initTypewriter();
        initInteractivity();
    } catch (error) {
        console.error('Error loading config:', error);
    }
}

function populateContent() {
    if (!config) return;

    // Hero badge
    const heroBadge = document.getElementById('heroBadge');
    if (heroBadge) heroBadge.textContent = config.personal.badge;

    // Social links
    const socialLinks = document.getElementById('socialLinks');
    const footerSocial = document.getElementById('footerSocial');
    if (socialLinks) {
        socialLinks.innerHTML = `
            <a href="${config.social.github}" target="_blank"><i class="fab fa-github"></i></a>
            <a href="${config.social.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>
            <a href="${config.social.email}"><i class="fas fa-envelope"></i></a>
        `;
    }
    if (footerSocial) {
        footerSocial.innerHTML = `
            <a href="${config.social.github}" target="_blank"><i class="fab fa-github"></i></a>
            <a href="${config.social.linkedin}" target="_blank"><i class="fab fa-linkedin-in"></i></a>
            <a href="${config.social.email}"><i class="fas fa-envelope"></i></a>
        `;
    }

    // Skills grid
    const skillsGrid = document.getElementById('skillsGrid');
    if (skillsGrid && config.skills) {
        skillsGrid.innerHTML = config.skills.map(skill => `
            <div class="skill-card">
                <div class="skill-icon"><i class="${skill.icon}"></i></div>
                <h3>${skill.title}</h3>
                <p>${skill.description}</p>
                ${skill.tags.map(tag => `<div class="tag">${tag}</div>`).join('')}
                ${skill.sideBadge ? `<div class="side-skill-badge">${skill.sideBadge}</div>` : ''}
            </div>
        `).join('');
    }

    // Projects grid
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid && config.projects) {
        projectsGrid.innerHTML = config.projects.map(project => `
            <div class="project-card">
                <i class="${project.icon}" style="font-size: 2.2rem; color: ${project.iconColor};"></i>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                ${project.tags.map(tag => `<div class="tag">${tag}</div>`).join('')}
                ${project.upcoming ? 
                    `<span class="github-link" style="cursor:default;"><i class="fas fa-cogs"></i> Private / Upcoming</span>` :
                    `<a href="${project.link}" target="_blank" class="github-link"><i class="fab fa-github"></i> ${project.linkText}</a>`
                }
            </div>
        `).join('');
    }

    // About section
    const aboutText = document.getElementById('aboutText');
    const infoGrid = document.getElementById('infoGrid');
    const quoteBox = document.getElementById('quoteBox');
    const footerText = document.getElementById('footerText');

    if (aboutText) aboutText.innerHTML = config.about.intro;
    if (infoGrid && config.about.infoItems) {
        infoGrid.innerHTML = config.about.infoItems.map(item => `
            <div class="info-item">
                <i class="${item.icon}"></i>
                <span><strong>${item.label}</strong><br>${item.value}</span>
            </div>
        `).join('');
    }
    if (quoteBox) quoteBox.innerHTML = `<i class="fas fa-quote-left" style="color:#0ff;"></i> ${config.about.quote}`;
    if (footerText) footerText.innerHTML = `${config.footer.text}<br><span style="font-size:0.8rem; opacity:0.7;">⚠️ ${config.footer.warning}</span>`;

    // Update form action
    const contactForm = document.getElementById('contactForm');
    if (contactForm && config.formspree) {
        contactForm.action = config.formspree.endpoint;
    }
}

function initTypewriter() {
    if (!config) return;
    const texts = config.typewriterTexts;
    let idx = 0, charIdx = 0;
    const typeEl = document.getElementById('typewriter-text');
    
    function typeWriter() {
        if (!typeEl) return;
        if (charIdx < texts[idx].length) {
            typeEl.innerHTML = texts[idx].substring(0, charIdx + 1) + '<span style="opacity:0.7;">_</span>';
            charIdx++;
            setTimeout(typeWriter, 70);
        } else {
            setTimeout(() => {
                idx = (idx + 1) % texts.length;
                charIdx = 0;
                typeWriter();
            }, 2500);
        }
    }
    typeWriter();
}

function initThreeJS() {
    const shapeTypes = [
        { name: "⚡ TORUS KNOT", create: () => new THREE.TorusKnotGeometry(1.2, 0.32, 180, 24, 3, 4), color: 0x0ff0ff, emissive: 0x004444 },
        { name: "🌀 ICOSAHEDRON", create: () => new THREE.IcosahedronGeometry(1.3, 0), color: 0xff44aa, emissive: 0x331133 },
        { name: "🔮 DODECAHEDRON", create: () => new THREE.DodecahedronGeometry(1.1, 0), color: 0x44ffaa, emissive: 0x114422 },
        { name: "💠 OCTAHEDRON", create: () => new THREE.OctahedronGeometry(1.4, 0), color: 0xffaa44, emissive: 0x442200 },
        { name: "🔷 TETRAHEDRON", create: () => new THREE.TetrahedronGeometry(1.4, 0), color: 0xaa66ff, emissive: 0x220044 },
        { name: "⚙️ RING TORUS", create: () => new THREE.TorusGeometry(1.1, 0.28, 64, 128), color: 0xff66cc, emissive: 0x331122 }
    ];
    const randomIndex = Math.floor(Math.random() * shapeTypes.length);
    const selected = shapeTypes[randomIndex];
    document.getElementById('shapeTag').innerHTML = `${selected.name} • REFRESH FOR NEW`;

    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.FogExp2(0x050510, 0.008);
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 2, 12);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const ambientLight = new THREE.AmbientLight(0x111122);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00aaff, 0.8);
    pointLight.position.set(3, 5, 4);
    scene.add(pointLight);
    const backLight = new THREE.PointLight(0xff44ff, 0.5);
    backLight.position.set(-2, 1, -5);
    scene.add(backLight);
    
    const geom = selected.create();
    const mat = new THREE.MeshStandardMaterial({ color: selected.color, emissive: selected.emissive, roughness: 0.3, metalness: 0.7 });
    const primaryMesh = new THREE.Mesh(geom, mat);
    scene.add(primaryMesh);
    
    const wireframeGeo = new THREE.IcosahedronGeometry(1.9, 0);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x00ccff, wireframe: true, transparent: true, opacity: 0.2 });
    const wireSphere = new THREE.Mesh(wireframeGeo, wireMat);
    scene.add(wireSphere);
    
    const particlesCount = 1400;
    const positions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
        positions[i*3] = (Math.random() - 0.5) * 200;
        positions[i*3+1] = (Math.random() - 0.5) * 100;
        positions[i*3+2] = (Math.random() - 0.5) * 80 - 40;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMesh = new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: 0x44aaff, size: 0.1, blending: THREE.AdditiveBlending }));
    scene.add(particlesMesh);
    
    const gridHelper = new THREE.GridHelper(30, 40, 0x0ff, 0x3366aa);
    gridHelper.position.y = -2.5;
    gridHelper.material.opacity = 0.35;
    scene.add(gridHelper);
    
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.008;
        primaryMesh.rotation.x = time * 0.5;
        primaryMesh.rotation.y = time * 0.7;
        wireSphere.rotation.x = time * 0.2;
        wireSphere.rotation.y = time * 0.3;
        particlesMesh.rotation.y = time * 0.02;
        camera.position.x += (0 - camera.position.x) * 0.03;
        camera.lookAt(0, 0.5, 0);
        renderer.render(scene, camera);
    }
    animate();
    
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function initInteractivity() {
    // Contact button
    document.getElementById('contactBtn')?.addEventListener('click', () => {
        alert(`[🔐 ENCRYPTED]\n📧 Email: ${config?.personal.email}\n💼 LinkedIn: linkedin.com/in/amal-chand\n🕸️ GitHub: CipherNexus-ops`);
    });
    
    // Resume button
    document.getElementById('resumeBtn')?.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = 'cv.pdf';
        a.download = 'Amal_Chand_CV.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => {
            if (!a.download) alert("Resume file not found. Email me directly for CV.");
        }, 500);
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.skill-card, .project-card');
    document.addEventListener('mousemove', (e) => {
        const mx = e.clientX / window.innerWidth;
        const my = e.clientY / window.innerHeight;
        cards.forEach(c => {
            const rect = c.getBoundingClientRect();
            const dx = (mx - (rect.left + rect.width/2) / window.innerWidth) * 10;
            const dy = (my - (rect.top + rect.height/2) / window.innerHeight) * 8;
            c.style.transform = `perspective(800px) rotateX(${dy * -0.5}deg) rotateY(${dx * 0.5}deg) translateY(-4px)`;
        });
    });
    cards.forEach(c => c.addEventListener('mouseleave', () => c.style.transform = ''));
    
    // Glitch effect
    const glitchElements = document.querySelectorAll('h1, .section-title, .logo');
    setInterval(() => {
        if (Math.random() > 0.85) {
            glitchElements.forEach(el => {
                el.style.textShadow = '2px 0 cyan, -2px 0 magenta';
                setTimeout(() => el.style.textShadow = '', 120);
            });
        }
    }, 3000);
}

// Start the app
loadConfig();