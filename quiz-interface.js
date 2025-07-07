// Interface do Quiz Joyce Bronze
// Baseada nos screenshots fornecidos

class QuizInterface {
    constructor() {
        this.quizLogic = new BronzeQuizLogic();
        this.currentQuestion = 0;
        this.answers = [];
        this.questions = this.quizLogic.getQuestions();
        
        this.init();
    }

    init() {
        this.showQuestion(0);
    }

    showQuestion(questionIndex) {
        const question = this.questions[questionIndex];
        const quizContent = document.getElementById('quiz-content');
        
        const progressPercentage = ((questionIndex + 1) / this.questions.length) * 100;
        
        quizContent.innerHTML = `
            <div class="quiz-question-container">
                <div class="quiz-question-header">
                    <h3 class="quiz-question-title">${question.text}</h3>
                    <div class="quiz-progress-bar">
                        <div class="quiz-progress-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                    <p class="quiz-question-counter">Pergunta ${questionIndex + 1} de ${this.questions.length}</p>
                </div>
                
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <div class="quiz-option" data-option-id="${option.id}" onclick="quizInterface.selectOption('${option.id}', ${questionIndex})">
                            <div class="quiz-option-radio">
                                <div class="quiz-option-radio-inner"></div>
                            </div>
                            <span class="quiz-option-text">${option.text}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    selectOption(optionId, questionIndex) {
        // Remove seleção anterior
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Adiciona seleção atual
        const selectedOption = document.querySelector(`[data-option-id="${optionId}"]`);
        selectedOption.classList.add('selected');
        
        // Salva a resposta
        this.answers[questionIndex] = {
            questionId: questionIndex + 1,
            optionId: optionId
        };
        
        // Aguarda um pouco e vai para próxima pergunta ou resultado
        setTimeout(() => {
            if (questionIndex < this.questions.length - 1) {
                this.currentQuestion = questionIndex + 1;
                this.showQuestion(this.currentQuestion);
            } else {
                this.showResult();
            }
        }, 500);
    }

    showResult() {
        const recommendation = this.quizLogic.recommendTreatment(this.answers);
        const treatment = recommendation.treatment;
        
        const quizContent = document.getElementById('quiz-content');
        const quizResult = document.getElementById('quiz-result');
        
        // Esconde as perguntas
        quizContent.style.display = 'none';
        
        // Mostra o resultado
        quizResult.style.display = 'block';
        quizResult.innerHTML = `
            <div class="quiz-result-container">
                <div class="quiz-result-header">
                    <div class="quiz-result-icon">
                        <i class="fas fa-check"></i>
                    </div>
                    <h2 class="quiz-result-title">Perfeito! Encontramos o Tratamento Ideal para Você!</h2>
                    <p class="quiz-result-subtitle">Baseado nas suas respostas, recomendamos:</p>
                </div>
                
                <div class="quiz-result-treatment-card">
                    <div class="quiz-result-treatment-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="quiz-result-treatment-badge">
                        RECOMENDADO PARA VOCÊ
                    </div>
                    <h3 class="quiz-result-treatment-name">${treatment.name}</h3>
                    <p class="quiz-result-treatment-description">${treatment.description}</p>
                    
                    <div class="quiz-result-benefits">
                        <h4 class="quiz-result-benefits-title">Benefícios Inclusos:</h4>
                        <ul class="quiz-result-benefits-list">
                            ${treatment.features.map(feature => `
                                <li><i class="fas fa-circle"></i> ${feature}</li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="quiz-result-details">
                        <div class="quiz-result-detail">
                            <i class="fas fa-clock"></i>
                            <span class="quiz-result-detail-label">Duração</span>
                            <span class="quiz-result-detail-value">${treatment.duration}</span>
                        </div>
                        
                        <div class="quiz-result-detail">
                            <i class="fas fa-sun"></i>
                            <span class="quiz-result-detail-label">Resultado</span>
                            <span class="quiz-result-detail-value">Dura 6-8 semanas</span>
                        </div>
                    </div>
                    
                    <div class="quiz-result-pricing">
                            <span class="quiz-result-price-current">R$ ${treatment.price}</span>
                        </div>
                        
                        <div class="quiz-result-actions">
                            <button class="quiz-result-btn quiz-result-btn-primary" onclick="quizInterface.scheduleAppointment()">
                                <i class="fas fa-phone"></i>
                                Agendar Agora
                            </button>
                            <button class="quiz-result-btn quiz-result-btn-secondary" onclick="quizInterface.restartQuiz()">
                                Refazer Quiz
                            </button>
                        </div>
                        
                        <div class="quiz-result-guarantee">
                            <i class="fas fa-shield-alt"></i>
                            <div class="quiz-result-guarantee-text">
                                <strong>Garantia de Satisfação</strong><br>
                                Se não ficar 100% satisfeita, refazemos o procedimento gratuitamente!
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Scroll para o resultado
        quizResult.scrollIntoView({ behavior: 'smooth' });
    }
    scheduleAppointment() {
        const recommendation = this.quizLogic.recommendTreatment(this.answers);
        const treatmentName = recommendation.treatment.name;
        const message = encodeURIComponent(`Olá, tudo bem? Acabei de realizar o quiz no site e recebi como sugestão o *${treatmentName}*, que achei excelente! ☀️💎 Gostaria de confirmar os detalhes desse procedimento e consultar a disponibilidade para agendamento. Desde já, agradeço pela atenção e aguardo retorno!`);
        window.open(`https://wa.me/5599991327346?text=${message}`, 
'_blank');
    }

    restartQuiz() {
        this.currentQuestion = 0;
        this.answers = [];
        
        const quizContent = document.getElementById('quiz-content');
        const quizResult = document.getElementById('quiz-result');
        
        quizContent.style.display = 'block';
        quizResult.style.display = 'none';
        
        this.showQuestion(0);
        
        // Scroll para o início do quiz
        document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth' });
    }
}

// Inicializa o quiz quando a página carrega
let quizInterface;
document.addEventListener('DOMContentLoaded', function() {
    quizInterface = new QuizInterface();
});

