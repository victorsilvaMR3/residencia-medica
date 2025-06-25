// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Projeto carregado com sucesso!');
    
    // Adiciona efeitos interativos aos cards
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        // Adiciona efeito de clique
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Adiciona efeito de hover com sombra
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
    
    // Função para mostrar a data e hora atual
    function updateDateTime() {
        const now = new Date();
        const dateTimeString = now.toLocaleString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        // Se houver um elemento para mostrar a data/hora, atualiza
        const dateTimeElement = document.getElementById('datetime');
        if (dateTimeElement) {
            dateTimeElement.textContent = dateTimeString;
        }
    }
    
    // Atualiza a data/hora a cada segundo
    setInterval(updateDateTime, 1000);
    updateDateTime(); // Executa imediatamente
    
    // Adiciona funcionalidade de tema escuro/claro
    function toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Carrega o tema salvo
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    }
    
    // Adiciona botão de alternar tema se não existir
    if (!document.getElementById('theme-toggle')) {
        const themeButton = document.createElement('button');
        themeButton.id = 'theme-toggle';
        themeButton.innerHTML = '🌙';
        themeButton.className = 'theme-toggle-btn';
        themeButton.onclick = toggleTheme;
        
        // Adiciona estilos para o botão
        const style = document.createElement('style');
        style.textContent = `
            .theme-toggle-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.9);
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 20px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                z-index: 1000;
            }
            
            .theme-toggle-btn:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            }
            
            [data-theme="dark"] .theme-toggle-btn {
                background: rgba(0, 0, 0, 0.8);
                color: white;
            }
            
            [data-theme="dark"] {
                background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            }
            
            [data-theme="dark"] .header,
            [data-theme="dark"] .card,
            [data-theme="dark"] .footer {
                background: rgba(0, 0, 0, 0.8);
                color: #ecf0f1;
            }
            
            [data-theme="dark"] .header h1 {
                background: linear-gradient(45deg, #3498db, #9b59b6);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            [data-theme="dark"] .card h2 {
                color: #3498db;
            }
            
            [data-theme="dark"] .card li::before {
                color: #3498db;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(themeButton);
    }
    
    // Adiciona mensagem de boas-vindas
    setTimeout(() => {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: rgba(255, 255, 255, 0.95);
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                font-size: 14px;
                z-index: 1000;
                animation: slideIn 0.5s ease;
            ">
                👋 Projeto iniciado com sucesso! 
                <button onclick="this.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: #667eea;
                    cursor: pointer;
                    margin-left: 10px;
                    font-size: 16px;
                ">✕</button>
            </div>
        `;
        
        const slideInStyle = document.createElement('style');
        slideInStyle.textContent = `
            @keyframes slideIn {
                from { transform: translateX(-100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(slideInStyle);
        document.body.appendChild(welcomeMessage);
        
        // Remove a mensagem automaticamente após 5 segundos
        setTimeout(() => {
            if (welcomeMessage.parentElement) {
                welcomeMessage.remove();
            }
        }, 5000);
    }, 1000);
}); 