class RolePlayApp {
    constructor() {
        this.currentScreen = 'start-screen';
        this.chatStep = 0;
        this.userConfiguration = {
            scenario: null,
            customerProfile: null,
            difficulty: null,
            callDirection: null,
            userProfile: null
        };
        this.conversationHistory = [];
        this.options = null;
        
        this.init();
    }

    async init() {
        await this.loadOptions();
        this.bindEvents();
        this.showScreen('start-screen');
    }

    async loadOptions() {
        try {
            const response = await fetch('options.json');
            this.options = await response.json();
        } catch (error) {
            console.error('Error loading options:', error);
            // Fallback to hardcoded options if file not found
            this.options = {
                scenarios: [
                    {id: "cold_call", name: "Soğuk Arama Senaryosu", description: "Satış temsilcisi, hiç tanımadığı bir potansiyel müşteriyi arayarak sigorta ürünleri hakkında bilgi vermeye çalışıyor."}
                ],
                customer_profiles: [
                    {id: "young_professional", name: "Genç Profesyonel", description: "25-35 yaşlarında, kariyerinin başında veya orta kademesinde çalışan profesyonel."}
                ],
                difficulty_levels: [
                    {id: "easy", name: "Kolay", description: "Temel sorular, sınırlı itiraz; öğrenme odaklı"}
                ],
                call_direction: [
                    {id: "outbound", name: "Sen Müşteriyi Ararsın (Outbound)", description: "Senaryoyu outbound kurgulayarak ilk repliğin satış temsilcisinden geleceğini belirleyin."}
                ]
            };
        }
    }

    bindEvents() {
        // Start screen events
        document.getElementById('upload-file-btn').addEventListener('click', () => this.handleFileUpload());
        document.getElementById('paste-url-btn').addEventListener('click', () => this.toggleUrlInput());
        document.getElementById('process-url-btn').addEventListener('click', () => this.processUrl());
        document.getElementById('start-chat-btn').addEventListener('click', () => this.startChatSetup());
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileSelection(e));

        // CV processing events
        document.getElementById('regenerate-persona-btn').addEventListener('click', () => this.regeneratePersona());
        document.getElementById('start-simulation-btn').addEventListener('click', () => this.startRolePlay());

        // Chat setup events
        document.getElementById('back-to-start-btn').addEventListener('click', () => this.showScreen('start-screen'));

        // Role play events
        document.getElementById('send-message-btn').addEventListener('click', () => this.sendMessage());
        document.getElementById('user-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        document.getElementById('end-roleplay-btn').addEventListener('click', () => this.endRolePlay());
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        document.getElementById(screenId).classList.add('active');
        this.currentScreen = screenId;
    }

    // CV Import Functionality
    handleFileUpload() {
        document.getElementById('file-input').click();
    }

    handleFileSelection(event) {
        const file = event.target.files[0];
        if (file) {
            this.processCVFile(file);
        }
    }

    toggleUrlInput() {
        const urlSection = document.getElementById('url-input-section');
        urlSection.classList.toggle('hidden');
        if (!urlSection.classList.contains('hidden')) {
            document.getElementById('url-input').focus();
        }
    }

    processUrl() {
        const url = document.getElementById('url-input').value;
        if (url) {
            this.processCVFromUrl(url);
        }
    }

    processCVFile(file) {
        this.showProcessingScreen();
        
        // Simulate AI processing
        setTimeout(() => {
            const aiGeneratedPersona = this.generatePersonaFromCV(file.name);
            this.showPersonaPreview(aiGeneratedPersona);
        }, 3000);
    }

    processCVFromUrl(url) {
        this.showProcessingScreen();
        
        // Simulate AI processing
        setTimeout(() => {
            const aiGeneratedPersona = this.generatePersonaFromUrl(url);
            this.showPersonaPreview(aiGeneratedPersona);
        }, 3000);
    }

    showProcessingScreen() {
        this.showScreen('cv-processing-screen');
        
        // Animate progress bar
        const progressFill = document.querySelector('.progress-fill');
        let width = 0;
        const interval = setInterval(() => {
            width += Math.random() * 15;
            if (width >= 100) {
                width = 100;
                clearInterval(interval);
            }
            progressFill.style.width = width + '%';
        }, 200);
    }

