/**
 * Component Loader
 * Fetches HTML fragments and injects them into the DOM.
 * Includes local fallback mechanism for offline or file:// protocol testing.
 */
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;

        if (elementId === 'header-placeholder') {
            initializeHeaderScripts();
        }
    } catch (error) {
        console.warn('Component loading fetch failed, attempting local fallback:', error);
        // Fallback for local file:// testing or failed fetches
        loadLocalFallback(elementId);
    }
}

/**
 * Fallback static HTML templates to prevent CORS loading errors on local file:// testing.
 */
function loadLocalFallback(elementId) {
    if (elementId === 'header-placeholder') {
        const headerHTML = `
<header id="header" class="header sticky-top">
    <div class="topbar d-flex align-items-center">
      <div class="container d-flex justify-content-center justify-content-md-between">
        <div class="contact-info d-flex align-items-center">
          <i class="bi bi-envelope d-flex align-items-center"><a href="mailto:acevetcare@gmail.com">acevetcare@gmail.com</a></i>
          <i class="bi bi-phone d-flex align-items-center ms-3 ms-md-4">
            <a href="tel:+254703824551">+254 703 824 551</a>
          </i>
        </div>
        <div class="social-links d-none d-md-flex align-items-center">
          <a href="https://pin.it/4WcSck2Lt" class="pinterest" aria-label="Pinterest"><i class="bi bi-pinterest"></i></a>
          <a href="#" class="facebook" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
          <a href="https://www.instagram.com/acevetkenya" class="instagram" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
          <a href="https://wa.me/254703824551" class="whatsapp" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
          <a href="http://tiktok.com/@acevetkenya" class="tiktok" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
        </div>
      </div>
    </div>
    <div class="branding d-flex align-items-center">
      <div class="container">
        <div class="glass-nav-bubble d-flex align-items-center justify-content-between">
          <a href="index.html" class="logo d-flex align-items-center">
            <img src="assets/assets/ACE VET CARE.png" alt="Ace Vet Care Logo">
            <span class="sitename">ACE VET CARE</span>
          </a>
          <nav id="navmenu" class="navmenu d-none d-xl-flex">
            <ul class="desktop-nav-list">
              <li><a href="index.html#hero" class="active">Home</a></li>
              <li><a href="index.html#about">About Us</a></li>
              <li><a href="index.html#services">Services</a></li>
              <li><a href="index.html#departments">Departments</a></li>
              <li><a href="index.html#doctors">Doctors</a></li>
              <li><a href="blog-details.html">Blog</a></li>
              <li><a href="index.html#contact">Contact</a></li>
            </ul>
          </nav>
          <div class="d-flex align-items-center gap-2">
            <a class="cta-btn d-none d-sm-flex align-items-center" href="index.html#appointment"><i class="bi bi-calendar-event me-2"></i> Make Appointment</a>
            <button type="button" class="mobile-nav-toggle d-xl-none" aria-label="Toggle Navigation" title="Toggle Navigation">
              <span class="burger-bar bar-1"></span>
              <span class="burger-bar bar-2"></span>
              <span class="burger-bar bar-3"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div id="mobile-nav-overlay" class="mobile-nav-overlay d-xl-none">
      <div class="mobile-drawer-card">
        <div class="mobile-drawer-header">
          <div class="d-flex align-items-center gap-2">
            <img src="assets/assets/ACE VET CARE.png" alt="Logo" width="36" height="36">
            <div>
              <h6 class="fw-bold mb-0 text-dark" style="font-size: 0.95rem;">ACE VET CARE</h6>
              <small class="text-muted" style="font-size: 0.72rem;">Kiambu Road, Nairobi</small>
            </div>
          </div>
          <button type="button" class="mobile-drawer-close" aria-label="Close Menu" title="Close Menu">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <ul class="mobile-drawer-links">
          <li><a href="index.html#hero" class="active"><span class="nav-icon"><i class="bi bi-house-door-fill"></i></span><span class="nav-text">Home</span><i class="bi bi-chevron-right ms-auto arrow-icon"></i></a></li>
          <li><a href="index.html#about"><span class="nav-icon"><i class="bi bi-info-circle-fill"></i></span><span class="nav-text">About Us</span><i class="bi bi-chevron-right ms-auto arrow-icon"></i></a></li>
          <li><a href="index.html#services"><span class="nav-icon"><i class="bi bi-grid-fill"></i></span><span class="nav-text">Services</span><i class="bi bi-chevron-right ms-auto arrow-icon"></i></a></li>
          <li><a href="index.html#departments"><span class="nav-icon"><i class="bi bi-building-fill"></i></span><span class="nav-text">Departments</span><i class="bi bi-chevron-right ms-auto arrow-icon"></i></a></li>
          <li><a href="index.html#doctors"><span class="nav-icon"><i class="bi bi-person-badge-fill"></i></span><span class="nav-text">Doctors</span><i class="bi bi-chevron-right ms-auto arrow-icon"></i></a></li>
          <li><a href="blog-details.html"><span class="nav-icon"><i class="bi bi-journal-text"></i></span><span class="nav-text">Blog</span><i class="bi bi-chevron-right ms-auto arrow-icon"></i></a></li>
          <li><a href="index.html#contact"><span class="nav-icon"><i class="bi bi-geo-alt-fill"></i></span><span class="nav-text">Contact</span><i class="bi bi-chevron-right ms-auto arrow-icon"></i></a></li>
          <li><a href="admin.html" target="_blank" class="staff-link"><span class="nav-icon"><i class="bi bi-shield-lock-fill"></i></span><span class="nav-text">Staff Portal</span><i class="bi bi-chevron-right ms-auto arrow-icon"></i></a></li>
        </ul>
        <div class="mobile-drawer-actions">
          <a href="index.html#appointment" class="btn btn-primary rounded-pill w-100 mb-2 py-2 fw-semibold"><i class="bi bi-calendar-check-fill me-2"></i> Book Appointment</a>
          <a href="https://wa.me/254703824551?text=Hello%20Ace%20Vet%20Care,%20I%20would%20like%20to%20inquire%20about%20veterinary%20services." target="_blank" class="btn btn-success rounded-pill w-100 py-2 fw-semibold"><i class="bi bi-whatsapp me-2"></i> WhatsApp Chat</a>
          <div class="emergency-badge mt-2 text-center">
            <a href="tel:+254703824551" class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 rounded-pill px-3 py-2 w-100 d-block text-decoration-none">
              <i class="bi bi-telephone-fill me-1"></i> 24/7 Emergency: +254 703 824 551
            </a>
          </div>
        </div>
      </div>
    </div>
</header>`;
        document.getElementById(elementId).innerHTML = headerHTML;
        initializeHeaderScripts();
    } else if (elementId === 'footer-placeholder') {
        const footerHTML = `
<footer id="footer" class="footer light-background">
    <div class="container footer-top">
      <div class="row gy-4">
        <div class="col-lg-4 col-md-6 footer-about">
          <a href="index.html" class="logo d-flex align-items-center">
            <span class="sitename">ACE VET CARE </span>
          </a>
          <div class="footer-contact pt-3">
            <p>Off Kiambu Road.</p>
            <p>RRVQ+QG Kiambu</p>
            <p>Nairobi, Muthaiga Square</p>
            <p class="mt-3"><strong>Phone:</strong> <span>+254 703 824 551</span></p>
            <p><strong>Email:</strong> <span>acevetcare@gmail.com</span></p>
          </div>
          <div class="social-links d-flex mt-4">
            <a href="https://pin.it/4WcSck2Lt" aria-label="Pinterest"><i class="bi bi-pinterest"></i></a>
            <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
            <a href="https://www.instagram.com/acevetkenya" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
            <a href="https://wa.me/254703824551" class="whatsapp" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i></a>
            <a href="http://tiktok.com/@acevetkenya" class="tiktok" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
          </div>
        </div>
        <div class="col-lg-4 col-md-6 footer-links">
          <h4>Opening Hours</h4>
          <ul class="list-unstyled" style="color: var(--default-color); line-height: 1.8;">
            <li><strong>Mon - Fri:</strong> 8:00 AM - 6:00 PM</li>
            <li><strong>Saturday:</strong> 9:00 AM - 4:00 PM</li>
            <li><strong>Sunday:</strong> 10:00 AM - 2:00 PM</li>
            <li class="mt-2"><span class="badge bg-danger text-white p-2"><i class="fas fa-ambulance me-1"></i>24/7 Emergency Care</span></li>
          </ul>
        </div>
        <div class="col-lg-2 col-md-3 footer-links">
          <h4>Department</h4>
          <ul>
            <li><a href="#">Grooming</a></li>
            <li><a href="#">Surgery</a></li>
            <li><a href="#">Boarding</a></li>
            <li><a href="#">Treatment</a></li>
            <li><a href="#">Vaccination</a></li>
          </ul>
        </div>
        <div class="col-lg-2 col-md-3 footer-links">
          <h4>Useful Links</h4>
          <ul>
            <li><a href="index.html#hero">Home</a></li>
            <li><a href="index.html#about">About us</a></li>
            <li><a href="index.html#services">Services</a></li>
            <li><a href="blog-details.html">Blog</a></li>
            <li><a href="admin.html" target="_blank"><i class="bi bi-shield-lock me-1"></i>Staff Portal</a></li>
          </ul> 
        </div>
      </div>
    </div>
    <div class="container copyright text-center mt-4">
      <p>© <span>Copyright</span> <strong class="px-1 sitename">ACE VET CARE</strong> <span>All Rights Reserved</span></p>
      <div class="credits">
        Designed by <a href="https://acevetcare.co.ke">Emmanuel Nyakundi</a> | Distributed by <a href="#">DATA PORT INC // EXCEL ENT</a>
      </div>
    </div>
</footer>
<div id="mobile-action-bar">
  <a href="tel:+254703824551" class="mobile-action-btn btn-call" aria-label="Call Doctor">
    <i class="bi bi-telephone-fill"></i>
    <span>Call</span>
  </a>
  <a href="https://wa.me/254703824551?text=Hello%20Ace%20Vet%20Care,%20I%20would%20like%20to%20inquire%20about%20veterinary%20services." target="_blank" class="mobile-action-btn btn-wa" aria-label="WhatsApp Doctor">
    <i class="bi bi-whatsapp"></i>
    <span>WhatsApp</span>
  </a>
  <a href="index.html#appointment" class="mobile-action-btn btn-book" aria-label="Book Appointment">
    <i class="bi bi-calendar-check-fill"></i>
    <span>Book Visit</span>
  </a>
</div>`;
        document.getElementById(elementId).innerHTML = footerHTML;
    }
}

