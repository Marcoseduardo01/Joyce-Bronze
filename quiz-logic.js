// Lógica Científica do Quiz de Bronzeamento Joyce Bronze
// Baseada em conhecimentos dermatológicos e características da pele

class BronzeQuizLogic {
    constructor() {
        // Definição dos tratamentos disponíveis baseados no site
        this.treatments = {
            bronzeSimples: {
                id: 'bronze-simples',
                name: 'Bronze Simples',
                type: 'natural',
                price: 60,
                duration: '40 minutos no sol',
                features: [
                    'Esfoliação',
                    'Montagem de biquíni de fita',
                    'Gel pós sol',
                    'Protocolo simples',
                    'Mix de produtos'
                ],
                suitableFor: ['pele-clara', 'primeira-vez', 'resultado-sutil'],
                description: 'Ideal para iniciantes e peles sensíveis que buscam um bronzeado natural e gradual'
            },
            bronzeBigNeon: {
                id: 'bronze-big-neon',
                name: 'Bronze Big Neon',
                type: 'natural',
                price: 75,
                duration: '50 minutos no sol',
                features: [
                    'Esfoliação',
                    'Montagem de biquíni de fita',
                    'Protocolo Big Neon',
                    'Mix de produtos',
                    'Camuflagem de estrias'
                ],
                suitableFor: ['pele-morena', 'experiencia-anterior', 'resultado-medio'],
                description: 'Perfeito para quem já tem experiência e busca um bronzeado mais intenso'
            },
            bronzeBigNeonClareador: {
                id: 'bronze-big-neon-clareador',
                name: 'Bronze Big Neon (Clareador)',
                type: 'natural',
                price: 100,
                duration: '50 minutos no sol',
                features: [
                    'Esfoliação',
                    'Montagem de biquíni de fita',
                    'Protocolo Big Neon',
                    'Banho de lua (clareador)',
                    'Mix de produtos',
                    'Camuflagem de estrias'
                ],
                suitableFor: ['pele-escura', 'experiencia-avancada', 'resultado-intenso'],
                description: 'Tratamento premium com clareamento para uniformizar o tom da pele'
            },
            bronzeArtificialSimples: {
                id: 'bronze-artificial-simples',
                name: 'Bronze Artificial Simples',
                type: 'artificial',
                price: 65,
                duration: '30 minutos na cabine',
                features: [
                    'Esfoliação',
                    'Montagem de biquíni de fita',
                    'Protocolo simples',
                    'Mix de produtos',
                    'Camuflagem de estrias'
                ],
                suitableFor: ['tempo-limitado', 'resultado-rapido', 'pele-sensivel'],
                description: 'Solução rápida e segura para quem tem pouco tempo disponível'
            },
            bronzeDivaMasterSimples: {
                id: 'bronze-diva-master-simples',
                name: 'Bronze Diva Master (Simples)',
                type: 'artificial',
                price: 110,
                duration: '60 minutos na cabine',
                features: [
                    '2 sessões em uma',
                    'Esfoliação',
                    'Montagem de biquíni de fita',
                    'Protocolo Diva Master',
                    'Mix de produtos',
                    'Camuflagem de estrias',
                    'Tatuagem solar'
                ],
                suitableFor: ['experiencia-anterior', 'resultado-duradouro', 'tempo-multiplas-sessoes'],
                description: 'Tratamento completo com resultados duradouros e extras inclusos'
            },
            bronzeDivaMasterPremium: {
                id: 'bronze-diva-master-premium',
                name: 'Bronze Diva Master (Premium)',
                type: 'artificial',
                price: 130,
                duration: '60 minutos na cabine',
                features: [
                    '2 sessões em uma',
                    'Esfoliação',
                    'Banho de lua (clareador)',
                    'Clareamento de áreas',
                    'Montagem de biquíni de fita',
                    'Protocolo Diva Master',
                    'Mix de produtos',
                    'Camuflagem de estrias',
                    'Tatuagem solar'
                ],
                suitableFor: ['experiencia-avancada', 'melhor-experiencia', 'resultado-luxuoso'],
                description: 'A experiência mais completa e luxuosa disponível'
            }
        };

        // Perguntas do quiz baseadas nos screenshots
        this.questions = [
            {
                id: 1,
                text: 'Qual é o seu tipo de pele?',
                options: [
                    { id: 'muito-clara', text: 'Muito clara (queima facilmente)', weight: { 'pele-clara': 3, 'pele-sensivel': 2 } },
                    { id: 'clara', text: 'Clara (queima com facilidade)', weight: { 'pele-clara': 2, 'pele-sensivel': 1 } },
                    { id: 'morena', text: 'Morena (bronzeia gradualmente)', weight: { 'pele-morena': 3 } },
                    { id: 'escura', text: 'Escura (bronzeia facilmente)', weight: { 'pele-escura': 3 } }
                ]
            },
            {
                id: 2,
                text: 'Qual resultado você busca?',
                options: [
                    { id: 'sutil', text: 'Bronzeado sutil e natural', weight: { 'resultado-sutil': 3, 'primeira-vez': 1 } },
                    { id: 'medio', text: 'Bronzeado médio e uniforme', weight: { 'resultado-medio': 3 } },
                    { id: 'intenso', text: 'Bronzeado intenso e marcante', weight: { 'resultado-intenso': 3, 'experiencia-avancada': 1 } },
                    { id: 'duradouro', text: 'Dourado luxuoso e duradouro', weight: { 'resultado-duradouro': 3, 'resultado-luxuoso': 2 } }
                ]
            },
            {
                id: 3,
                text: 'Qual sua disponibilidade de tempo?',
                options: [
                    { id: 'pressa', text: 'Tenho pressa, quero resultado rápido', weight: { 'tempo-limitado': 3, 'resultado-rapido': 3 } },
                    { id: 'gradual', text: 'Prefiro processo gradual e seguro', weight: { 'primeira-vez': 2, 'pele-sensivel': 1 } },
                    { id: 'multiplas', text: 'Tenho tempo para várias sessões', weight: { 'tempo-multiplas-sessoes': 3, 'resultado-duradouro': 1 } },
                    { id: 'melhor', text: 'Quero a melhor experiência possível', weight: { 'melhor-experiencia': 3, 'resultado-luxuoso': 2 } }
                ]
            },
            {
                id: 4,
                text: 'Qual sua experiência com bronzeamento?',
                options: [
                    { id: 'primeira', text: 'Primeira vez, quero algo seguro', weight: { 'primeira-vez': 3, 'pele-sensivel': 2 } },
                    { id: 'anterior', text: 'Já fiz antes, busco melhor resultado', weight: { 'experiencia-anterior': 3 } },
                    { id: 'sensivel', text: 'Tenho pele sensível, preciso de cuidado', weight: { 'pele-sensivel': 3, 'primeira-vez': 1 } },
                    { id: 'avancado', text: 'Quero o mais avançado disponível', weight: { 'experiencia-avancada': 3, 'melhor-experiencia': 2 } }
                ]
            }
        ];
    }