    generatePersonaFromCV(fileName) {
        // Simulate AI analysis
        const personas = [
            {
                title: "Mid-level Insurance Professional",
                age: 32,
                characteristics: "Risk-conscious, detail-oriented, experienced with various insurance products",
                scenario: "Seeking additional coverage for growing family",
                difficulty: "Medium"
            },
            {
                title: "Senior Marketing Manager",
                age: 28,
                characteristics: "Tech-savvy, budget-conscious, prefers digital solutions",
                scenario: "First-time insurance buyer, needs comprehensive guidance",
                difficulty: "Easy"
            }
        ];
        
        return personas[Math.floor(Math.random() * personas.length)];
    }

    generatePersonaFromUrl(url) {
        // Simulate AI analysis based on URL type
        if (url.includes('linkedin')) {
            return {
                title: "LinkedIn Professional",
                age: 30,
                characteristics: "Career-focused, networked, values professional relationships",
                scenario: "Referral-based contact, open to business discussions",
                difficulty: "Medium"
            };
        } else {
            return this.generatePersonaFromCV('profile');
        }
    }

    showPersonaPreview(persona) {
        this.showScreen('cv-preview-screen');
        
        const previewElement = document.getElementById('persona-preview');
        previewElement.innerHTML = `
            <h3>${persona.title}</h3>
            <div class="persona-details">
                <p><strong>Age:</strong> ${persona.age}</p>
                <p><strong>Characteristics:</strong> ${persona.characteristics}</p>
                <p><strong>Scenario:</strong> ${persona.scenario}</p>
                <p><strong>Difficulty Level:</strong> ${persona.difficulty}</p>
            </div>
        `;
        
        this.userConfiguration.userProfile = persona;
    }

    regeneratePersona() {
        this.showProcessingScreen();
        setTimeout(() => {
            const newPersona = this.generatePersonaFromCV('regenerated');
            this.showPersonaPreview(newPersona);
        }, 2000);
    }

    // Manual Setup Chat Flow
    startChatSetup() {
        this.showScreen('chat-setup-screen');
        this.chatStep = 0;
        this.clearChat();
        this.nextChatStep();
    }

    clearChat() {
        document.getElementById('chat-messages').innerHTML = '';
        document.getElementById('chat-options').innerHTML = '';
    }

    nextChatStep() {
        const steps = [
            {
                message: "Hi! Let's configure your practice. First: Which scenario do you want to try?",
                options: this.options.scenarios,
                property: 'scenario'
            },
            {
                message: "Great choice! Now, what type of customer would you like to practice with?",
                options: this.options.customer_profiles,
                property: 'customerProfile'
            },
            {
                message: "Perfect! What difficulty level would you prefer?",
                options: this.options.difficulty_levels,
                property: 'difficulty'
            },
            {
                message: "Finally, who should start the conversation?",
                options: this.options.call_direction,
                property: 'callDirection'
            }
        ];

        if (this.chatStep < steps.length) {
            const step = steps[this.chatStep];
            this.addChatMessage(step.message, 'bot');
            this.showChatOptions(step.options, step.property);
        } else {
            this.addChatMessage("Perfect! All set up. Let's start your role-play session!", 'bot');
            setTimeout(() => this.startRolePlay(), 1500);
        }
    }