/**
 * Re-attach event listeners for the header (mobile toggle, smooth close, etc.)
 */
function initializeHeaderScripts() {
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    const mobileDrawerCloseBtn = document.querySelector('.mobile-drawer-close');
    const overlay = document.querySelector('#mobile-nav-overlay');
    const body = document.querySelector('body');

    // Ensure the overlay is appended to body so no parent transform/filter restricts fixed positioning
    if (overlay && overlay.parentElement !== document.body) {
        document.body.appendChild(overlay);
    }

    function openMobileNav() {
        body.classList.add('mobile-nav-active');
        if (overlay) overlay.classList.add('active');
        if (mobileNavToggleBtn) mobileNavToggleBtn.classList.add('active');
    }

    function closeMobileNav() {
        body.classList.remove('mobile-nav-active');
        if (overlay) overlay.classList.remove('active');
        if (mobileNavToggleBtn) mobileNavToggleBtn.classList.remove('active');
    }

    function toggleMobileNav() {
        if (body.classList.contains('mobile-nav-active')) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    }

    if (mobileNavToggleBtn) {
        // Clean any pre-existing listeners
        mobileNavToggleBtn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileNav();
        };
    }

    if (mobileDrawerCloseBtn) {
        mobileDrawerCloseBtn.onclick = function (e) {
            e.preventDefault();
            e.stopPropagation();
            closeMobileNav();
        };
    }

    // Hide mobile nav when clicking any link inside the drawer
    if (overlay) {
        overlay.querySelectorAll('a').forEach(navLink => {
            navLink.addEventListener('click', () => {
                closeMobileNav();
            });
        });

        // Close when clicking outside the drawer card (on the backdrop overlay)
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                closeMobileNav();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && body.classList.contains('mobile-nav-active')) {
            closeMobileNav();
        }
    });

    // Close automatically if viewport resized to desktop (>= 1200px)
    window.addEventListener('resize', function () {
        if (window.innerWidth >= 1200 && body.classList.contains('mobile-nav-active')) {
            closeMobileNav();
        }
    });
}
