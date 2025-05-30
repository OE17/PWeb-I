// Otimização de performance com RequestAnimationFrame
const RAF = {
    callbacks: new Set(),
    tick: function(time) {
        this.callbacks.forEach(callback => callback(time));
        requestAnimationFrame(time => this.tick(time));
    },
    init: function() {
        requestAnimationFrame(time => this.tick(time));
    },
    add: function(callback) {
        this.callbacks.add(callback);
    },
    remove: function(callback) {
        this.callbacks.delete(callback);
    }
};

// Criação do campo estelar otimizado
function createStarField() {
    const layers = {
        near: { stars: 100, speed: 0.5, size: { min: 1, max: 3 }, z: { min: 0, max: 100 } },
        mid: { stars: 200, speed: 0.3, size: { min: 1, max: 2 }, z: { min: 100, max: 200 } },
        far: { stars: 300, speed: 0.1, size: { min: 1, max: 1.5 }, z: { min: 200, max: 300 } }
    };

    Object.entries(layers).forEach(([depth, config]) => {
        const layer = document.getElementById(`stars-${depth}`);
        const stars = new Array(config.stars).fill(null).map(() => {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Configuração inicial da estrela
            const size = config.size.min + Math.random() * (config.size.max - config.size.min);
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            
            // Posição inicial
            star.x = Math.random() * 100;
            star.y = Math.random() * 100;
            star.z = config.z.min + Math.random() * (config.z.max - config.z.min);
            
            updateStarPosition(star);
            layer.appendChild(star);
            return star;
        });

        // Animação otimizada das estrelas
        RAF.add(time => {
            stars.forEach(star => {
                star.z -= config.speed;
                if (star.z < config.z.min) {
                    star.z = config.z.max;
                    star.x = Math.random() * 100;
                    star.y = Math.random() * 100;
                }
                updateStarPosition(star);
            });
        });
    });
}

function updateStarPosition(star) {
    star.style.transform = `translate3d(${star.x}%, ${star.y}%, ${star.z}px)`;
}

// Criação das partículas de luz
function createLightParticles() {
    const container = document.querySelector('.light-particles');
    const numberOfParticles = 100;

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Tamanho aleatório
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Posição aleatória
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Animação personalizada
        const duration = 5 + Math.random() * 10;
        const delay = Math.random() * 5;
        
        particle.style.animation = `
            float ${duration}s ${delay}s linear infinite,
            glow ${2 + Math.random() * 2}s ease-in-out infinite alternate
        `;
        
        container.appendChild(particle);
    }
}

// Efeito de explosão na nebulosa otimizado
function addNebulaEffect() {
    const nebula = document.querySelector('.nebula');
    let time = 0;

    RAF.add(() => {
        time += 0.01;
        const scale = 0.8 + Math.sin(time) * 0.2;
        nebula.style.transform = `translate(-50%, -50%) scale(${scale})`;
    });
}

// Efeito de parallax otimizado
function addParallaxEffect() {
    const container = document.querySelector('.container');
    const nebula = document.querySelector('.nebula');
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    });

    RAF.add(() => {
        // Interpolação suave
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        container.style.transform = `
            translate3d(${currentX * 20}px, ${currentY * 20}px, 0)
            rotateX(${-currentY * 5}deg)
            rotateY(${currentX * 5}deg)
        `;

        nebula.style.transform = `
            translate(-50%, -50%)
            translate3d(${currentX * 30}px, ${currentY * 30}px, 0)
        `;
    });
}

// Efeito do prisma otimizado
function addPrismEffect() {
    const prism = document.querySelector('.prism');
    const spectrum = document.querySelector('.spectrum');
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;

    window.addEventListener('mousemove', (e) => {
        const rect = prism.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    });

    RAF.add(() => {
        // Interpolação suave
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        prism.style.transform = `
            rotateY(${currentX * 20}deg)
            rotateX(${-currentY * 20}deg)
            translateZ(50px)
            scale3d(1.05, 1.05, 1.05)
        `;

        spectrum.style.transform = `
            perspective(1000px)
            rotateX(${30 + currentY * 10}deg)
            translateZ(${100 + Math.abs(currentX) * 50}px)
        `;
    });
}

// Efeito de ondulação no espectro
function addSpectrumWaveEffect() {
    const spectrum = document.querySelector('.spectrum');
    let wave = 0;

    function animate() {
        wave += 0.02;
        const sin = Math.sin(wave);
        const cos = Math.cos(wave / 2);
        
        spectrum.style.transform = `
            perspective(1000px) 
            rotateX(${30 + sin * 5}deg) 
            translateZ(${100 + cos * 30}px)
            scaleY(${1 + sin * 0.1})
        `;
        
        requestAnimationFrame(animate);
    }

    animate();
}

// Efeito de pulso no botão
function addButtonPulseEffect() {
    const button = document.querySelector('button');
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-2px) scale(1.05)';
        button.style.boxShadow = '0 5px 30px rgba(255, 41, 117, 0.6)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
        button.style.boxShadow = '';
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    RAF.init();
    createStarField();
    createLightParticles();
    addNebulaEffect();
    addParallaxEffect();
    addPrismEffect();
    addSpectrumWaveEffect();
    addButtonPulseEffect();
});

// Código do login com feedback visual aprimorado
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = document.getElementById('loginForm');
    const button = form.querySelector('button');
    const mensagem = document.getElementById('mensagem');
    
    // Efeito de loading no botão
    button.innerHTML = '<span class="loading">Entrando...</span>';
    button.disabled = true;
    
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: document.getElementById('email').value,
                senha: document.getElementById('senha').value
            })
        });

        const data = await response.json();

        if (response.ok) {
            mensagem.style.color = '#4CAF50';
            mensagem.textContent = 'Login realizado com sucesso!';
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('nivel_acesso', data.nivel_acesso);

            // Efeito de fade out suave com aceleração de hardware
            document.querySelector('.container').style.transform += ' scale(0.95)';
            document.querySelector('.container').style.opacity = '0';

            setTimeout(() => {
                window.location.href = data.nivel_acesso === 'admin' ? '/admin.html' : '/usuario.html';
            }, 1000);
        } else {
            mensagem.style.color = '#f44336';
            mensagem.textContent = data.error || 'Erro ao fazer login';
            
            // Efeito de shake otimizado
            form.style.animation = 'none';
            form.offsetHeight; // Force reflow
            form.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97)';
        }
    } catch (error) {
        mensagem.style.color = '#f44336';
        mensagem.textContent = 'Erro ao conectar ao servidor';
    } finally {
        button.innerHTML = 'Entrar';
        button.disabled = false;
    }
}); 