    addChatMessage(message, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        messageElement.innerHTML = `
            <div class="message-content">${message}</div>
        `;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showChatOptions(options, property) {
        const optionsContainer = document.getElementById('chat-options');
        optionsContainer.innerHTML = '';
        
        options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'chat-option-btn';
            button.innerHTML = `
                <strong>${option.name}</strong>
                <small>${option.description}</small>
            `;
            button.addEventListener('click', () => this.selectChatOption(option, property));
            optionsContainer.appendChild(button);
        });
    }

    selectChatOption(option, property) {
        this.userConfiguration[property] = option;
        this.addChatMessage(option.name, 'user');
        
        // Clear options
        document.getElementById('chat-options').innerHTML = '';
        
        this.chatStep++;
        setTimeout(() => this.nextChatStep(), 1000);
    }

    // Role Play System
    startRolePlay() {
        this.showScreen('roleplay-screen');
        this.setupRolePlayScreen();
        this.conversationHistory = [];
        this.startConversation();
    }

    setupRolePlayScreen() {
        const scenarioTitle = document.getElementById('current-scenario');
        const scenarioDesc = document.getElementById('scenario-description');
        
        const scenario = this.userConfiguration.scenario || this.options.scenarios[0];
        scenarioTitle.textContent = scenario.name;
        scenarioDesc.textContent = scenario.description;
    }

    startConversation() {
        const callDirection = this.userConfiguration.callDirection || this.options.call_direction[0];
        
        if (callDirection.id === 'inbound') {
            // Customer calls first
            this.addConversationMessage(this.generateCustomerMessage('opening'), 'customer');
        } else {
            // Sales representative calls first - wait for user input
            this.addConversationMessage("The call is connecting... You are calling the customer. Start the conversation!", 'system');
        }
    }

    generateCustomerMessage(context) {
        const profile = this.userConfiguration.customerProfile || this.options.customer_profiles[0];
        const difficulty = this.userConfiguration.difficulty || this.options.difficulty_levels[0];
        
        const messages = {
            opening: [
                "Merhaba, sigorta konusunda bilgi almak istiyorum.",
                "Selam, sitenizden bilgi talep etmiştim. Arayacağınızı söylemiştiniz.",
                "İyi günler, bir arkadaşım sizin adınızı verdi. Sigorta konusunda konuşabilir miyiz?"
            ],
            response: [
                "Anladım, biraz daha detay verir misiniz?",
                "Fiyatları nasıl? Başka şirketlerle karşılaştırdınız mı?",
                "Bu poliçe ne kadar süreyle geçerli?",
                "Düşünmem lazım, tekrar arayabilir misiniz?"
            ],
            objection: [
                "Çok pahalı geliyor bana.",
                "Başka şirketten daha uygun teklif aldım.",
                "Şu an bu konuya bütçe ayıramıyorum.",
                "Eşimle konuşmam lazım önce."
            ]
        };
        
        const contextMessages = messages[context] || messages.response;
        return contextMessages[Math.floor(Math.random() * contextMessages.length)];
    }

    addConversationMessage(message, sender) {
        const conversationArea = document.getElementById('conversation-area');
        const messageElement = document.createElement('div');
        messageElement.className = `conversation-message ${sender}`;
        
        const senderLabel = {
            'user': 'Siz (Satış Temsilcisi)',
            'customer': 'Müşteri',
            'system': 'Sistem'
        }[sender];
        
        messageElement.innerHTML = `
            <div class="message-header">${senderLabel}</div>
            <div class="message-content">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;
        
        conversationArea.appendChild(messageElement);
        conversationArea.scrollTop = conversationArea.scrollHeight;
        
        this.conversationHistory.push({ sender, message, timestamp: new Date() });
    }

    sendMessage() {
        const input = document.getElementById('user-input');
        const message = input.value.trim();
        
        if (message) {
            this.addConversationMessage(message, 'user');
            input.value = '';
            
            // Generate customer response
            setTimeout(() => {
                const customerResponse = this.generateCustomerResponse(message);
                this.addConversationMessage(customerResponse, 'customer');
            }, 1000 + Math.random() * 2000);
        }
    }

    generateCustomerResponse(userMessage) {
        const difficulty = this.userConfiguration.difficulty || this.options.difficulty_levels[0];
        
        // Simple AI simulation based on user message content
        if (userMessage.toLowerCase().includes('fiyat') || userMessage.toLowerCase().includes('ücret')) {
            if (difficulty.id === 'hard') {
                return this.generateCustomerMessage('objection');
            } else {
                return "Fiyatlar makul görünüyor, başka seçenekler var mı?";
            }
        } else if (userMessage.toLowerCase().includes('merhaba') || userMessage.toLowerCase().includes('selam')) {
            return "Merhaba, dinliyorum sizi.";
        } else {
            return this.generateCustomerMessage('response');
        }
    }

    endRolePlay() {
        if (confirm('Role-play oturumunu sonlandırmak istediğinizden emin misiniz?')) {
            this.showScreen('start-screen');
            this.resetConfiguration();
        }
    }

    resetConfiguration() {
        this.userConfiguration = {
            scenario: null,
            customerProfile: null,
            difficulty: null,
            callDirection: null,
            userProfile: null
        };
        this.conversationHistory = [];
        this.chatStep = 0;
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new RolePlayApp();
});