    // Calcula a pontuação para cada tratamento baseado nas respostas
    calculateTreatmentScores(answers) {
        const scores = {};
        
        // Inicializa scores
        Object.keys(this.treatments).forEach(treatmentId => {
            scores[treatmentId] = 0;
        });

        // Calcula pontuação baseada nas características adequadas
        answers.forEach(answer => {
            const question = this.questions.find(q => q.id === answer.questionId);
            const option = question.options.find(o => o.id === answer.optionId);
            
            if (option && option.weight) {
                Object.entries(option.weight).forEach(([characteristic, weight]) => {
                    Object.entries(this.treatments).forEach(([treatmentId, treatment]) => {
                        if (treatment.suitableFor.includes(characteristic)) {
                            scores[treatmentId] += weight;
                        }
                    });
                });
            }
        });

        return scores;
    }

    // Aplica lógica científica adicional baseada em dermatologia
    applyScientificLogic(answers, scores) {
        const skinTypeAnswer = answers.find(a => a.questionId === 1);
        const resultAnswer = answers.find(a => a.questionId === 2);
        const timeAnswer = answers.find(a => a.questionId === 3);
        const experienceAnswer = answers.find(a => a.questionId === 4);

        // Regras científicas baseadas em fototipos de pele (Escala Fitzpatrick)
        if (skinTypeAnswer) {
            switch (skinTypeAnswer.optionId) {
                case 'muito-clara':
                case 'clara':
                    // Peles claras: priorizar tratamentos graduais e naturais
                    scores.bronzeSimples += 5;
                    scores.bronzeArtificialSimples += 3;
                    scores.bronzeDivaMasterPremium -= 2; // Reduz tratamentos muito intensos
                    break;
                case 'morena':
                    // Peles morenas: podem usar tratamentos intermediários
                    scores.bronzeBigNeon += 4;
                    scores.bronzeDivaMasterSimples += 3;
                    break;
                case 'escura':
                    // Peles escuras: podem usar tratamentos mais intensos
                    scores.bronzeBigNeonClareador += 5;
                    scores.bronzeDivaMasterPremium += 4;
                    break;
            }
        }

        // Lógica para primeira vez vs experiência
        if (experienceAnswer) {
            if (experienceAnswer.optionId === 'primeira' || experienceAnswer.optionId === 'sensivel') {
                // Primeira vez ou pele sensível: priorizar segurança
                scores.bronzeSimples += 4;
                scores.bronzeArtificialSimples += 3;
                scores.bronzeDivaMasterPremium -= 3;
            }
        }

        // Lógica de tempo vs resultado
        if (timeAnswer && resultAnswer) {
            if (timeAnswer.optionId === 'pressa' && resultAnswer.optionId !== 'sutil') {
                // Pressa + resultado visível: priorizar artificial
                scores.bronzeArtificialSimples += 3;
                scores.bronzeDivaMasterSimples += 2;
            }
        }

        return scores;
    }

