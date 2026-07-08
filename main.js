// ===== main.js - Core functionality =====

(function() {
    'use strict';

    // Current language
    let currentLang = 'en';

    // ===== Language Switching =====
    function switchLanguage(lang) {
        currentLang = lang;
        const dict = window.translations[lang];
        if (!dict) return;

        // Set HTML dir for Arabic
        const html = document.documentElement;
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        html.setAttribute('lang', lang);

        // Translate all data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
                    // Skip - don't change input values
                } else {
                    el.innerHTML = dict[key];
                }
            }
        });

        // Translate placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key]) {
                el.placeholder = dict[key];
            }
        });

        // Translate select options
        const varietySelect = document.querySelector('select[name="variety"]');
        if (varietySelect) {
            varietySelect.options[0].textContent = dict.opt_normal || 'Normal White Garlic';
            varietySelect.options[1].textContent = dict.opt_pure || 'Pure White Garlic';
            varietySelect.options[2].textContent = dict.opt_both || 'Both Varieties';
        }
        const sizeSelect = document.querySelector('select[name="size"]');
        if (sizeSelect) {
            const mixedOpt = sizeSelect.options[sizeSelect.options.length - 1];
            if (mixedOpt && mixedOpt.value === 'mixed') {
                mixedOpt.textContent = dict.opt_mixed || 'Mixed Sizes';
            }
        }

        // Update active lang button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Update page title
        const titles = {
            en: 'Excrop - Premium Fresh Garlic Exporter from China',
            zh: '小帅牛大蒜 - 中国优质新鲜大蒜出口商',
            ru: 'Excrop - Экспортер свежего чеснока из Китая',
            ar: 'Excrop - مورد ثوم طازج ممتاز من الصين'
        };
        document.title = titles[lang] || titles.en;
    }

    // ===== Language Button Click Handlers =====
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            switchLanguage(btn.dataset.lang);
        });
    });

    // ===== Navbar Scroll Effect =====
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ===== Mobile Menu Toggle =====
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const spans = mobileBtn.querySelectorAll('span');
            if (navLinks.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // Close mobile menu on link click
        navLinks.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('open');
                const spans = mobileBtn.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            });
        });
    }

    // ===== Scroll Reveal Animation =====
    function revealOnScroll() {
        const sections = document.querySelectorAll('section:not(.hero)');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            section.classList.add('reveal');
            observer.observe(section);
        });
    }
    revealOnScroll();

    // ===== Form Handling =====
    const form = document.getElementById('inquiryForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => { data[key] = value; });
            
            // Build WhatsApp message
            const varietyMap = {
                'normal-white': currentLang === 'zh' ? '普通白蒜' : 'Normal White Garlic',
                'pure-white': currentLang === 'zh' ? '纯白蒜' : 'Pure White Garlic',
                'both': currentLang === 'zh' ? '两种' : 'Both'
            };
            
            const msg = `Hi, I'd like to inquire about garlic export:\n` +
                `Variety: ${varietyMap[data.variety] || data.variety}\n` +
                `Size: ${data.size}cm\n` +
                `Quantity: ${data.quantity} tons\n` +
                `Destination: ${data.port}\n` +
                `Name: ${data.name}\n` +
                `${data.company ? `Company: ${data.company}\n` : ''}` +
                `${data.message ? `Notes: ${data.message}\n` : ''}`;
            
            const whatsappUrl = `https://wa.me/8613658980612?text=${encodeURIComponent(msg)}`;
            
            // Show success feedback
            const btn = form.querySelector('.btn-primary');
            const originalText = btn.innerHTML;
            btn.innerHTML = currentLang === 'zh' ? '✓ 已生成询盘' : 
                           currentLang === 'ru' ? '✓ Запрос создан' :
                           currentLang === 'ar' ? '✓ تم إنشاء الاستفسار' :
                           '✓ Inquiry Created';
            btn.style.background = '#2D6A4F';
            
            // Open WhatsApp with the inquiry
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                btn.innerHTML = originalText;
                btn.style.background = '';
            }, 1500);
        });
    }

    // ===== Smooth Scroll for anchor links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // navbar height
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });

    // ===== Detect browser language =====
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('zh')) {
        switchLanguage('zh');
    } else if (browserLang.startsWith('ru')) {
        switchLanguage('ru');
    } else if (browserLang.startsWith('ar')) {
        switchLanguage('ar');
    } else {
        switchLanguage('en');
    }

})();
