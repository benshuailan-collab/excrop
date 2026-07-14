// ===== Mobile Menu Toggle =====
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('open');
    });
  }

  // ===== Number Counter Animation =====
  const counters = document.querySelectorAll('.stat-card__number');
  const animateCounter = function(el) {
    const target = +el.getAttribute('data-target');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    const update = function() {
      current += step;
      if (current < target) {
        el.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString();
      }
    };
    update();
  };

  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function(c) { counterObserver.observe(c); });

  // ===== Fade In Animation =====
  const fadeElements = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeElements.forEach(function(el) { fadeObserver.observe(el); });

  // ===== FAQ Accordion =====
  const faqHeaders = document.querySelectorAll('.faq-item__header');
  faqHeaders.forEach(function(header) {
    header.addEventListener('click', function() {
      const item = header.parentElement;
      item.classList.toggle('open');
    });
  });

  // ===== Contact Form Submit via Cloudflare Worker =====
  var contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      var formData = new FormData(contactForm);
      var data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
      };

      fetch('https://excrop-form.benshuailan.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(function(response) { return response.json(); })
      .then(function(result) {
        if (result.success) {
          var success = document.querySelector('.form-success');
          if (success) {
            success.classList.add('show');
            contactForm.style.display = 'none';
            setTimeout(function() {
              success.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }
        } else {
          alert('Submission failed: ' + (result.error || 'Unknown error') + '\n\nPlease email us directly at benshuailan@gmail.com');
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }
      })
      .catch(function(error) {
        alert('Network error. Please email us directly at benshuailan@gmail.com');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      });
    });
  }

  // ===== Active Nav Link =====
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});