    // Função principal para recomendar tratamento
    recommendTreatment(answers) {
        let scores = this.calculateTreatmentScores(answers);
        scores = this.applyScientificLogic(answers, scores);

        // Encontra o tratamento com maior pontuação
        const recommendedTreatmentId = Object.keys(scores).reduce((a, b) => 
            scores[a] > scores[b] ? a : b
        );

        const recommendedTreatment = this.treatments[recommendedTreatmentId];

        // Gera explicação científica da recomendação
        const explanation = this.generateExplanation(answers, recommendedTreatment, scores);

        return {
            treatment: recommendedTreatment,
            explanation: explanation,
            scores: scores
        };
    }

    // Gera explicação científica personalizada
    generateExplanation(answers, treatment, scores) {
        const skinTypeAnswer = answers.find(a => a.questionId === 1);
        const resultAnswer = answers.find(a => a.questionId === 2);
        const experienceAnswer = answers.find(a => a.questionId === 4);

        let explanation = `Baseado na análise científica das suas respostas, recomendamos o ${treatment.name}. `;

        // Explicação baseada no tipo de pele
        if (skinTypeAnswer) {
            switch (skinTypeAnswer.optionId) {
                case 'muito-clara':
                case 'clara':
                    explanation += `Sua pele clara requer cuidados especiais para evitar queimaduras e garantir um bronzeado seguro e gradual. `;
                    break;
                case 'morena':
                    explanation += `Sua pele morena tem boa capacidade de bronzeamento, permitindo tratamentos intermediários com excelentes resultados. `;
                    break;
                case 'escura':
                    explanation += `Sua pele escura pode aproveitar tratamentos mais intensos, com foco na uniformização do tom. `;
                    break;
            }
        }

        // Explicação baseada na experiência
        if (experienceAnswer) {
            if (experienceAnswer.optionId === 'primeira' || experienceAnswer.optionId === 'sensivel') {
                explanation += `Como é sua primeira vez ou você tem pele sensível, priorizamos um protocolo seguro e controlado. `;
            } else if (experienceAnswer.optionId === 'avancado') {
                explanation += `Sua experiência permite aproveitar nossos tratamentos mais avançados e completos. `;
            }
        }

        explanation += `Este tratamento oferece o equilíbrio ideal entre segurança, eficácia e o resultado que você busca.`;

        return explanation;
    }

    // Retorna todas as perguntas do quiz
    getQuestions() {
        return this.questions;
    }

    // Retorna informações de um tratamento específico
    getTreatment(treatmentId) {
        return this.treatments[treatmentId];
    }
}

// Exporta a classe para uso no site
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BronzeQuizLogic;
} else {
    window.BronzeQuizLogic = BronzeQuizLogic;
}

