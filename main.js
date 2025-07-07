/**
 * Joyce Bronze - Main JavaScript File
 * Handles all interactive functionality with security and performance optimizations
 */

(function() {
    'use strict';

    // Utility functions for security
    const Utils = {
        // Sanitize HTML to prevent XSS
        sanitizeHTML: function(str) {
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        },

        // Validate email format
        validateEmail: function(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        // Validate phone number (Brazilian format)
        validatePhone: function(phone) {
            const re = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
            return re.test(phone) || /^\d{10,11}$/.test(phone.replace(/\D/g, ''));
        },

        // Format phone number
        formatPhone: function(phone) {
            const numbers = phone.replace(/\D/g, '');
            if (numbers.length === 11) {
                return `(${numbers.slice(0,2)}) ${numbers.slice(2,7)}-${numbers.slice(7)}`;
            } else if (numbers.length === 10) {
                return `(${numbers.slice(0,2)}) ${numbers.slice(2,6)}-${numbers.slice(6)}`;
            }
            return phone;
        },

        // Debounce function for performance
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Throttle function for scroll events
        throttle: function(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            }
        }
    };

    // Counter Animation
    const CounterAnimation = {
        init: function() {
            this.animateCounter();
        },

        animateCounter: function() {
            const counter = document.getElementById("counter");
            if (!counter) return;

            const target = 300;
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current) + "+";
            }, 30);
        }
    };

    // Smooth Scrolling
    const SmoothScroll = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            document.querySelectorAll(".quick-link, a[href^='#']").forEach(anchor => {
                anchor.addEventListener("click", this.handleClick.bind(this));
            });
        },

        handleClick: function(e) {
            e.preventDefault();
            const targetId = e.target.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }
    };

    // Form Validation and Handling
    const FormHandler = {
        init: function() {
            this.form = document.getElementById('quote-form');
            if (!this.form) return;

            this.bindEvents();
            this.setupValidation();
        },

        bindEvents: function() {
            this.form.addEventListener('submit', this.handleSubmit.bind(this));
            
            // Real-time validation
            const inputs = this.form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateField.bind(this));
                input.addEventListener('input', Utils.debounce(this.validateField.bind(this), 300));
            });

            // Phone number formatting
            const phoneInput = document.getElementById('whatsapp');
            if (phoneInput) {
                phoneInput.addEventListener('input', this.formatPhoneInput.bind(this));
            }

            // Character counter for textarea
            const messageTextarea = document.getElementById('mensagem');
            if (messageTextarea) {
                messageTextarea.addEventListener('input', this.updateCharacterCounter.bind(this));
            }
        },

        setupValidation: function() {
            this.validationRules = {
                nome: {
                    required: true,
                    minLength: 2,
                    pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
                    message: 'Nome deve conter apenas letras e ter pelo menos 2 caracteres'
                },
                whatsapp: {
                    required: true,
                    validate: Utils.validatePhone,
                    message: 'Número de WhatsApp inválido'
                },
                servico: {
                    required: true,
                    message: 'Selecione um serviço'
                },
                horario: {
                    required: true,
                    message: 'Selecione um horário'
                }
            };
        },

        validateField: function(e) {
            const field = e.target;
            const fieldName = field.name;
            const value = field.value.trim();
            const rules = this.validationRules[fieldName];
            
            if (!rules) return true;

            const errorElement = document.getElementById(`${fieldName}-error`);
            let isValid = true;
            let errorMessage = '';

            // Required validation
            if (rules.required && !value) {
                isValid = false;
                errorMessage = `${field.labels[0].textContent.replace('*', '')} é obrigatório`;
            }
            // Min length validation
            else if (rules.minLength && value.length < rules.minLength) {
                isValid = false;
                errorMessage = rules.message;
            }
            // Pattern validation
            else if (rules.pattern && !rules.pattern.test(value)) {
                isValid = false;
                errorMessage = rules.message;
            }
            // Custom validation
            else if (rules.validate && !rules.validate(value)) {
                isValid = false;
                errorMessage = rules.message;
            }

            // Update UI
            field.classList.toggle('error', !isValid);
            field.classList.toggle('valid', isValid && value);
            
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = errorMessage ? 'block' : 'none';
            }

            return isValid;
        },

        formatPhoneInput: function(e) {
            const input = e.target;
            let value = input.value.replace(/\D/g, '');
            
            if (value.length <= 11) {
                if (value.length > 6) {
                    value = value.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
                } else if (value.length > 2) {
                    value = value.replace(/(\d{2})(\d+)/, '($1) $2');
                }
            }
            
            input.value = value;
        },

        updateCharacterCounter: function(e) {
            const textarea = e.target;
            const counter = document.getElementById('mensagem-counter');
            const maxLength = textarea.getAttribute('maxlength') || 500;
            const currentLength = textarea.value.length;
            
            if (counter) {
                counter.textContent = `${currentLength}/${maxLength} caracteres`;
                counter.classList.toggle('warning', currentLength > maxLength * 0.9);
            }
        },

        validateForm: function() {
            const inputs = this.form.querySelectorAll('input[required], select[required]');
            let isValid = true;

            inputs.forEach(input => {
                const fieldValid = this.validateField({ target: input });
                if (!fieldValid) isValid = false;
            });

            return isValid;
        },

        handleSubmit: function(e) {
            e.preventDefault();

            if (!this.validateForm()) {
                this.showFormStatus('Por favor, corrija os erros antes de enviar.', 'error');
                return;
            }

            this.showFormStatus('Preparando mensagem...', 'loading');

            // Get form data
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());

            // Sanitize data
            Object.keys(data).forEach(key => {
                data[key] = Utils.sanitizeHTML(data[key]);
            });

            // Generate WhatsApp message
            this.sendWhatsAppMessage(data);
        },

        sendWhatsAppMessage: function(data) {
            const servicoTexto = {
                'bronzeamento-natural': 'Bronzeamento Natural',
                'bronzeamento-artificial': 'Bronzeamento Artificial',
                'ambos': 'Ambos os serviços',
                'nao-sei': 'Ainda não sei qual escolher'
            };

            const horarioTexto = {
                'manha': 'Manhã (9h às 12h)',
                'tarde': 'Tarde (12h às 17h)',
                'noite': 'Noite (17h às 19h)',
                'flexivel': 'Horário flexível'
            };

            let whatsappMessage = `Olá! Tudo bem? ☀️✨

Envio esta mensagem para confirmar meu interesse no *${servicoTexto[data.servico] || data.servico}*, conforme registrei no formulário que acabei de preencher. Seguem meus dados para facilitar o atendimento:

👤 Nome: ${data.nome}
📞 WhatsApp: ${data.whatsapp}
🕒 Horário de preferência: ${horarioTexto[data.horario] || data.horario}`;

            if (data.mensagem) {
                whatsappMessage += `\n💬 Observação: ${data.mensagem}`;
            }

            whatsappMessage += `

Ficarei muito feliz em receber o orçamento detalhado, junto com as orientações sobre disponibilidade, procedimentos e as melhores opções para garantir meu horário.

Desde já agradeço pela atenção e gentileza no retorno.
Desejo um excelente dia! 🌿✨`;

            const whatsappUrl = `https://wa.me/5599991327346?text=${encodeURIComponent(whatsappMessage)}`;
            
            // Open WhatsApp
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
            
            // Show success message
            this.showFormStatus('Redirecionando para WhatsApp...', 'success');
            
            // Reset form after delay
            setTimeout(() => {
                this.form.reset();
                this.clearValidation();
                this.showFormStatus('', '');
            }, 3000);
        },

        showFormStatus: function(message, type) {
            const statusElement = document.getElementById('form-status');
            if (!statusElement) return;

            statusElement.textContent = message;
            statusElement.className = `form-status ${type}`;
            statusElement.style.display = message ? 'block' : 'none';
        },

        clearValidation: function() {
            const inputs = this.form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.classList.remove('error', 'valid');
            });

            const errorElements = this.form.querySelectorAll('.error-message');
            errorElements.forEach(element => {
                element.textContent = '';
                element.style.display = 'none';
            });
        }
    };



    // Performance Monitoring
    const PerformanceMonitor = {
        init: function() {
            this.monitorPageLoad();
            this.setupErrorHandling();
        },

        monitorPageLoad: function() {
            window.addEventListener('load', () => {
                // Log performance metrics
                if ('performance' in window) {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    console.log('Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                }
            });
        },

        setupErrorHandling: function() {
            window.addEventListener('error', (e) => {
                console.error('JavaScript Error:', e.error);
                // In production, you might want to send this to an error tracking service
            });

            window.addEventListener('unhandledrejection', (e) => {
                console.error('Unhandled Promise Rejection:', e.reason);
                // In production, you might want to send this to an error tracking service
            });
        }
    };

    // Accessibility Enhancements
    const AccessibilityEnhancer = {
        init: function() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.setupScreenReaderSupport();
        },

        setupKeyboardNavigation: function() {
            // Add keyboard support for custom elements
            document.querySelectorAll('.quiz-option, .video-play-button').forEach(element => {
                if (!element.hasAttribute('tabindex')) {
                    element.setAttribute('tabindex', '0');
                }

                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        element.click();
                    }
                });
            });
        },

        setupFocusManagement: function() {
            // Ensure focus is visible
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        },

        setupScreenReaderSupport: function() {
            // Add live regions for dynamic content
            const liveRegions = document.querySelectorAll('[aria-live]');
            liveRegions.forEach(region => {
                // Ensure live regions are properly announced
                region.setAttribute('aria-atomic', 'true');
            });
        }
    };

    // Initialize all modules when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        try {
            CounterAnimation.init();
            SmoothScroll.init();
            FormHandler.init();
            PerformanceMonitor.init();
            AccessibilityEnhancer.init();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    });

    // Initialize counter animation after page load
    window.addEventListener("load", () => {
        setTimeout(() => {
            CounterAnimation.init();
        }, 500);
    });

})();




