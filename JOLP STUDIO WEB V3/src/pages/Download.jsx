import { useState } from 'react';
import './Download.css';
import downloadIcon from '../assets/download-icon.svg';
import personImage from '../assets/PersonTelaDown2.png';

function Download() {
  const [activeTab, setActiveTab] = useState('windows');

  return (
    <div className="download">
      <div className="download-container">
        <div className="download-content">
          <div className="character-section">
            <img 
              src={personImage} 
              alt="Personagem do jogo O Culto das Asas Brancas" 
              className="character-image" 
              loading="lazy"
              decoding="async"
            />
            <div className="message-box">
              <div className="message-content">
                <p>Veio baixar o jogo? Massa! Quer dizer... Por mim tanto faz.</p>
              </div>
            </div>
          </div>
          
          <div className="download-box">
            <div className="platform-tabs">
              <button 
                className={`platform-tab ${activeTab === 'windows' ? 'active' : ''}`}
                onClick={() => setActiveTab('windows')}
              >
                Windows
              </button>
              <button 
                className={`platform-tab ${activeTab === 'linux' ? 'active' : ''}`}
                onClick={() => setActiveTab('linux')}
              >
                Linux
              </button>
              <button 
                className={`platform-tab ${activeTab === 'mac' ? 'active' : ''}`}
                onClick={() => setActiveTab('mac')}
              >
                Mac
              </button>
            </div>

            <div className="download-links">
              {activeTab === 'windows' && (
                <>
                  <a href="#" className="download-link">
                    <span>O Culto das Asas Brancas-0.03.zip</span>
                    <img src={downloadIcon} alt="Download" className="download-icon" />
                  </a>
                  <a href="#" className="download-link">
                    <span>O Culto das Asas Brancas-0.02.zip</span>
                    <img src={downloadIcon} alt="Download" className="download-icon" />
                  </a>
                </>
              )}
              
              {activeTab === 'linux' && (
                <p className="coming-soon">Em breve</p>
              )}
              
              {activeTab === 'mac' && (
                <p className="coming-soon">Em breve</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Download; 