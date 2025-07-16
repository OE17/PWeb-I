import { useState, useEffect, useRef } from 'react';
import './Inicio.css';
import carrosel1 from '../assets/Carrosel1.png';
import carrosel2 from '../assets/Carrosel2.png';
import carrosel3 from '../assets/Carrosel3.png';

function Inicio() {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [carrosel1, carrosel2, carrosel3];
  const titleRef = useRef(null);
  const carouselRef = useRef(null);
  
  // Efeito 3D para o título
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    
    const handleMouseMove = (e) => {
      const { left, top, width, height } = title.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      title.style.transform = `perspective(1000px) rotateX(${y * 5}deg) rotateY(${x * 5}deg)`;
    };
    
    const handleMouseLeave = () => {
      title.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };
    
    title.addEventListener('mousemove', handleMouseMove);
    title.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      title.removeEventListener('mousemove', handleMouseMove);
      title.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  // Efeito 3D para o carrossel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const handleMouseMove = (e) => {
      const { left, top, width, height } = carousel.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;
      
      carousel.style.transform = `perspective(1000px) rotateX(${y * 3}deg) rotateY(${x * 3}deg)`;
    };
    
    const handleMouseLeave = () => {
      carousel.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };
    
    carousel.addEventListener('mousemove', handleMouseMove);
    carousel.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      carousel.removeEventListener('mousemove', handleMouseMove);
      carousel.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="inicio">
      <div className="container">
        <div className="coluna-esquerda">
          <h1 className="titulo" ref={titleRef}>O Culto das Asas Brancas</h1>
          
          <div className="sinopse animated-section">
            <h2>Sinopse</h2>
            <p>
              Desenvolvido pela equipe independente JOLP Studio, <span className="destaque">O Culto das Asas Brancas</span> é um jogo RPG de Aventura e Suspense com um combate por turnos. Nessa aventura vamos acompanhar um jovem brasileiro que acaba de entrar no ensino médio, sendo matriculado numa instituição renomada de Fortaleza ele se depara com diversas bizarrices e uma conspiração sinistra que agora deverá desvendar para salvar sua amiga e superar seus traumas.
            </p>
          </div>

          <div className="proposta animated-section">
            <h2>Proposta do Nosso Jogo</h2>
            <p>
              Ambientado no Brasil em uma versão ficcional de Fortaleza no Ceará, traz consigo uma ambientação leve que progredirá em um clima cada vez mais tenso em um mistério nebuloso enquanto trazemos diversas referências a nossa cultura e cotidiano.
            </p>
          </div>
        </div>
        
        <div className="coluna-direita">
          <div className="carrossel-container" ref={carouselRef}>
            <div className="carrossel-wrapper">
              <img 
                src={images[currentImage]} 
                alt={`Screenshot ${currentImage + 1}`} 
                className="game-image" 
              />
              <button className="controle-prev" onClick={prevImage}>
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M31.25 12.5L18.75 25L31.25 37.5" stroke="#F6FF00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className="controle-next" onClick={nextImage}>
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.75 12.5L31.25 25L18.75 37.5" stroke="#F6FF00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <p className="legenda">Imagens ilustrativas</p>
            </div>
          </div>
          
          <div className="atualizacoes animated-section">
            <h2>Atualizações Recentes V.alpha 1.1</h2>
            <ul>
              <li>Adição de novos personagens</li>
              <li>Adição de novos cenários</li>
              <li>Melhorias no sistema de combate e dificuldade</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inicio; 