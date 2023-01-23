(() => {
    const canvas = document.getElementById('background');
    const context = canvas.getContext('2d');
    //nové objekty pro výšku a šířku
    const width = window.innerWidth;
    const height = window.innerHeight;
    //počet hvězd na pozadí, kdy se náhodně vygenerují
    const numberOfStars = 50;
    const random = (min, max) => Math.random() * (max - min) + min;

    canvas.width = width;
    canvas.height = height;

    //vykreslí pozadí
    const drawBackground = () => {
        //vytváří lineární přechod barev na pozadí 
        const background = context.createLinearGradient(0, 0, 0, height);
        //barvy, které jsou vykresleny
        background.addColorStop(0, '#000B27');
        background.addColorStop(1, '#7FFFD4');
    
        context.fillStyle = background;
        context.fillRect(0, 0, width, height);
    };

    //vykreslí popředí
    const drawForeground = () => {
        context.fillStyle = '#0C1D2D';
        context.fillRect(0, height * .95, width, height);
    
        context.fillStyle = '#182746';
        context.fillRect(0, height * .955, width, height);
    };
    //vykreslí čarodějův obrázek, který je ve složce 
    const drawWizard = () => {
        const image = new Image();
        image.src = './img2/wizard.png';
        
        image.onload = function () {
            /**
             * toto je odkaz na obrázek
             * vykresluje na 90% šířky pozadí - šířka obrazu
             * vykresluje na 95% výšky pozadí - výška obrazu 
             */
            context.drawImage(this, (width * .9) - this.width, (height * .95) - this.height);
        };
    };
    //vykreslí hvězdy
    const drawStars = () => {
        //proměnná pro počet hvězd
        let starCount = numberOfStars;

        context.fillStyle = '#FFF';

        while (starCount--) {
            const x = random(25, width - 50);
            const y = random(25, height * .5);
            const size = random(1, 5);

            context.fillRect(x, y, size, size);
        }
    };

    drawBackground();
    drawForeground();
    drawWizard();
    drawStars();
})();