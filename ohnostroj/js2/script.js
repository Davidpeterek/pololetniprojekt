(() => {
    //nové objekty
    const canvas = document.getElementById('firework');
    const context = canvas.getContext('2d');
    //onjekt pro šířku, který jí poté vrací
    const width = window.innerWidth;
    //onjekt pro výšku, který jí poté vrací
    const height = window.innerHeight;
    //nastavení pozice
    const positions = {
        mouseX: 0,
        mouseY: 0,
        wandX: 0,
        wandY: 0
    };

    const fireworks = [];
    const particles = [];
    // čím více objektů tím menší výkon
    const numberOfParticles = 50; 

    const random = (min, max) => Math.random() * (max - min) + min;
    //spočítání vzdálenosti 
    const getDistance = (x1, y1, x2, y2) => {
        //vypočítání vzdálenosti x
        const xDistance = x1 - x2;
        //vypočítání vzdálenosti y
        const yDistance = y1 - y2;

        return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
    };

    const image = new Image();

    let mouseClicked = false;
    
    canvas.width = width;
    canvas.height = height;
    
    image.src = './img2/hulka.png';
    //objekt pro vykreslení hůlky
    const drawWand = () => {
        //nastavení pozice pro hůlku, ze které odčítáme šířku a výšku 
        positions.wandX = (width * .91) - image.width;
        positions.wandY = (height * .93) - image.height;

        const rotationInRadians = Math.atan2(positions.mouseY - positions.wandY, positions.mouseX - positions.wandX) - Math.PI;
        const rotationInDegrees = (rotationInRadians * 180 / Math.PI) + 360;
        
        context.clearRect(0, 0, width, height);
        
        // zde se uloží kontex pro pozdější odebrání transformace
        context.save();
        context.translate(positions.wandX, positions.wandY);
        
        if (rotationInDegrees > 0 && rotationInDegrees < 90) {
            context.rotate(rotationInDegrees * Math.PI / 180);
        } else if (rotationInDegrees > 90 && rotationInDegrees < 275) {
            context.rotate(90 * Math.PI / 180);
        }

        context.drawImage(image, -image.width, -image.height / 2);

    
        context.restore();
    };
    //funkce pro používání myši na stránce
    const attachEventListeners = () => {
        canvas.addEventListener('mousemove', e => {
            positions.mouseX = e.pageX;
            positions.mouseY = e.pageY;
        });

        canvas.addEventListener('mousedown', () => mouseClicked = true);
        canvas.addEventListener('mouseup', () => mouseClicked = false);
    };
    //opakování animace a vykreslení hůlky
    const loop = () => {
        requestAnimationFrame(loop);
        drawWand();
        //jestliže klikneme pomocí myši objeví se nový ohnostroj
        if (mouseClicked) {
            fireworks.push(new Firework());
        }
        
        let fireworkIndex = fireworks.length;
        while(fireworkIndex--) {
            fireworks[fireworkIndex].draw(fireworkIndex);
        }

        let particleIndex = particles.length;
        while(particleIndex--) {
            particles[particleIndex].draw(particleIndex);
        }
        
    };

    image.onload = () => {
        attachEventListeners();
        loop();
    }
    //funkce pro ohnostroj kde získáváme vzdálenost, pozici
    function Firework() {
        const init = () => {
            //délka ohnostroje
            let fireworkLength = 10;
            //proměnné pro pozice hůlky a myši
            this.x = positions.wandX;
            this.y = positions.wandY;
            this.tx = positions.mouseX;
            this.ty = positions.mouseY;

            this.distanceToTarget = getDistance(positions.wandX, positions.wandY, this.tx, this.ty);
            this.distanceTraveled = 0;

            this.coordinates = [];
            this.angle = Math.atan2(this.ty - positions.wandY, this.tx - positions.wandX);
            this.speed = 20;
            this.friction = .99;
            this.hue = random(0, 360);

            while (fireworkLength--) {
                this.coordinates.push([this.x, this.y]);
            }
        };
        //animace pro ohnostroj 
        this.animate = index => {
            //pomocí této funkce posunujeme emlementy
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);

            this.speed *= this.friction;
            //vrací cosinus čísla v radiánech
            let vx = Math.cos(this.angle) * this.speed;
            //vrací sinus čísla v radiánech
            let vy = Math.sin(this.angle) * this.speed;

            this.distanceTraveled = getDistance(positions.wandX, positions.wandY, this.x + vx, this.y + vy);
            
            if(this.distanceTraveled >= this.distanceToTarget) {
                let i = numberOfParticles;
        
                while(i--) {
                    particles.push(new Particle(this.tx, this.ty));
                }

                fireworks.splice(index, 1);
            } else {
                this.x += vx;
                this.y += vy;
            }
        }

        this.draw = index => {
            //metoda beginPath začíná, nebo restartuje cestu
            context.beginPath();
            context.moveTo(this.coordinates[this.coordinates.length - 1][0],
                           this.coordinates[this.coordinates.length - 1][1]);
            context.lineTo(this.x, this.y);

            context.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
            context.stroke();

            this.animate(index);
        }

        init();
    }
    
    function Particle(x, y) {
        const init = () => {
            let particleLength = 7;
            //objekty x, y
            this.x = x;
            this.y = y;
            //posunutí objektů
            this.coordinates = [];
            //nastavení úhlu
            this.angle = random(0, Math.PI * 2);
            //rychlost od 1 do 10
            this.speed = random(1, 10);

            this.friction = 0.95;
            //gravitace nastavená na dvojku
            this.gravity = 3;
            //objekt odstín nastaven na random od 0 do 240
            this.hue = random(0, 240);
            this.alpha = 1;
            this.decay = random(.015, .03);

            while(particleLength--) {
                this.coordinates.push([this.x, this.y]);
            }
        };

        this.animate = index => {
            this.coordinates.pop();
            this.coordinates.unshift([this.x, this.y]);

            this.speed *= this.friction;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            //objekt alpha s objektem decay
            this.alpha -= this.decay;
            
            if (this.alpha <= this.decay) {
                particles.splice(index, 1);
            }
        }
        //vykreslí index
        this.draw = index => {
            //metoda beginPath začíná, nebo restartuje cestu
            context.beginPath();
            context.moveTo(this.coordinates[this.coordinates.length - 1][0],
                           this.coordinates[this.coordinates.length - 1][1]);
            context.lineTo(this.x, this.y);

            context.strokeStyle = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
            context.stroke();

            this.animate(index);
        }

        init();
    }
})();