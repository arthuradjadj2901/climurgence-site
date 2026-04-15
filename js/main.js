/* ClimUrgence — main.js — vanilla JS minimal */
(function () {
  'use strict';

  /* ── Theme (dark/light) ── */
  const THEME_KEY = 'cu-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
  }

  initTheme();

  document.addEventListener('DOMContentLoaded', function () {

    /* Theme toggle button */
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        const current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    /* ── Mobile nav ── */
    const navToggle = document.getElementById('navToggle');
    const mainNav   = document.getElementById('mainNav');
    if (navToggle && mainNav) {
      navToggle.addEventListener('click', function () {
        const open = mainNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      });
      /* Fermer au clic extérieur */
      document.addEventListener('click', function (e) {
        if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* ── Active nav link ── */
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(function (link) {
      if (link.href === window.location.href ||
          (link.href !== window.location.origin + '/' && window.location.href.startsWith(link.href))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    /* ── FAQ Accordion ── */
    const faqBtns = document.querySelectorAll('.faq-question');
    faqBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        /* Fermer tous */
        faqBtns.forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
          const ans = document.getElementById(b.getAttribute('aria-controls'));
          if (ans) ans.classList.remove('open');
        });
        /* Ouvrir celui-ci si fermé */
        if (!expanded) {
          btn.setAttribute('aria-expanded', 'true');
          const answer = document.getElementById(btn.getAttribute('aria-controls'));
          if (answer) answer.classList.add('open');
        }
      });
    });

    /* ── Formulaire devis : validation basique ── */
    const forms = document.querySelectorAll('.form-devis');
    console.log('[ClimUrgence] Formulaires .form-devis trouvés :', forms.length);
    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        console.log('[ClimUrgence] Submit intercepté par JS');

        const tel  = form.querySelector('input[name="telephone"]');
        const nom  = form.querySelector('input[name="nom"]');
        const cp   = form.querySelector('input[name="codepostal"]');

        console.log('[ClimUrgence] nom =', nom ? '"' + nom.value + '"' : 'CHAMP ABSENT');
        console.log('[ClimUrgence] telephone =', tel ? '"' + tel.value + '"' : 'CHAMP ABSENT');
        console.log('[ClimUrgence] codepostal =', cp ? '"' + cp.value + '"' : 'CHAMP ABSENT');

        let ok = true;

        if (!nom || !nom.value.trim()) {
          if (nom) nom.style.borderColor = '#e53e3e';
          console.warn('[ClimUrgence] KO : nom vide ou absent');
          ok = false;
        } else {
          nom.style.borderColor = '';
          console.log('[ClimUrgence] OK : nom');
        }

        if (!tel || !tel.value.trim()) {
          if (tel) tel.style.borderColor = '#e53e3e';
          console.warn('[ClimUrgence] KO : telephone vide ou absent');
          ok = false;
        } else {
          tel.style.borderColor = '';
          console.log('[ClimUrgence] OK : telephone présent');
        }

        if (!cp || !cp.value.trim()) {
          if (cp) cp.style.borderColor = '#e53e3e';
          console.warn('[ClimUrgence] KO : codepostal vide ou absent');
          ok = false;
        } else {
          cp.style.borderColor = '';
          console.log('[ClimUrgence] OK : codepostal');
        }

        if (tel && tel.value && !/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(tel.value.replace(/\s/g, ''))) {
          tel.style.borderColor = '#e53e3e';
          console.warn('[ClimUrgence] KO : telephone invalide (regex) — valeur :', tel.value);
          ok = false;
        } else if (tel && tel.value) {
          console.log('[ClimUrgence] OK : telephone regex');
        }

        console.log('[ClimUrgence] Validation finale ok =', ok);

        if (ok) {
          const btn = form.querySelector('[type="submit"]');
          if (btn) {
            btn.disabled = true;
            btn.textContent = 'Envoi en cours…';
          }
          var payload = {
            nom:        (form.querySelector('[name="nom"]')       || {}).value || '',
            telephone:  (form.querySelector('[name="telephone"]') || {}).value || '',
            codepostal: (form.querySelector('[name="codepostal"]')|| {}).value || '',
            email:      (form.querySelector('[name="email"]')     || {}).value || '',
            probleme:   (form.querySelector('[name="probleme"]')  || {}).value || '',
            message:    (form.querySelector('[name="message"]')   || {}).value || ''
          };
          console.log('[ClimUrgence] Envoi du formulaire vers Make :', payload);
          fetch('https://hook.eu1.make.com/97up5ekyx2f2569xraan8psr1u3locta', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).then(function (res) {
            console.log('[ClimUrgence] Réponse Make reçue — statut HTTP :', res.status);
            return res.text();
          }).then(function (body) {
            console.log('[ClimUrgence] Corps de la réponse Make :', body);
          }).catch(function (err) {
            console.error('[ClimUrgence] ERREUR fetch Make :', err);
          }).finally(function () {
            console.log('[ClimUrgence] Fin du fetch — affichage message de confirmation');
            form.innerHTML = '<p style="color:var(--blue);font-weight:700;text-align:center;padding:2rem;">✅ Votre demande a été envoyée ! Nous vous rappelons sous 30 minutes.</p>';
          });
        }
      });
    });

    /* ── Scroll : cacher bouton mobile si on est en haut ── */
    /* (désactivé : toujours visible car urgence permanente) */

  });
})();
