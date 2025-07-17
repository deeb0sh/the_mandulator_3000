<template>
    <div class="karta">
        <img src="../img/karta.png" width="450">
        
        <div class="ru">
            <img src="../img/rus1.png" width="20">
        </div>
        <div class="de">
            <img src="../img/ger1.png" width="20">
        </div>
        <div class="fi">
            <img src="../img/fin1.png" width="20">
        </div>
        <canvas ref="electricCanvas" class="electric-lines"></canvas>
        <!-- <canvas ref="lineCanvas" class="connections"></canvas> -->
    </div>
    
</template>

<script>
export default {
  mounted() {
        this.setupElectricLines();
  },
  methods: {
    setupElectricLines() {
        const canvas = this.$refs.electricCanvas;
        const ctx = canvas.getContext('2d');
        canvas.width = 450;
        canvas.height = 401;
        const points = {
            ru: { x: 310, y: 150 },
            fi: { x: 236, y: 102 },
            de: { x: 147, y: 206 }
        };
        const lines = [
            { start: points.ru, end: points.fi },
            { start: points.fi, end: points.de },
            { start: points.ru, end: points.de }
        ];
        const allLines = lines.map(line => {
            const segments = 20;
            let points = [];
            for (let i = 0; i <= segments; i++) {
                points.push({
                    x: line.start.x + (line.end.x - line.start.x) * (i / segments),
                    y: line.start.y + (line.end.y - line.start.y) * (i / segments),
                    noiseX: 0,
                    noiseY: 0
                });
            }
            return points;
        });
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            allLines.forEach(points => {
                points.forEach(point => {
                    point.noiseX = (Math.random() - 0.5) * 3;
                    point.noiseY = (Math.random() - 0.5) * 3;
                });
                ctx.beginPath();
                ctx.moveTo(points[0].x + points[0].noiseX, 
                          points[0].y + points[0].noiseY);                
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(
                        points[i].x + points[i].noiseX,
                        points[i].y + points[i].noiseY
                    );
                }
                ctx.strokeStyle = '#00f2f2';
                ctx.lineWidth = 0.5;
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#00f2f2';
                ctx.stroke();
            });

            requestAnimationFrame(animate);
        };

        animate();
    }
 }
}
</script>

<style scoped>
/* * {
    border: red 1px solid;
} */
.karta {
    position: relative; 
    display: flex;
    justify-content: center;
    align-items: center;
    width: 450px;
    margin: 0 auto;
}
@keyframes glow {
    0% { filter: drop-shadow(0 0 5px #00f2f2); }
    50% { filter: drop-shadow(0 0 15px #00f2f2); }
    100% { filter: drop-shadow(0 0 5px #00f2f2); }
}
.electric-lines {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none; /* Чтобы клики проходили сквозь canvas */
}
.ru {
    position: absolute;
    z-index: 10;
    top: 140px;
    left: 300px;
}
.ru img {
    animation: glow 2s infinite;
} 
.de {
    position: absolute;
    z-index: 10;
    top: 194px;
    left: 140px;
}
.de img {
    animation: glow 2s infinite;
}
.fi {
    position: absolute;
    z-index: 10;
    top: 95px;
    left: 228px
}
.fi img {
    animation: glow 2s infinite;
}

@media (max-width:470px ){

}
</style>