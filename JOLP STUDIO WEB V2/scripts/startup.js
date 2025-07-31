#!/usr/bin/env node

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

const logo = `
${colors.cyan}   ╔══════════════════════════════════════╗
   ║           🎮 JOLP STUDIO 🎮          ║
   ║     O Culto das Asas Brancas        ║
   ╚══════════════════════════════════════╝${colors.reset}
`;

const messages = [
  `${colors.yellow}🔥 Inicializando o site da JOLP Studio...${colors.reset}`,
  `${colors.green}⚡ Carregando assets do jogo...${colors.reset}`,
  `${colors.magenta}🚀 Preparando a experiência épica...${colors.reset}`,
  `${colors.cyan}🎯 Conectando com os servidores...${colors.reset}`,
  `${colors.bright}${colors.yellow}🎉 IIIIRUUUU! Site pronto para decolar! kkkkkk${colors.reset}`,
  `${colors.green}✅ Tudo pronto! Abrindo o portal... 🌟${colors.reset}`
];

const animateText = async (text, delay = 50) => {
  for (let char of text) {
    process.stdout.write(char);
    await sleep(delay);
  }
  console.log('');
};

const showLoadingBar = async () => {
  const bar = '█'.repeat(20);
  const emptyBar = '░'.repeat(20);
  
  process.stdout.write(`${colors.cyan}Progresso: [${colors.reset}`);
  
  for (let i = 0; i <= 20; i++) {
    const filled = '█'.repeat(i);
    const empty = '░'.repeat(20 - i);
    const percentage = Math.round((i / 20) * 100);
    
    process.stdout.write(`\r${colors.cyan}Progresso: [${colors.green}${filled}${colors.dim}${empty}${colors.reset}${colors.cyan}] ${percentage}%${colors.reset}`);
    await sleep(100);
  }
  console.log('\n');
};

async function startup() {
  console.clear();
  console.log(logo);
  
  await sleep(500);
  
  for (let message of messages.slice(0, -2)) {
    await animateText(message, 30);
    await sleep(400);
  }
  
  await showLoadingBar();
  
  for (let message of messages.slice(-2)) {
    await animateText(message, 20);
    await sleep(300);
  }
  
  console.log(`${colors.bright}${colors.green}🎮 Bora jogar! Site rodando na porta 3000! 🎮${colors.reset}\n`);
}

startup().catch(console.error); 