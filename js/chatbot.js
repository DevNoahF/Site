// ARQUIVO: js/chatbot.js

class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox'),
            sendButton: document.querySelector('.chatbox__send--footer'),
            // 1. SELECIONE O NOVO BOTÃO DE FECHAR
            closeButton: document.querySelector('.chatbox__close-button') 
        }

        this.state = false;
        this.messages = [];
    }

    display() {
        const { openButton, chatBox, sendButton, closeButton } = this.args; // Adicione closeButton aqui

        openButton.addEventListener('click', () => this.toggleState(chatBox));
        
        // 2. ADICIONE O EVENTO DE CLIQUE PARA FECHAR O CHAT
        closeButton.addEventListener('click', () => this.toggleState(chatBox));

        // O resto do código continua igual...
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));
        const inputField = chatBox.querySelector('input');
        inputField.addEventListener('keyup', (event) => {
            if (event.key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }





    toggleState(chatbox) {
        this.state = !this.state;
        // Adiciona/remove a classe do container principal '.chatbox'
        chatbox.classList.toggle('chatbox--active', this.state);
    }

    onSendButton(chatbox) {
        // A busca pelo input agora parte do chatbox (o container)
        const inputField = chatbox.querySelector('input');
        const message = inputField.value.trim(); // Usar .trim() para remover espaços em branco
        if (message === "") return;

        // Adiciona a mensagem do usuário
        let userMessage = { name: "Usuário", message: message };
        this.messages.push(userMessage);
        this.updateChatText(chatbox);
        inputField.value = "";

        // Envia a mensagem para o backend
        // ATENÇÃO: Verifique se este é o endereço correto do seu backend (Flask/Python)
        fetch("http://127.0.0.1:5000/chat", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            for (let msg of data) {
                this.messages.push({ name: "Bot", message: msg.text });
            }
            this.updateChatText(chatbox);
        })
        .catch((error) => {
            console.error('Erro:', error);
            this.messages.push({ name: "Bot", message: "Desculpe, houve um erro de conexão." });
            this.updateChatText(chatbox);
        });
    }

    updateChatText(chatbox) {
        let html = '';
        this.messages.slice().reverse().forEach(function (msg) {
            if (msg.name === "Bot") {
                html += `<div class="messages__item messages__item--visitor">${msg.message}</div>`;
            } else {
                html += `<div class="messages__item messages__item--operator">${msg.message}</div>`;
            }
        });

        // A busca pela área de mensagens também parte do chatbox
        const chatMessage = chatbox.querySelector('.chatbox__messages');
        chatMessage.innerHTML = html;
    }
}

const chatbox = new Chatbox();
chatbox.display();