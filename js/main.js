/* ClimUrgence — main.js — vanilla JS minimal */
(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════
     Theme (dark/light)
  ═══════════════════════════════════════════════════════════════ */
  var THEME_KEY = 'cu-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var btn = document.getElementById('themeToggle');
    if (btn) btn.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    var saved = localStorage.getItem(THEME_KEY);
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
  }

  initTheme();

  /* ═══════════════════════════════════════════════════════════════
     Helpers formulaires (utilisés par .form-devis et .modal-form)
  ═══════════════════════════════════════════════════════════════ */
  var TEL_REGEX   = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var ENDPOINT    = '/api/lead';
  var ERR_GENERIC = '⚠️ Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous appeler au 06 43 72 18 50.';

  function setErr(el, isErr) {
    if (el) el.style.borderColor = isErr ? '#e53e3e' : '';
  }

  function getValue(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? (el.value || '').trim() : '';
  }

  /**
   * Construit le payload à envoyer à /api/lead à partir de tous les
   * champs `name` présents dans le formulaire + métadonnées.
   */
  function buildPayload(form) {
    var payload = {
      type:         form.dataset.leadType || 'contact',
      sujet:        form.dataset.leadSujet || '',
      page_origine: window.location.pathname || ''
    };
    var inputs = form.querySelectorAll('[name]');
    for (var i = 0; i < inputs.length; i++) {
      var el = inputs[i];
      if (!el.name) continue;
      payload[el.name] = (el.value || '').trim();
    }
    return payload;
  }

  /**
   * Valide un formulaire : nom requis + (telephone valide OU email valide).
   * Surligne en rouge les champs invalides. Retourne true/false.
   */
  function validateForm(form) {
    var nom   = form.querySelector('[name="nom"]');
    var tel   = form.querySelector('[name="telephone"]');
    var email = form.querySelector('[name="email"]');
    var cp    = form.querySelector('[name="codepostal"]');

    var ok = true;

    // Nom requis
    if (!nom || !nom.value.trim()) { setErr(nom, true); ok = false; } else setErr(nom, false);

    // Téléphone requis + format français valide
    if (!tel || !tel.value.trim() || !TEL_REGEX.test(tel.value.replace(/\s/g, ''))) {
      setErr(tel, true); ok = false;
    } else setErr(tel, false);

    // Email requis + format valide
    if (!email || !email.value.trim() || !EMAIL_REGEX.test(email.value)) {
      setErr(email, true); ok = false;
    } else setErr(email, false);

    // Code postal si marqué `required` dans le HTML
    if (cp && cp.required && !cp.value.trim()) { setErr(cp, true); ok = false; }
    else if (cp) setErr(cp, false);

    return ok;
  }

  /**
   * Affiche un message d'erreur inline (et le crée si absent).
   */
  function showError(form, msg) {
    var errEl = form.querySelector('.form-send-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'form-send-error';
      errEl.style.cssText = 'color:#e53e3e;font-weight:700;text-align:center;margin-top:1rem;';
      form.appendChild(errEl);
    }
    errEl.textContent = msg || ERR_GENERIC;
  }

  /**
   * Soumission AJAX vers /api/lead.
   * Si le formulaire est dans une modal (.modal-form), succès = remplacer
   * la .modal-box. Sinon = remplacer le contenu du <form>.
   */
  function submitLead(form, btn, originalBtnText) {
    var payload = buildPayload(form);

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.text().then(function (body) {
        if (!res.ok) {
          var msg = ERR_GENERIC;
          try {
            var parsed = JSON.parse(body);
            if (parsed && parsed.error) msg = '⚠️ ' + parsed.error;
          } catch (e) { /* body non-JSON, on garde le message générique */ }
          throw new Error(msg);
        }
      });
    }).then(function () {
      // Succès : feedback selon le type de formulaire
      if (form.classList.contains('modal-form')) {
        var modalBox = form.closest('.modal-box');
        if (modalBox) {
          modalBox.innerHTML =
            '<div style="padding:2.5rem;text-align:center;">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)" stroke-width="2.5" style="width:48px;height:48px;margin:0 auto 1rem;display:block;"><polyline points="20 6 9 17 4 12"/></svg>' +
              '<p style="font-weight:700;color:var(--blue);font-size:1.1rem;margin-bottom:.5rem;">Demande envoyée !</p>' +
              '<p style="color:var(--text-muted);font-size:.9rem;margin-bottom:1.5rem;">Nous vous rappelons sous 30 minutes.</p>' +
              '<button class="btn btn-outline" type="button" onclick="document.getElementById(\'tarifModal\').classList.remove(\'open\');document.body.style.overflow=\'\';">Fermer</button>' +
            '</div>';
        }
      } else {
        form.innerHTML =
          '<p style="color:var(--blue);font-weight:700;text-align:center;padding:2rem;">' +
            'Votre demande a été envoyée ! Nous vous rappelons sous 30 minutes.' +
          '</p>';
      }
    }).catch(function (err) {
      console.error('[ClimUrgence] Erreur /api/lead :', err.message || err);
      if (btn) {
        btn.disabled = false;
        btn.textContent = originalBtnText;
      }
      showError(form, err.message || ERR_GENERIC);
    });
  }

  /**
   * Attache le handler à un formulaire (.form-devis ou .modal-form).
   */
  function attachLeadHandler(form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(form)) return;

      var btn = form.querySelector('[type="submit"]');
      var originalBtnText = btn ? btn.textContent : '';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Envoi en cours…';
      }
      submitLead(form, btn, originalBtnText);
    });
  }

  /* ═══════════════════════════════════════════════════════════════
     DOMContentLoaded — wiring de toute la page
  ═══════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', function () {

    /* Theme toggle button */
    var themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
      });
    }

    /* Mobile nav */
    var navToggle = document.getElementById('navToggle');
    var mainNav   = document.getElementById('mainNav');
    if (navToggle && mainNav) {
      navToggle.addEventListener('click', function () {
        var open = mainNav.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      });
      document.addEventListener('click', function (e) {
        if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
          mainNav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* Active nav link */
    var navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(function (link) {
      if (link.href === window.location.href ||
          (link.href !== window.location.origin + '/' && window.location.href.startsWith(link.href))) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    /* FAQ Accordion */
    var faqBtns = document.querySelectorAll('.faq-question');
    faqBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        faqBtns.forEach(function (b) {
          b.setAttribute('aria-expanded', 'false');
          var ans = document.getElementById(b.getAttribute('aria-controls'));
          if (ans) ans.classList.remove('open');
        });
        if (!expanded) {
          btn.setAttribute('aria-expanded', 'true');
          var answer = document.getElementById(btn.getAttribute('aria-controls'));
          if (answer) answer.classList.add('open');
        }
      });
    });

    /* ═══ Formulaires : .form-devis (home + contact) ═══ */
    var devisForms = document.querySelectorAll('.form-devis');
    devisForms.forEach(attachLeadHandler);

    /* ═══ Formulaire modal : .modal-form (page tarifs) ═══ */
    var modalForms = document.querySelectorAll('.modal-form');
    modalForms.forEach(attachLeadHandler);

  });
})();
