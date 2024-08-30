import './App.css';
import { useEffect, useRef } from 'react';

function App() {
  const canvasRef = useRef(null);
  const lightParticles = useRef([]);
  const bubbles = useRef([]);
  const numLightParticles = 10;
  const numBubbles = 20;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const washerWidth = 200; // 세탁기 문 너비
    const washerHeight = 200; // 세탁기 문 높이
    const centerX = width / 4; // 화면의 좌측 중앙에 위치
    const centerY = height / 2;
    const radius = 90; // 유리 원의 반지름

    // 초기 빛 입자 생성
    function createLightParticles(count) {
      const particles = [];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        particles.push({
          angle: angle,
          speed: 0.003 + Math.random() * 0.006, // 속도 조절
          distance: radius, // 반지름
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          alpha: 0.7 + Math.random() * 0.3 // 초기 알파 값
        });
      }
      lightParticles.current = particles;
    }

    // 빛 입자 업데이트
    function updateLightParticles() {
      lightParticles.current.forEach(particle => {
        particle.angle += particle.speed;
        particle.x = centerX + particle.distance * Math.cos(particle.angle);
        particle.y = centerY + particle.distance * Math.sin(particle.angle);

        // 반짝거리는 효과: 알파 값을 주기적으로 변화
        particle.alpha = 0.7 + 0.3 * Math.sin(Date.now() * 0.005 + particle.angle * 5);
      });
    }

    // 랜덤 색상 생성
    function getRandomColor() {
      const colors = ['#ff6f61', '#ffcccb', '#ffeb3b', '#4caf50', '#00bcd4', '#e91e63'];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    // 거품 생성
    function createBubbles(count) {
      const newBubbles = [];
      for (let i = 0; i < count; i++) {
        newBubbles.push({
          x: Math.random() * width, // 화면의 임의 위치
          y: height + Math.random() * 100, // 화면 아래쪽
          size: 50 + Math.random() * 50, // 크기 (5배 증가)
          speed: 0.5 + Math.random() * 1.5, // 상승 속도
          color: getRandomColor() // 랜덤 색상
        });
      }
      bubbles.current = newBubbles;
    }

    // 거품 업데이트
    function updateBubbles() {
      bubbles.current.forEach(bubble => {
        bubble.y -= bubble.speed; // 위로 이동

        // 화면 위쪽을 넘어가면 다시 아래로 생성
        if (bubble.y + bubble.size < 0) {
          bubble.x = Math.random() * width;
          bubble.y = height + Math.random() * 100;
          bubble.size = 50 + Math.random() * 50; // 크기 (5배 증가)
          bubble.speed = 0.5 + Math.random() * 1.5;
          bubble.color = getRandomColor(); // 랜덤 색상
        }
      });
    }

    // 세탁기 문 그리기
    function drawWasher() {
      const outerRingGradient = ctx.createRadialGradient(centerX, centerY, 100, centerX, centerY, 130);
      outerRingGradient.addColorStop(0, '#A9A9A9');
      outerRingGradient.addColorStop(1, '#4F4F4F'); // 어두운 회색

      ctx.beginPath();
      ctx.arc(centerX, centerY, 130, 0, 2 * Math.PI);
      ctx.fillStyle = outerRingGradient;
      ctx.fill();

      // 외부 링의 반사 효과
      ctx.beginPath();
      ctx.arc(centerX - 60, centerY - 60, 90, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fill();

      // 내부 링 (검은 계열)
      const innerRingGradient = ctx.createRadialGradient(centerX, centerY, 70, centerX, centerY, 120);
      innerRingGradient.addColorStop(0, '#1C1C1C'); // 매우 어두운 회색
      innerRingGradient.addColorStop(1, '#000000'); // 검은색

      ctx.beginPath();
      ctx.arc(centerX, centerY, 120, 0, 2 * Math.PI);
      ctx.fillStyle = innerRingGradient;
      ctx.fill();

      // 내부 링의 미세한 하이라이트
      ctx.beginPath();
      ctx.arc(centerX, centerY, 115, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 유리 부분 그리기
    function drawGlass() {
      const glassGradient = ctx.createRadialGradient(centerX, centerY, 50, centerX, centerY, 90);
      glassGradient.addColorStop(0, 'rgba(173, 216, 230, 0.5)'); // 밝은 파란색
      glassGradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)'); // 어두운 투명한 색

      ctx.beginPath();
      ctx.arc(centerX, centerY, 90, 0, 2 * Math.PI);
      ctx.fillStyle = glassGradient;
      ctx.fill();

      // 유리의 윤곽선
      ctx.beginPath();
      ctx.arc(centerX, centerY, 90, 0, 2 * Math.PI);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 4;
      ctx.stroke();

      // 유리의 디테일한 반사광
      ctx.beginPath();
      ctx.moveTo(centerX - 20, centerY - 40);
      ctx.bezierCurveTo(centerX + 40, centerY - 70, centerX + 50, centerY + 80, centerX - 20, centerY + 30);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // 빛 입자 그리기
    function drawLightParticles() {
      lightParticles.current.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
        ctx.fill();
      });
    }

    // 비눗방울 그리기
    function drawBubbles() {
      bubbles.current.forEach(bubble => {
        // 비눗방울의 외곽을 투명하게 표현
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${hexToRgb(bubble.color).r}, ${hexToRgb(bubble.color).g}, ${hexToRgb(bubble.color).b}, 0.4)`; // 투명 색상
        ctx.fill();
        
        // 비눗방울의 하이라이트를 추가하여 광택 효과
        const highlightSize = bubble.size / 3;
        const highlightX = bubble.x - bubble.size / 4;
        const highlightY = bubble.y - bubble.size / 4;

        ctx.beginPath();
        ctx.arc(highlightX, highlightY, highlightSize, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'; // 하이라이트 색상
        ctx.fill();
      });
    }

    // HEX 색상 값을 RGB로 변환하는 함수
    function hexToRgb(hex) {
      let r = 0, g = 0, b = 0;
      // 3자리 HEX
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      }
      // 6자리 HEX
      else if (hex.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
      }
      return { r, g, b };
    }

    // 로고 텍스트 그리기
    function drawLogo() {
      ctx.font = 'bold 200px Arial'; // 텍스트 폰트 및 크기 설정
      ctx.fillStyle = '#ffffff'; // 텍스트 색상 설정
      ctx.textAlign = 'left'; // 텍스트 정렬 설정
      ctx.textBaseline = 'middle'; // 텍스트 베이스라인 설정

      const logoText = 'DiTakSo.';
      const textX = centerX + washerWidth + 40; // 세탁기 문 오른쪽
      const textY = centerY; // 세탁기 문 중앙 높이

      // 텍스트 그라디언트
      const gradient = ctx.createLinearGradient(textX - 100, textY - 60, textX + 100, textY + 60);
      gradient.addColorStop(0, '#ff6f61');
      gradient.addColorStop(1, '#ffcccb');

      ctx.fillStyle = gradient; // 그라디언트 색상
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)'; // 외곽선 색상
      ctx.lineWidth = 10; // 외곽선 두께
      ctx.strokeText(logoText, textX, textY);

      // 텍스트를 그라디언트로 채우기
      ctx.fillText(logoText, textX, textY);
    }

    // 애니메이션 루프
    function animate() {
      ctx.clearRect(0, 0, width, height); // 캔버스 지우기

      drawWasher(); // 세탁기 문 그리기
      drawGlass();  // 유리 그리기
      drawLightParticles(); // 빛 입자 그리기
      drawBubbles(); // 거품 그리기
      drawLogo(); // 로고 텍스트 그리기

      updateLightParticles(); // 빛 입자 업데이트
      updateBubbles(); // 거품 업데이트

      requestAnimationFrame(animate);
    }

    // 초기화
    createLightParticles(numLightParticles);
    createBubbles(numBubbles);
    animate();

    // 컴포넌트 언마운트 시 정리
    return () => {
      lightParticles.current = [];
      bubbles.current = [];
    };

  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}

export default App;