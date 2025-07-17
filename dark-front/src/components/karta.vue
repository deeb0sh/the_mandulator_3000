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
        <canvas ref="signalCanvas" class="signal-lines"></canvas>
    </div>
</template>

<script>
export default {
  mounted() {
    this.setupSignalAnimation();
  },
  methods: {
    setupSignalAnimation() {
      const canvas = this.$refs.signalCanvas;
      const ctx = canvas.getContext('2d');
      canvas.width = 450;
      canvas.height = 401;
      
      const points = {
        ru: { x: 310, y: 150 },
        fi: { x: 236, y: 102 },
        de: { x: 147, y: 206 }
      };

      // Настройки анимации
      const config = {
        speed: 0.015,
        dotSize: 1,
        trailLength: 60 // Количество предыдущих позиций для "хвоста"
      };


      const signals = [
        { start: points.ru, end: points.fi, progress: 0, direction: 1, trail: [] },
        { start: points.fi, end: points.de, progress: 0.3, direction: 1, trail: [] },
        { start: points.ru, end: points.de, progress: 0.6, direction: -1, trail: [] }
      ];

      const animate = () => {
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
       
        this.drawStaticLine(ctx, points.ru, points.fi);
        this.drawStaticLine(ctx, points.fi, points.de);
        this.drawStaticLine(ctx, points.ru, points.de);
        
        signals.forEach(signal => {
          this.updateSignal(signal, config);
          this.drawSignal(ctx, signal, config);
        });
        
        requestAnimationFrame(animate);
      };
      
      animate();
    },
    
    drawStaticLine(ctx, start, end) {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = 'rgba(0, 242, 242, 0.15)';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    },
    
    updateSignal(signal, config) {
      // Обновляем позицию
      signal.progress += signal.direction * config.speed;
      
      // Разворачиваем при достижении края
      if (signal.progress >= 1 || signal.progress <= 0) {
        signal.direction *= -1;
      }
      
      // Добавляем текущую позицию в "хвост"
      signal.trail.push({
        x: signal.start.x + (signal.end.x - signal.start.x) * signal.progress,
        y: signal.start.y + (signal.end.y - signal.start.y) * signal.progress,
        alpha: 1 // Начальная прозрачность
      });
      
      // Удаляем старые точки и уменьшаем прозрачность
      signal.trail = signal.trail.slice(-config.trailLength).map(point => ({
        ...point,
        alpha: point.alpha * 0.95 // Коэффициент затухания
      }));
    },
    
    drawSignal(ctx, signal, config) {
      // Рисуем "хвост"
      signal.trail.forEach((point, i) => {
        const size = config.dotSize * (i / signal.trail.length);
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 242, 242, ${point.alpha * 0.5})`;
        ctx.fill();
      });
      
      // Рисуем основную точку
      const mainPoint = signal.trail[signal.trail.length - 1];
      ctx.beginPath();
      ctx.arc(mainPoint.x, mainPoint.y, config.dotSize, 0, Math.PI * 2);
      ctx.fillStyle = '#00f2f2';
      ctx.fill();
    }
  }
}
</script>

<style scoped>
.karta {
    position: relative; 
    display: flex;
    justify-content: center;
    align-items: center;
    width: 450px;
    margin: 0 auto;
}

.signal-lines {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
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

@keyframes glow {
    0% { filter: drop-shadow(0 0 5px #00f2f2); }
    50% { filter: drop-shadow(0 0 15px #00f2f2); }
    100% { filter: drop-shadow(0 0 5px #00f2f2); }
}

@media (max-width:470px ){
    .karta {
        width: 100%;
    }
    .karta img {
        width: 100%;
        height: auto;
    }
    .ru, .de, .fi {
        transform: scale(0.8);
    }
}
</style>