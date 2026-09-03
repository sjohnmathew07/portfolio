/**
 * SUDHARSHAN REDDY — EDITORIAL MONOCHROME PORTFOLIO
 * Vanilla JavaScript (Zero External Dependencies, Zero Emojis)
 */

document.addEventListener('DOMContentLoaded', () => {
  initLocalClock();
  initInteractiveCube();
  initNavigation();
  initProjectFiltering();
  initClipboardActions();
  initContactForm();
  updateCurrentYear();
});

/**
 * Live Clock: Displays Indian Standard Time (IST / UTC+5:30)
 */
function initLocalClock() {
  const clockElement = document.getElementById('currentTime');
  if (!clockElement) return;

  function updateClock() {
    try {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      const formatter = new Intl.DateTimeFormat([], options);
      const timeString = formatter.format(new Date());
      clockElement.textContent = `${timeString} IST`;
    } catch (e) {
      const now = new Date();
      clockElement.textContent = now.toTimeString().split(' ')[0] + ' IST';
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * Interactive 3D Cube Widget: Pointer Drag & Button Controls
 */
function initInteractiveCube() {
  const cube = document.getElementById('interactiveCube');
  const scene = document.getElementById('cubeScene');
  const btnRotateX = document.getElementById('cubeRotateX');
  const btnRotateY = document.getElementById('cubeRotateY');
  const btnReset = document.getElementById('cubeReset');

  if (!cube || !scene) return;

  let currentX = -22;
  let currentY = 32;
  let isDragging = false;
  let startX = 0;
  let startY = 0;

  function applyTransform() {
    cube.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
  }

  // Pointer drag interactions
  scene.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    scene.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    currentY += deltaX * 0.45;
    currentX -= deltaY * 0.45;

    startX = e.clientX;
    startY = e.clientY;

    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      scene.style.cursor = 'grab';
    }
  });

  // Touch controls for mobile
  scene.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;

    currentY += deltaX * 0.4;
    currentX -= deltaY * 0.4;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    applyTransform();
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Buttons controls
  if (btnRotateX) {
    btnRotateX.addEventListener('click', () => {
      currentX += 45;
      applyTransform();
    });
  }

  if (btnRotateY) {
    btnRotateY.addEventListener('click', () => {
      currentY += 45;
      applyTransform();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      currentX = -22;
      currentY = 32;
      applyTransform();
    });
  }
}

/**
 * Header & Mobile Navigation Menu
 */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  // Header scroll border feedback
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightActiveSection();
  }, { passive: true });

  // Mobile menu toggle
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu on navigation click
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ScrollSpy active link update
  function highlightActiveSection() {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navItems.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/**
 * Project Category Filter Tabs
 */
function initProjectFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetFilter = button.getAttribute('data-filter');

      // Update button active state
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Filter cards
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (targetFilter === 'all' || category === targetFilter) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 300ms ease';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Clipboard Utilities & Monochrome Toast Feedback
 */
function initClipboardActions() {
  const copyButtons = [
    document.getElementById('copyEmailQuickBtn'),
    document.getElementById('copyEmailContactBtn')
  ].filter(Boolean);

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const email = button.getAttribute('data-email') || 'rsudharshan354@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast(`Email copied to clipboard: ${email}`);
      } catch (err) {
        const tempInput = document.createElement('input');
        tempInput.value = email;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        showToast(`Email copied: ${email}`);
      }
    });
  });
}

/**
 * Toast Notification System (Monochrome, Non-intrusive)
 */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;

  container.appendChild(toast);

  void toast.offsetWidth;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }, 2800);
}

/**
 * Contact Form Handling & Validation
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('senderName');
  const emailInput = document.getElementById('senderEmail');
  const messageInput = document.getElementById('messageBody');
  const submitBtn = document.getElementById('submitBtn');
  const feedback = document.getElementById('formFeedback');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    clearErrors();

    // Validate Name
    if (!nameInput.value.trim()) {
      showFieldError('nameError', 'Please provide your name or organization name.');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      showFieldError('emailError', 'Please enter your email address.');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showFieldError('emailError', 'Please enter a valid email address format.');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      showFieldError('messageError', 'Please enter a brief message regarding your inquiry.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showFieldError('messageError', 'Message should contain at least 10 characters.');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate sending with clear feedback
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Transmitting dispatch...</span>';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
      
      const senderName = nameInput.value.trim();
      form.reset();

      feedback.className = 'form-feedback success';
      feedback.textContent = `Thank you, ${senderName}. Your message has been prepared. For direct communication, you may also write directly to rsudharshan354@gmail.com or call +91 9100980829.`;
      
      showToast('Message inquiry dispatched successfully.');

      setTimeout(() => {
        feedback.style.display = 'none';
        feedback.className = 'form-feedback';
      }, 9000);
    }, 700);
  });

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
      el.classList.remove('visible');
    });
    feedback.textContent = '';
    feedback.className = 'form-feedback';
    feedback.style.display = 'none';
  }

  function showFieldError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
  }
}

/**
 * Set Dynamic Footer Year
 */
function updateCurrentYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