// Modal Functionality (from joyce_bronze_modal_final)
(function() {
    'use strict';

    // Modal Handler
    const ModalHandler = {
        init: function() {
            this.imageModal = document.getElementById("imageModal");
            this.videoModal = document.getElementById("videoModal");
            this.modalImg = document.getElementById("img01");
            this.captionText = document.getElementById("caption");
            this.modalVideo = document.getElementById("modalVideo");
            this.modalVideoSource = document.getElementById("modalVideoSource");
            this.videoCaptionText = document.getElementById("videoCaption");

            this.bindEvents();
        },

        bindEvents: function() {
            // Image modal events
            document.querySelectorAll(".transformation-image img").forEach(img => {
                img.addEventListener("click", this.openImageModal.bind(this));
            });

            // Video modal events - tanto no container quanto no botão de play
            document.querySelectorAll(".transformation-video").forEach(videoContainer => {
                videoContainer.addEventListener("click", this.openVideoModal.bind(this));
            });

            // Event listeners específicos para botões de play
            document.querySelectorAll(".video-play-button").forEach(playButton => {
                playButton.addEventListener("click", (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Dispara o evento no container pai
                    const videoContainer = playButton.closest(".transformation-video");
                    if (videoContainer) {
                        this.openVideoModal.call(this, { currentTarget: videoContainer, preventDefault: () => {}, stopPropagation: () => {} });
                    }
                });
            });

            // Close button events
            document.querySelectorAll(".modal .close").forEach(closeBtn => {
                closeBtn.addEventListener("click", this.closeModals.bind(this));
            });

            // Close on outside click
            window.addEventListener("click", this.handleOutsideClick.bind(this));
        },

        openImageModal: function(e) {
            if (!this.imageModal || !this.modalImg) return;

            this.imageModal.style.display = "block";
            this.imageModal.setAttribute("aria-hidden", "false");
            this.modalImg.src = e.target.src;
            this.modalImg.alt = e.target.alt;
            
            if (this.captionText) {
                this.captionText.textContent = e.target.alt;
            }

            // Focus management for accessibility
            this.imageModal.focus();
            
            // Prevent body scroll
            document.body.style.overflow = "hidden";
        },

        openVideoModal: function(e) {
            if (!this.videoModal || !this.modalVideo) return;

            // Previne o comportamento padrão
            e.preventDefault();
            e.stopPropagation();

            // Encontra o vídeo clicado
            const clickedElement = e.currentTarget;
            const video = clickedElement.querySelector(".transformation-video-element");
            const videoSource = video?.querySelector("source[type=\"video/mp4\"]") || video?.dataset.videoSrc;
            
            if (!videoSource) {
                console.error("Fonte do vídeo não encontrada");
                return;
            }

            // Obtém a URL do vídeo
            const videoUrl = typeof videoSource === 'string' ? videoSource : videoSource.src;
            
            // Configura o modal
            this.videoModal.style.display = "block";
            this.videoModal.setAttribute("aria-hidden", "false");
            this.modalVideoSource.src = videoUrl;
            this.modalVideo.load();
            
            // Adiciona classe para animação
            setTimeout(() => {
                this.videoModal.classList.add('show');
            }, 10);
            
            // Auto-play com tratamento de erro
            this.modalVideo.play().catch(error => {
                console.log("Auto-play foi impedido pelo navegador:", error);
                // Mostra controles se auto-play falhar
                this.modalVideo.controls = true;
            });

            // Gerenciamento de foco para acessibilidade
            this.modalVideo.focus();
            
            // Previne scroll do body
            document.body.style.overflow = "hidden";
            
            // Adiciona listener para tecla ESC
            document.addEventListener('keydown', this.handleEscapeKey.bind(this));
        },

        closeModals: function() {
            // Fecha modal de imagem
            if (this.imageModal) {
                this.imageModal.style.display = "none";
                this.imageModal.setAttribute("aria-hidden", "true");
            }

            // Fecha modal de vídeo
            if (this.videoModal) {
                this.videoModal.classList.remove('show');
                
                setTimeout(() => {
                    this.videoModal.style.display = "none";
                    this.videoModal.setAttribute("aria-hidden", "true");
                }, 300); // Aguarda a animação terminar
                
                if (this.modalVideo) {
                    this.modalVideo.pause();
                    this.modalVideo.currentTime = 0;
                    this.modalVideoSource.src = "";
                }
            }
            
            // Restaura scroll do body
            document.body.style.overflow = "";
            
            // Remove listener da tecla ESC
            document.removeEventListener('keydown', this.handleEscapeKey.bind(this));
        },

        handleEscapeKey: function(e) {
            if (e.key === "Escape") {
                this.closeModals();
            }
        },

        handleOutsideClick: function(e) {
            // Fecha modal se clicar no overlay ou no próprio modal
            if (e.target === this.imageModal || 
                e.target === this.videoModal || 
                e.target.classList.contains('video-modal-overlay')) {
                this.closeModals();
            }
        }
    };

    // Video Performance Optimization
    const VideoOptimizer = {
        init: function() {
            this.optimizeVideos();
        },

        optimizeVideos: function() {
            const videos = document.querySelectorAll(".transformation-video-element");
            
            videos.forEach(video => {
                // Prevent autoplay in cards
                video.autoplay = false;
                video.muted = true;
                video.preload = "metadata";
                
                // Prevent default click behavior
                video.addEventListener("click", function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });

                // Lazy loading for videos
                if ("IntersectionObserver" in window) {
                    this.setupLazyLoading(video);
                }
            });
        },

        setupLazyLoading: function(video) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        if (video.dataset.src) {
                            video.src = video.dataset.src;
                            video.load();
                            observer.unobserve(video);
                        }
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(video);
        }
    };

    // Accessibility Enhancements
    const AccessibilityEnhancerModal = {
        init: function() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
        },

        setupKeyboardNavigation: function() {
            // Add keyboard support for video play buttons
            document.querySelectorAll(".video-play-button").forEach(element => {
                if (!element.hasAttribute("tabindex")) {
                    element.setAttribute("tabindex", "0");
                }

                element.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        // Trigger the parent video container click
                        const videoContainer = element.closest(".transformation-video");
                        if (videoContainer) {
                            videoContainer.click();
                        }
                    }
                });
            });

            // Add keyboard support for images
            document.querySelectorAll(".transformation-image img").forEach(element => {
                if (!element.hasAttribute("tabindex")) {
                    element.setAttribute("tabindex", "0");
                }

                element.addEventListener("keydown", (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        element.click();
                    }
                });
            });
        },

        setupFocusManagement: function() {
            // Ensure focus is visible
            document.addEventListener("keydown", (e) => {
                if (e.key === "Tab") {
                    document.body.classList.add("keyboard-navigation");
                }
            });

            document.addEventListener("mousedown", () => {
                document.body.classList.remove("keyboard-navigation");
            });
        }
    };

    // Performance Monitoring
    const PerformanceMonitorModal = {
        init: function() {
            this.setupErrorHandling();
        },

        setupErrorHandling: function() {
            window.addEventListener("error", (e) => {
                console.error("JavaScript Error:", e.error);
            });

            window.addEventListener("unhandledrejection", (e) => {
                console.error("Unhandled Promise Rejection:", e.reason);
            });
        }
    };

    // Initialize all modules when DOM is ready
    document.addEventListener("DOMContentLoaded", function() {
        try {
            ModalHandler.init();
            VideoOptimizer.init();
            AccessibilityEnhancerModal.init();
            PerformanceMonitorModal.init();
            
            console.log("Joyce Bronze Modal initialized successfully");
        } catch (error) {
            console.error("Initialization error:", error);
        }
    });

})();


