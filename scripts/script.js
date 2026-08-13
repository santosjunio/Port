class Navigation {
  constructor() {
    this.navLinks = document.querySelectorAll('.link-menu');
    this.sections = document.querySelectorAll('section[id], header[id]');
    this.observerOptions = { threshold: 0.25, rootMargin: '-70px 0px -40% 0px' };
    if (this.navLinks.length && this.sections.length) {
      this.initObserver();
      this.attachEventListeners();
    }
  }

  initObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateActiveLink(entry.target.id);
        }
      });
    }, this.observerOptions);
    this.sections.forEach(section => observer.observe(section));
  }

  updateActiveLink(sectionId) {
    this.navLinks.forEach(link => link.classList.remove('active'));
    const activeLink = document.querySelector(`.link-menu[href="#${sectionId}"]`);
    if (activeLink) activeLink.classList.add('active');
  }

  attachEventListeners() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return;
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          this.updateActiveLink(targetId);
        }
      });
    });
  }
}

class Form {
  constructor() {
    this.form = document.querySelector('.formulario');
    if (!this.form) return;
    this.nameInput = this.form.querySelector('input[name="name"], input[type="text"]');
    this.emailInput = this.form.querySelector('input[name="email"], input[type="email"]');
    this.messageInput = this.form.querySelector('textarea');
    this.submitButton = this.form.querySelector('button[type="submit"], .botao');
    this.attachEventListeners();
  }

  attachEventListeners() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    [this.nameInput, this.emailInput, this.messageInput].forEach(input => {
      if (input) {
        input.addEventListener('input', () => this.validateField(input));
        input.addEventListener('blur', () => this.validateField(input));
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.isFormValid()) {
      this.submitForm();
    } else {
      this.highlightErrors();
    }
  }

  validateField(field) {
    if (!field) return false;
    const value = field.value.trim();
    let isValid = value.length > 0;
    if (field.type === 'email' || field.name === 'email') {
      isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }
    field.style.borderColor = isValid ? 'var(--color-accent)' : (value.length > 0 ? '#ff4d4d' : 'var(--color-border)');
    return isValid;
  }

  isFormValid() {
    return [this.nameInput, this.emailInput, this.messageInput].every(field => !field || this.validateField(field));
  }

  highlightErrors() {
    [this.nameInput, this.emailInput, this.messageInput].forEach(field => {
      if (field && !this.validateField(field)) field.style.borderColor = '#ff4d4d';
    });
  }

  submitForm() {
    const originalText = this.submitButton ? this.submitButton.textContent : '';
    if (this.submitButton) {
      this.submitButton.textContent = 'Enviando...';
      this.submitButton.disabled = true;
    }
    setTimeout(() => {
      this.showFeedback('Obrigado pela sua mensagem! Em breve entraremos em contato.', 'success');
      this.form.reset();
      [this.nameInput, this.emailInput, this.messageInput].forEach(field => {
        if (field) field.style.borderColor = 'var(--color-border)';
      });
      if (this.submitButton) {
        this.submitButton.textContent = originalText;
        this.submitButton.disabled = false;
      }
    }, 1200);
  }

  showFeedback(message, type) {
    const existingFeedback = this.form.querySelector('.form-feedback');
    if (existingFeedback) existingFeedback.remove();
    const feedback = document.createElement('div');
    feedback.className = 'form-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
      margin-top: 15px;
      padding: 12px;
      border-radius: var(--border-radius-sm);
      font-size: var(--font-size-sm);
      text-align: center;
      background-color: ${type === 'success' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(255, 77, 77, 0.15)'};
      color: ${type === 'success' ? '#2ecc71' : '#ff4d4d'};
      border: 1px solid ${type === 'success' ? '#2ecc71' : '#ff4d4d'};
      animation: slideInLeft 0.4s ease-out forwards;
    `;
    this.form.appendChild(feedback);
    setTimeout(() => feedback.remove(), 5000);
  }
}

class ScrollAnimation {
  constructor() {
    this.observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    this.initObserver();
  }

  initObserver() {
    const elementsToAnimate = document.querySelectorAll('.card-habilidade, .card-projeto, .lado-habilidades');
    if (!elementsToAnimate.length) return;
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observerInstance.unobserve(entry.target);
        }
      });
    }, this.observerOptions);
    elementsToAnimate.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(25px)';
      element.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      observer.observe(element);
    });
  }
}

class SkillBars {
  constructor() {
    this.skillBars = document.querySelectorAll('.nivel');
    this.observerOptions = { threshold: 0.3 };
    if (this.skillBars.length) this.initObserver();
  }

  initObserver() {
    this.skillBars.forEach(bar => { bar.style.animation = 'none'; });
    const observer = new IntersectionObserver((entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const parentBar = bar.closest('.barra');
          if (parentBar) {
            const spanElements = parentBar.querySelectorAll('span');
            let percentText = '100%';
            spanElements.forEach(span => {
              if (span.textContent.includes('%')) percentText = span.textContent.trim();
            });
            bar.style.setProperty('--fill-width', percentText);
            bar.style.width = '0%';
            void bar.offsetWidth;
            bar.style.animation = 'skillFill 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
          }
          observerInstance.unobserve(bar);
        }
      });
    }, this.observerOptions);
    this.skillBars.forEach(bar => observer.observe(bar));
  }
}

class App {
  constructor() {
    this.init();
  }

  init() {
    try {
      new Navigation();
      new Form();
      new ScrollAnimation();
      new SkillBars();
    } catch (error) {
      console.error(error);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}