/**
 * Fleet Feedback Widget (fbw) - vanilla JS, zero dependencies.
 * Drop-in via script tag with data-* config and/or window.FEEDBACK_CONFIG.
 * Safe for React apps and plain static HTML.
 *
 * Submit: generic JSON POST (Formspree / FormSubmit AJAX). Config keys:
 *   endpointUrl (empty by default)
 *   fieldMap: { message, page, screen, browser, time, honeypot }
 *
 * Also: app, build, contextFn, consentSelector, exclude
 *
 * Opt-out (page level):
 *   <meta name="fbw" content="off">  OR  <body data-fbw="off">
 */
(function (root, factory) {
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  }
  if (typeof root !== 'undefined') {
    root.FleetFeedbackWidget = api;
    if (typeof document !== 'undefined') {
      api.autoInit();
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var PREFIX = 'fbw';
  var MAX_TEXT = 1000;
  var MIN_OPEN_MS = 3000;
  var MAX_HOUR = 5;
  var MAX_DAY = 20;
  var LS_KEY = 'fbw_send_log_v1';
  var MIN_CONSENT_GAP = 8;
  var FAB_SIZE_PX = 44;
  var FAB_EDGE_PX = 14;
  var FOOTER_CLEAR_GAP_PX = 12;
  var STYLE_ID = 'fbw-styles';
  var ROOT_ATTR = 'data-fbw-root';
  var PAD_ATTR = 'data-fbw-pad';
  var DEFAULT_HIDE_WHEN = '[data-fleet-plan]';

  var DEFAULT_CONSENT_SELECTORS = [
    '[data-consent-bar]',
    '[data-cookie-consent]',
    '#cookie-consent',
    '.cookie-consent',
    '.consent-bar',
  ];

  /* ---------- pure helpers (exported for tests) ---------- */

  function stripControlChars(text) {
    return String(text || '')
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .slice(0, MAX_TEXT);
  }

  function stripQuery(url) {
    try {
      var u = new URL(url, 'https://example.invalid');
      return u.pathname + (u.hash || '');
    } catch (e) {
      var s = String(url || '');
      var q = s.indexOf('?');
      if (q >= 0) {
        var hash = s.indexOf('#');
        if (hash > q) return s.slice(0, q) + s.slice(hash);
        return s.slice(0, q);
      }
      return s;
    }
  }

  var DEFAULT_FIELD_MAP = {
    message: 'message',
    page: 'page',
    screen: 'screen',
    browser: 'browser',
    time: 'time',
    honeypot: '_gotcha',
  };

  function mergeFieldMap(override) {
    var out = {};
    var keys = ['message', 'page', 'screen', 'browser', 'time', 'honeypot'];
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var v = override && override[k] != null && String(override[k]).length ? String(override[k]) : DEFAULT_FIELD_MAP[k];
      out[k] = v;
    }
    return out;
  }

  /** Build JSON body using fieldMap names. No PII keys. */
  function buildJsonBody(fieldMap, values) {
    var map = mergeFieldMap(fieldMap);
    var v = values || {};
    var body = {};
    body[map.message] = stripControlChars(v.message || '');
    body[map.page] = String(v.page || '');
    body[map.screen] = String(v.screen || '');
    body[map.browser] = String(v.browser || '');
    body[map.time] = String(v.time || '');
    body[map.honeypot] = String(v.honeypot || '');
    return body;
  }

  function formatPageField(opts) {
    var o = opts || {};
    var parts = [];
    var url = stripQuery(o.url || '');
    if (url) parts.push(url);
    if (o.context) parts.push(String(o.context));
    if (o.app) parts.push('app=' + String(o.app));
    if (o.build) parts.push('build=' + String(o.build));
    if (o.viewport) parts.push('viewport=' + String(o.viewport));
    if (o.tz) parts.push('tz=' + String(o.tz));
    return parts.join(' | ');
  }

  function bodyHasPiiKeys(body) {
    var banned = [
      'name',
      'email',
      'cookie',
      'cookies',
      'userid',
      'user_id',
      'ip',
      'analytics',
      'ga',
      'gtag',
      'clientid',
      'client_id',
    ];
    var keys = Object.keys(body || {});
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i].toLowerCase();
      // Allow FormSubmit honeypot name _gotcha; block identity fields only.
      for (var j = 0; j < banned.length; j++) {
        if (k === banned[j]) return true;
      }
    }
    return false;
  }

  /**
   * AJAX success:
   * - Formspree: HTTP 2xx and json.ok === true
   * - FormSubmit: HTTP 2xx and json.success === true or "true"
   * Failure if non-2xx, missing/invalid JSON, or a non-empty json.errors array.
   */
  function isSubmitSuccess(responseOk, json) {
    if (!responseOk) return false;
    if (!json || typeof json !== 'object') return false;
    if (Array.isArray(json.errors) && json.errors.length > 0) return false;
    if (json.ok === true) return true;
    if (json.success === true || json.success === 'true') return true;
    return false;
  }

  /**
   * Merge config: defaults < script data-* < window.FEEDBACK_CONFIG.
   * endpointUrl defaults to empty. Never invents a destination.
   */
  function resolveConfig(scriptCfg, win) {
    win = win || (typeof window !== 'undefined' ? window : {});
    var globalCfg = win.FEEDBACK_CONFIG && typeof win.FEEDBACK_CONFIG === 'object' ? win.FEEDBACK_CONFIG : {};
    var fromScript = scriptCfg || {};
    var fieldMap = mergeFieldMap(
      Object.assign(
        {},
        fromScript.fieldMap || {},
        globalCfg.fieldMap || {},
      ),
    );
    function pick(key, altKeys) {
      if (globalCfg[key] != null && globalCfg[key] !== '') return globalCfg[key];
      if (fromScript[key] != null && fromScript[key] !== '') return fromScript[key];
      if (altKeys) {
        for (var i = 0; i < altKeys.length; i++) {
          var a = altKeys[i];
          if (globalCfg[a] != null && globalCfg[a] !== '') return globalCfg[a];
          if (fromScript[a] != null && fromScript[a] !== '') return fromScript[a];
        }
      }
      return '';
    }
    return {
      app: String(pick('app') || ''),
      build: String(pick('build') || ''),
      endpointUrl: String(pick('endpointUrl', ['endpoint']) || ''),
      fieldMap: fieldMap,
      contextFn: String(pick('contextFn', ['contextFnName']) || ''),
      consentSelector: String(pick('consentSelector') || ''),
      exclude: String(pick('exclude') || ''),
      hideWhen: String(pick('hideWhen') || DEFAULT_HIDE_WHEN),
    };
  }

  function parseExcludeList(raw) {
    if (!raw) return [];
    return String(raw)
      .split(',')
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
  }

  function locationParts(loc) {
    loc = loc || (typeof location !== 'undefined' ? location : {});
    return {
      path: String(loc.pathname || ''),
      hash: String(loc.hash || ''),
      href: String(loc.href || ''),
    };
  }

  function matchesExclude(pattern, loc) {
    var p = String(pattern || '').trim();
    if (!p) return false;
    var parts = locationParts(loc);
    var path = parts.path;
    var hash = parts.hash;
    var combined = path + hash;
    var needle = p;
    // Patterns may be path (/privacy), hash (#/privacy), or path+hash.
    if (needle.charAt(0) === '#') {
      return hash === needle || hash.indexOf(needle) === 0 || hash.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    }
    if (needle.indexOf('#') !== -1) {
      return combined === needle || combined.indexOf(needle) !== -1;
    }
    // Path pattern: match pathname segment or hash route segment.
    var lower = needle.toLowerCase();
    if (path.toLowerCase() === lower || path.toLowerCase().indexOf(lower) !== -1) return true;
    // HashRouter style: #/privacy
    if (hash.toLowerCase().indexOf(lower) !== -1) return true;
    return false;
  }

  function isExcluded(excludeList, loc) {
    var list = excludeList || [];
    for (var i = 0; i < list.length; i++) {
      if (matchesExclude(list[i], loc)) return true;
    }
    return false;
  }

  function isOptedOut(doc) {
    doc = doc || (typeof document !== 'undefined' ? document : null);
    if (!doc) return false;
    var meta = doc.querySelector('meta[name="fbw"]');
    if (meta && String(meta.getAttribute('content') || '').toLowerCase() === 'off') return true;
    var body = doc.body;
    if (body && String(body.getAttribute('data-fbw') || '').toLowerCase() === 'off') return true;
    return false;
  }

  function consentClearancePx(barHeight, minGap) {
    var h = Number(barHeight) || 0;
    var gap = minGap == null ? MIN_CONSENT_GAP : minGap;
    if (h <= 0) return 0;
    return Math.ceil(h + Math.max(gap, MIN_CONSENT_GAP));
  }

  /** Extra body padding so scrolled footer text clears the resting FAB. */
  function fabPageReservePx() {
    return FAB_SIZE_PX + FAB_EDGE_PX + FOOTER_CLEAR_GAP_PX;
  }

  /** True when a host UI sheet (e.g. fleet plan) should hide the FAB. */
  function isHostUiBlocking(doc, hideWhen) {
    if (!doc || !doc.querySelector) return false;
    var sel = hideWhen == null || hideWhen === '' ? DEFAULT_HIDE_WHEN : String(hideWhen);
    if (!sel) return false;
    try {
      return !!doc.querySelector(sel);
    } catch (e) {
      return false;
    }
  }

  function readSendLog(storage) {
    storage = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!storage) return [];
    try {
      var raw = storage.getItem(LS_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function writeSendLog(log, storage) {
    storage = storage || (typeof localStorage !== 'undefined' ? localStorage : null);
    if (!storage) return;
    try {
      storage.setItem(LS_KEY, JSON.stringify(log));
    } catch (e) {
      /* ignore quota */
    }
  }

  function pruneLog(log, now) {
    now = now || Date.now();
    var dayAgo = now - 24 * 60 * 60 * 1000;
    return (log || []).filter(function (t) {
      return typeof t === 'number' && t >= dayAgo;
    });
  }

  function canSend(log, now) {
    now = now || Date.now();
    var pruned = pruneLog(log, now);
    var hourAgo = now - 60 * 60 * 1000;
    var hourCount = 0;
    for (var i = 0; i < pruned.length; i++) {
      if (pruned[i] >= hourAgo) hourCount++;
    }
    return {
      ok: hourCount < MAX_HOUR && pruned.length < MAX_DAY,
      hourCount: hourCount,
      dayCount: pruned.length,
      log: pruned,
    };
  }

  function recordSend(log, now, storage) {
    now = now || Date.now();
    var next = pruneLog(log, now).concat([now]);
    writeSendLog(next, storage);
    return next;
  }

  function defaultContext() {
    var hash = typeof location !== 'undefined' ? location.hash || '' : '';
    var title = typeof document !== 'undefined' ? document.title || '' : '';
    return (hash + ' ' + title).trim();
  }

  function resolveContext(fnName) {
    if (fnName && typeof root !== 'undefined' && typeof root[fnName] === 'function') {
      try {
        var v = root[fnName]();
        if (v != null && String(v).length) return String(v);
      } catch (e) {
        /* fall through */
      }
    }
    return defaultContext();
  }

  /* ---------- CSS ---------- */

  function cssText() {
    var reserve = fabPageReservePx();
    return [
      '.fbw-root{all:initial;font-family:system-ui,-apple-system,Segoe UI,sans-serif;box-sizing:border-box}',
      '.fbw-root *,.fbw-root *::before,.fbw-root *::after{box-sizing:border-box}',
      '.fbw-fab{position:fixed;left:14px;bottom:calc(14px + env(safe-area-inset-bottom,0px) + var(--fbw-consent-clearance,0px));z-index:2147483000;width:44px;height:44px;padding:0;margin:0;border:0;border-radius:50%;background:#1a1f2e;color:#fff;opacity:0.55;cursor:pointer;display:grid;place-items:center;box-shadow:0 4px 14px rgba(0,0,0,0.22);transition:opacity .15s ease,bottom .2s ease;-webkit-tap-highlight-color:transparent}',
      '.fbw-fab:hover,.fbw-fab:focus-visible,.fbw-fab[data-active="1"]{opacity:1}',
      '.fbw-fab:focus-visible{outline:2px solid #3b82f6;outline-offset:3px}',
      '.fbw-fab[hidden],.fbw-fab[data-fbw-hidden="1"]{display:none!important;pointer-events:none}',
      '.fbw-fab svg{width:22px;height:22px;display:block;pointer-events:none}',
      '.fbw-backdrop{position:fixed;left:0;right:0;top:0;bottom:var(--fbw-consent-clearance,0px);z-index:2147483001;background:rgba(10,14,22,0.42);transition:bottom .2s ease}',
      '.fbw-sheet{position:fixed;left:0;right:0;bottom:var(--fbw-consent-clearance,0px);z-index:2147483002;background:#fff;color:#111;border-radius:12px 12px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom,0px));box-shadow:0 -8px 28px rgba(0,0,0,0.18);max-height:min(70vh,520px);display:flex;flex-direction:column;gap:10px;transition:bottom .2s ease}',
      '.fbw-note{font-size:12px;line-height:1.35;color:#4b5563;margin:0}',
      '.fbw-ta{width:100%;min-height:96px;max-height:40vh;resize:vertical;border:1px solid #d1d5db;border-radius:8px;padding:10px 12px;font:inherit;font-size:15px;color:#111;background:#fff}',
      '.fbw-ta:focus{outline:2px solid #3b82f6;outline-offset:1px}',
      '.fbw-count{font-size:12px;line-height:1.3;color:#6b7280;margin:0;text-align:right}',
      '.fbw-actions{display:flex;gap:8px;justify-content:flex-end}',
      '.fbw-btn{appearance:none;border:0;border-radius:8px;min-height:40px;padding:0 14px;font:inherit;font-size:14px;font-weight:600;cursor:pointer}',
      '.fbw-btn-cancel{background:#e5e7eb;color:#111}',
      '.fbw-btn-send{background:#1a1f2e;color:#fff}',
      '.fbw-btn:disabled{opacity:0.5;cursor:not-allowed}',
      '.fbw-status{font-size:13px;color:#374151;min-height:1.2em;margin:0}',
      '.fbw-status-alone{font-size:15px;line-height:1.4;color:#111;margin:0;padding:4px 0 8px}',
      '.fbw-hp{position:absolute!important;left:-9999px!important;top:auto!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important}',
      'html[' +
        PAD_ATTR +
        '="1"]{--fbw-page-pad-bottom:calc(' +
        reserve +
        'px + env(safe-area-inset-bottom,0px))}',
      'html[' + PAD_ATTR + '="1"] body{padding-bottom:var(--fbw-page-pad-bottom)!important}',
      '@media (prefers-reduced-motion:reduce){.fbw-fab,.fbw-sheet,.fbw-backdrop{transition:none}}',
    ].join('');
  }

  function injectStyles(doc) {
    if (doc.getElementById(STYLE_ID)) return;
    var style = doc.createElement('style');
    style.id = STYLE_ID;
    style.textContent = cssText();
    doc.head.appendChild(style);
  }

  /* ---------- consent lift ---------- */

  function findConsentBar(doc, selector) {
    if (!doc) return null;
    var candidates = [];
    var sels = [];
    if (selector) sels.push(selector);
    for (var i = 0; i < DEFAULT_CONSENT_SELECTORS.length; i++) sels.push(DEFAULT_CONSENT_SELECTORS[i]);
    for (var s = 0; s < sels.length; s++) {
      try {
        doc.querySelectorAll(sels[s]).forEach(function (el) {
          candidates.push(el);
        });
      } catch (e) {
        /* bad selector */
      }
    }
    // Fallback: fixed/sticky bottom elements mentioning cookie/consent
    doc.querySelectorAll('div, aside, section, footer').forEach(function (el) {
      var text = (el.textContent || '').trim();
      if (!/cookie\s*consent|consent\s*bar|accept\s*cookies/i.test(text)) return;
      if (text.length > 220) return;
      candidates.push(el);
    });

    var topHit = null;
    var view = doc.defaultView;
    for (var c = 0; c < candidates.length; c++) {
      var el = candidates[c];
      var style = view && view.getComputedStyle ? view.getComputedStyle(el) : null;
      if (!style) continue;
      if (style.display === 'none' || style.visibility === 'hidden') continue;
      if (Number(style.opacity) === 0) continue;
      var pos = style.position;
      if (pos !== 'fixed' && pos !== 'sticky') continue;
      var rect = el.getBoundingClientRect();
      if (rect.height < 24 || rect.width < 80) continue;
      var vh = view.innerHeight || 0;
      if (rect.bottom < vh - 4 || rect.top > vh) continue;
      if (!topHit || rect.height > topHit.height) {
        topHit = { el: el, height: Math.round(rect.height) };
      }
    }
    return topHit;
  }

  function measureConsentClearance(doc, selector) {
    var hit = findConsentBar(doc, selector);
    return {
      barHeight: hit ? hit.height : 0,
      clearance: consentClearancePx(hit ? hit.height : 0),
      el: hit ? hit.el : null,
    };
  }

  /* ---------- speech ---------- */

  function getSpeechRecognitionCtor(win) {
    win = win || (typeof window !== 'undefined' ? window : null);
    if (!win) return null;
    return win.SpeechRecognition || win.webkitSpeechRecognition || null;
  }

  /* ---------- DOM widget ---------- */

  var activeInstance = null;

  function launcherSvg() {
    /*
     * Person-speaking launcher (side-profile head + voice lines).
     * Visual reference: Material Symbols "record_voice_over"
     * (Apache License 2.0, https://github.com/google/material-design-icons).
     * Paths below are original line/fill art for this widget, not a copy of
     * the Material glyph path data.
     */
    return (
      '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path fill="currentColor" d="M8.6 4.2c-2.45 0-4.4 2-4.4 5 0 1.9.9 3.25 2.05 4.1v2.7c0 .7.55 1.25 1.25 1.25h2.15c.7 0 1.25-.55 1.25-1.25v-1.15c.4-.08.8-.22 1.15-.42 1-.55 2-1.7 2-3.7 0-.9-.28-1.7-.75-2.35.14-.4.22-.82.22-1.28 0-1.85-1.5-3.9-3.92-3.9-.55 0-1.1.1-1.55.3z"/>' +
      '<path d="M15.15 8.05c.9.7 1.45 1.75 1.45 2.95s-.55 2.25-1.45 2.95" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>' +
      '<path d="M17.45 6.35c1.4 1.15 2.25 2.95 2.25 5s-.85 3.85-2.25 5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>' +
      '<path d="M19.7 4.7c1.9 1.55 3.05 4 3.05 6.8s-1.15 5.25-3.05 6.8" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>' +
      '</svg>'
    );
  }

  function createWidget(config) {
    var doc = config.document || document;
    var win = config.window || window;
    var resolved = resolveConfig(config, win);
    // Direct config props (tests / callers) override resolved when provided explicitly.
    var app = config.app != null && config.app !== '' ? String(config.app) : resolved.app;
    var build = config.build != null && config.build !== '' ? String(config.build) : resolved.build;
    var endpointUrl =
      config.endpointUrl != null
        ? String(config.endpointUrl)
        : config.endpoint != null
          ? String(config.endpoint)
          : resolved.endpointUrl;
    var fieldMap = mergeFieldMap(config.fieldMap || resolved.fieldMap);
    var contextFn =
      config.contextFn != null && config.contextFn !== '' ? String(config.contextFn) : resolved.contextFn;
    var consentSelector =
      config.consentSelector != null && config.consentSelector !== ''
        ? String(config.consentSelector)
        : resolved.consentSelector;
    var exclude = parseExcludeList(
      config.exclude != null && config.exclude !== '' ? config.exclude : resolved.exclude,
    );
    var hideWhen =
      config.hideWhen != null && config.hideWhen !== ''
        ? String(config.hideWhen)
        : resolved.hideWhen || DEFAULT_HIDE_WHEN;
    var storage = config.storage || win.localStorage;
    var fetchFn = config.fetch || (win.fetch ? win.fetch.bind(win) : null);
    // Allow explicit null to force typing-only (tests / shot harness).
    var Recognition =
      Object.prototype.hasOwnProperty.call(config, 'SpeechRecognition')
        ? config.SpeechRecognition
        : getSpeechRecognitionCtor(win);

    var root = null;
    var fab = null;
    var backdrop = null;
    var sheet = null;
    var ta = null;
    var statusEl = null;
    var hp = null;
    var recognition = null;
    var listening = false;
    var openAt = 0;
    var focusables = [];
    var lastFocus = null;
    var consentObs = null;
    var consentRo = null;
    var destroyed = false;

    function setConsentClearance() {
      if (!root) return;
      var m = measureConsentClearance(doc, consentSelector);
      root.style.setProperty('--fbw-consent-clearance', m.clearance + 'px');
    }

    function syncFabVisibility() {
      if (!fab || !fab.setAttribute) return;
      var hide = isHostUiBlocking(doc, hideWhen);
      try {
        fab.hidden = !!hide;
      } catch (e) {
        /* harness may lack hidden setter */
      }
      fab.setAttribute('data-fbw-hidden', hide ? '1' : '0');
      fab.setAttribute('aria-hidden', hide ? 'true' : 'false');
      if (hide) fab.setAttribute('tabindex', '-1');
      else if (typeof fab.removeAttribute === 'function') fab.removeAttribute('tabindex');
      else fab.setAttribute('tabindex', '0');
    }

    function applyPagePad(on) {
      var html = doc.documentElement;
      if (!html || typeof html.setAttribute !== 'function') return;
      if (on) html.setAttribute(PAD_ATTR, '1');
      else if (typeof html.removeAttribute === 'function') html.removeAttribute(PAD_ATTR);
      else html.setAttribute(PAD_ATTR, '0');
    }

    function watchConsent() {
      setConsentClearance();
      syncFabVisibility();
      if (typeof MutationObserver !== 'undefined') {
        consentObs = new MutationObserver(function () {
          setConsentClearance();
          syncFabVisibility();
        });
        consentObs.observe(doc.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['style', 'class', 'hidden', 'data-fleet-plan'],
        });
      }
      if (typeof ResizeObserver !== 'undefined') {
        consentRo = new ResizeObserver(function () {
          setConsentClearance();
        });
        consentRo.observe(doc.documentElement);
        var hit = findConsentBar(doc, consentSelector);
        if (hit && hit.el) consentRo.observe(hit.el);
      }
      win.addEventListener('resize', setConsentClearance);
    }

    function stopListening() {
      listening = false;
      if (recognition) {
        try {
          recognition.onresult = null;
          recognition.onerror = null;
          recognition.onend = null;
          recognition.stop();
        } catch (e) {
          /* ignore */
        }
        recognition = null;
      }
      if (fab) fab.setAttribute('data-active', '0');
    }

    function startListening() {
      if (!Recognition) return false;
      try {
        recognition = new Recognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = (navigator && navigator.language) || 'en-US';
        var finalBits = [];
        recognition.onresult = function (ev) {
          var interim = '';
          for (var i = ev.resultIndex; i < ev.results.length; i++) {
            var r = ev.results[i];
            var t = r[0] && r[0].transcript ? r[0].transcript : '';
            if (r.isFinal) finalBits.push(t);
            else interim += t;
          }
          var text = stripControlChars((finalBits.join(' ') + ' ' + interim).trim());
          if (ta) {
            ta.value = text;
            try {
              ta.dispatchEvent(new Event('input', { bubbles: true }));
            } catch (e) {
              /* ignore */
            }
          }
        };
        recognition.onerror = function () {
          listening = false;
          if (statusEl) statusEl.textContent = 'Typing works too.';
          if (ta) ta.focus();
        };
        recognition.onend = function () {
          listening = false;
        };
        recognition.start();
        listening = true;
        if (fab) fab.setAttribute('data-active', '1');
        return true;
      } catch (e) {
        listening = false;
        return false;
      }
    }

    function trapFocus(e) {
      if (!sheet || e.key !== 'Tab' || !focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && doc.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && doc.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeSheet();
        return;
      }
      trapFocus(e);
    }

    function closeSheet() {
      stopListening();
      if (backdrop && backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
      if (sheet && sheet.parentNode) sheet.parentNode.removeChild(sheet);
      backdrop = null;
      sheet = null;
      ta = null;
      statusEl = null;
      hp = null;
      focusables = [];
      doc.removeEventListener('keydown', onKey, true);
      if (lastFocus && lastFocus.focus) {
        try {
          lastFocus.focus();
        } catch (e) {
          /* ignore */
        }
      }
      lastFocus = null;
    }

    function showStatus(msg) {
      if (statusEl) statusEl.textContent = msg;
    }

    function failKeepText() {
      showStatus("Couldn't send, please try again");
    }

    function send() {
      if (!sheet) return Promise.resolve({ ok: false, reason: 'closed' });
      if (hp && hp.value) {
        // Honeypot filled: drop silently (no network)
        closeSheet();
        return Promise.resolve({ ok: false, reason: 'honeypot' });
      }
      var elapsed = Date.now() - openAt;
      if (elapsed < MIN_OPEN_MS) {
        showStatus('Please wait a moment.');
        return Promise.resolve({ ok: false, reason: 'too_fast' });
      }
      var text = stripControlChars(ta ? ta.value : '');
      if (!text) {
        showStatus('Add a short note first.');
        return Promise.resolve({ ok: false, reason: 'empty' });
      }
      // endpointUrl empty never reaches the compose sheet; guard anyway.
      if (!endpointUrl) {
        showStatus("Feedback isn't connected yet.");
        return Promise.resolve({ ok: false, reason: 'not_connected' });
      }
      var gate = canSend(readSendLog(storage), Date.now());
      if (!gate.ok) {
        showStatus('Send limit reached. Try later.');
        return Promise.resolve({ ok: false, reason: 'rate_limit' });
      }
      if (!fetchFn) {
        failKeepText();
        return Promise.resolve({ ok: false, reason: 'no_fetch' });
      }

      var screen =
        String((win.screen && win.screen.width) || 0) +
        'x' +
        String((win.screen && win.screen.height) || 0);
      var viewport = String(win.innerWidth || 0) + 'x' + String(win.innerHeight || 0);
      var tz = '';
      try {
        tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      } catch (e) {
        tz = '';
      }
      var body = buildJsonBody(fieldMap, {
        message: text,
        page: formatPageField({
          url: win.location && win.location.href,
          context: resolveContext(contextFn),
          app: app,
          build: build,
          viewport: viewport,
          tz: tz,
        }),
        screen: screen,
        browser: (win.navigator && win.navigator.userAgent) || '',
        time: new Date().toISOString(),
        honeypot: '',
      });
      if (bodyHasPiiKeys(body)) {
        failKeepText();
        return Promise.resolve({ ok: false, reason: 'pii_keys' });
      }

      return Promise.resolve()
        .then(function () {
          return fetchFn(endpointUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(body),
          });
        })
        .then(function (res) {
          if (!res || !res.ok) {
            failKeepText();
            return { ok: false, reason: 'http' };
          }
          return Promise.resolve(res.json ? res.json() : null)
            .catch(function () {
              return null;
            })
            .then(function (json) {
              if (!isSubmitSuccess(true, json)) {
                failKeepText();
                return { ok: false, reason: 'not_success' };
              }
              recordSend(gate.log, Date.now(), storage);
              showStatus('Thanks, sent.');
              win.setTimeout(function () {
                closeSheet();
              }, 700);
              return { ok: true };
            });
        })
        .catch(function () {
          failKeepText();
          return { ok: false, reason: 'network' };
        });
    }

    /**
     * When endpointUrl is empty: show only the not-connected message + OK.
     * Never create a textarea, never start speech, never ask for mic permission.
     */
    function openNotConnected() {
      if (sheet) return;
      lastFocus = doc.activeElement;

      backdrop = doc.createElement('div');
      backdrop.className = 'fbw-backdrop';
      backdrop.addEventListener('click', function () {
        closeSheet();
      });

      sheet = doc.createElement('div');
      sheet.className = 'fbw-sheet';
      sheet.setAttribute('role', 'dialog');
      sheet.setAttribute('aria-modal', 'true');
      sheet.setAttribute('aria-label', 'Feedback not connected');
      sheet.setAttribute('data-fbw-mode', 'not-connected');

      statusEl = doc.createElement('p');
      statusEl.className = 'fbw-status fbw-status-alone';
      statusEl.setAttribute('aria-live', 'polite');
      statusEl.textContent = "Feedback isn't connected yet.";

      var actions = doc.createElement('div');
      actions.className = 'fbw-actions';
      var ok = doc.createElement('button');
      ok.type = 'button';
      ok.className = 'fbw-btn fbw-btn-send';
      ok.textContent = 'OK';
      ok.addEventListener('click', closeSheet);
      actions.appendChild(ok);

      sheet.appendChild(statusEl);
      sheet.appendChild(actions);

      root.appendChild(backdrop);
      root.appendChild(sheet);

      focusables = [ok];
      doc.addEventListener('keydown', onKey, true);
      ok.focus();
    }

    function openSheet() {
      if (sheet) return;
      // Hard gate: empty endpoint never opens compose / mic UI.
      if (!endpointUrl) {
        openNotConnected();
        return;
      }
      lastFocus = doc.activeElement;
      openAt = Date.now();

      backdrop = doc.createElement('div');
      backdrop.className = 'fbw-backdrop';
      backdrop.addEventListener('click', function () {
        closeSheet();
      });

      sheet = doc.createElement('div');
      sheet.className = 'fbw-sheet';
      sheet.setAttribute('role', 'dialog');
      sheet.setAttribute('aria-modal', 'true');
      sheet.setAttribute('aria-label', 'Voice feedback');
      sheet.setAttribute('data-fbw-mode', 'compose');

      var note = doc.createElement('p');
      note.className = 'fbw-note';
      note.textContent =
        "Your browser's speech service turns your voice into text. Please don't include personal details.";

      ta = doc.createElement('textarea');
      ta.className = 'fbw-ta';
      ta.setAttribute('maxlength', String(MAX_TEXT));
      ta.setAttribute('aria-label', 'Feedback text');
      ta.placeholder = 'Speak or type your feedback…';

      var countEl = doc.createElement('p');
      countEl.className = 'fbw-count';
      countEl.setAttribute('aria-live', 'polite');
      function updateCount() {
        var n = (ta.value || '').length;
        if (n > MAX_TEXT) n = MAX_TEXT;
        countEl.textContent = n + ' of ' + MAX_TEXT;
      }
      updateCount();
      ta.addEventListener('input', updateCount);

      hp = doc.createElement('input');
      hp.type = 'text';
      hp.className = 'fbw-hp';
      hp.setAttribute('tabindex', '-1');
      hp.setAttribute('autocomplete', 'off');
      hp.setAttribute('aria-hidden', 'true');
      hp.name = fieldMap.honeypot || '_gotcha';

      statusEl = doc.createElement('p');
      statusEl.className = 'fbw-status';
      statusEl.setAttribute('aria-live', 'polite');

      var actions = doc.createElement('div');
      actions.className = 'fbw-actions';
      var cancel = doc.createElement('button');
      cancel.type = 'button';
      cancel.className = 'fbw-btn fbw-btn-cancel';
      cancel.textContent = 'Cancel';
      cancel.addEventListener('click', closeSheet);
      var sendBtn = doc.createElement('button');
      sendBtn.type = 'button';
      sendBtn.className = 'fbw-btn fbw-btn-send';
      sendBtn.textContent = 'Send';
      sendBtn.addEventListener('click', send);
      actions.appendChild(cancel);
      actions.appendChild(sendBtn);

      sheet.appendChild(note);
      sheet.appendChild(ta);
      sheet.appendChild(countEl);
      sheet.appendChild(hp);
      sheet.appendChild(statusEl);
      sheet.appendChild(actions);

      root.appendChild(backdrop);
      root.appendChild(sheet);

      focusables = [ta, cancel, sendBtn];
      doc.addEventListener('keydown', onKey, true);

      var started = startListening();
      if (!started) {
        showStatus('Typing works too.');
        ta.focus();
      } else {
        ta.focus();
      }
    }

    function onFabClick() {
      if (!endpointUrl) openNotConnected();
      else openSheet();
    }

    function mount() {
      if (destroyed) return;
      if (isOptedOut(doc)) return;
      if (isExcluded(exclude, win.location)) return;
      if (doc.querySelector('[' + ROOT_ATTR + ']')) return;

      injectStyles(doc);
      root = doc.createElement('div');
      root.className = 'fbw-root';
      root.setAttribute(ROOT_ATTR, '1');

      fab = doc.createElement('button');
      fab.type = 'button';
      fab.className = 'fbw-fab';
      fab.setAttribute('aria-label', 'Send feedback');
      fab.innerHTML = launcherSvg();
      fab.addEventListener('click', onFabClick);

      root.appendChild(fab);
      doc.body.appendChild(root);
      applyPagePad(true);
      watchConsent();
    }

    function unmount() {
      closeSheet();
      if (consentObs) {
        consentObs.disconnect();
        consentObs = null;
      }
      if (consentRo) {
        consentRo.disconnect();
        consentRo = null;
      }
      win.removeEventListener('resize', setConsentClearance);
      applyPagePad(false);
      if (root && root.parentNode) root.parentNode.removeChild(root);
      root = null;
      fab = null;
      var style = doc.getElementById(STYLE_ID);
      // Keep shared styles if another instance might remount immediately.
      if (style && !doc.querySelector('[' + ROOT_ATTR + ']')) {
        /* leave styles; remount reuses */
      }
    }

    function syncRoute() {
      if (destroyed) return;
      var shouldShow = !isOptedOut(doc) && !isExcluded(exclude, win.location);
      var mounted = !!root && !!root.parentNode;
      if (shouldShow && !mounted) mount();
      else if (!shouldShow && mounted) unmount();
    }

    function destroy() {
      destroyed = true;
      unmount();
      win.removeEventListener('hashchange', syncRoute);
      win.removeEventListener('popstate', syncRoute);
    }

    mount();
    win.addEventListener('hashchange', syncRoute);
    win.addEventListener('popstate', syncRoute);

    return {
      mount: mount,
      unmount: unmount,
      syncRoute: syncRoute,
      destroy: destroy,
      openSheet: openSheet,
      openNotConnected: openNotConnected,
      closeSheet: closeSheet,
      send: send,
      setConsentClearance: setConsentClearance,
      getRoot: function () {
        return root;
      },
      measureConsentClearance: function () {
        return measureConsentClearance(doc, consentSelector);
      },
      syncFabVisibility: syncFabVisibility,
      isHostUiBlocking: function () {
        return isHostUiBlocking(doc, hideWhen);
      },
    };
  }

  function readScriptConfig(script) {
    if (!script && typeof window !== 'undefined' && window.FEEDBACK_CONFIG) {
      return {};
    }
    if (!script) return null;
    var fieldMap = {};
    var msg = script.getAttribute('data-field-message');
    var page = script.getAttribute('data-field-page');
    var screen = script.getAttribute('data-field-screen');
    var browser = script.getAttribute('data-field-browser');
    var time = script.getAttribute('data-field-time');
    var honeypot = script.getAttribute('data-field-honeypot');
    if (msg) fieldMap.message = msg;
    if (page) fieldMap.page = page;
    if (screen) fieldMap.screen = screen;
    if (browser) fieldMap.browser = browser;
    if (time) fieldMap.time = time;
    if (honeypot) fieldMap.honeypot = honeypot;
    // Optional JSON blob: data-field-map='{"message":"msg",...}'
    var mapRaw = script.getAttribute('data-field-map');
    if (mapRaw) {
      try {
        var parsed = JSON.parse(mapRaw);
        if (parsed && typeof parsed === 'object') {
          fieldMap = Object.assign(fieldMap, parsed);
        }
      } catch (e) {
        /* ignore bad JSON */
      }
    }
    return {
      app: script.getAttribute('data-app') || '',
      build: script.getAttribute('data-build') || '',
      endpointUrl:
        script.getAttribute('data-endpoint-url') ||
        script.getAttribute('data-endpoint') ||
        '',
      fieldMap: fieldMap,
      contextFn: script.getAttribute('data-context-fn') || '',
      consentSelector: script.getAttribute('data-consent-selector') || '',
      exclude: script.getAttribute('data-exclude') || '',
      hideWhen: script.getAttribute('data-hide-when') || '',
    };
  }

  function findConfigScript() {
    if (typeof document === 'undefined') return null;
    if (document.currentScript) return document.currentScript;
    var scripts = document.querySelectorAll('script[data-app][src*="feedback-widget"]');
    if (scripts.length) return scripts[scripts.length - 1];
    scripts = document.querySelectorAll('script[data-endpoint-url], script[data-app]');
    return scripts.length ? scripts[scripts.length - 1] : null;
  }

  function autoInit() {
    if (typeof document === 'undefined') return null;
    var script = findConfigScript();
    var cfg = readScriptConfig(script);
    if (!cfg && !(typeof window !== 'undefined' && window.FEEDBACK_CONFIG)) return null;
    cfg = cfg || {};
    if (activeInstance) {
      activeInstance.destroy();
      activeInstance = null;
    }
    function start() {
      activeInstance = createWidget(cfg);
      return activeInstance;
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
      return null;
    }
    return start();
  }

  return {
    autoInit: autoInit,
    createWidget: createWidget,
    resolveConfig: resolveConfig,
    mergeFieldMap: mergeFieldMap,
    buildJsonBody: buildJsonBody,
    formatPageField: formatPageField,
    isSubmitSuccess: isSubmitSuccess,
    stripControlChars: stripControlChars,
    stripQuery: stripQuery,
    bodyHasPiiKeys: bodyHasPiiKeys,
    parseExcludeList: parseExcludeList,
    matchesExclude: matchesExclude,
    isExcluded: isExcluded,
    isOptedOut: isOptedOut,
    consentClearancePx: consentClearancePx,
    measureConsentClearance: measureConsentClearance,
    findConsentBar: findConsentBar,
    fabPageReservePx: fabPageReservePx,
    isHostUiBlocking: isHostUiBlocking,
    canSend: canSend,
    recordSend: recordSend,
    readSendLog: readSendLog,
    pruneLog: pruneLog,
    getSpeechRecognitionCtor: getSpeechRecognitionCtor,
    DEFAULT_FIELD_MAP: DEFAULT_FIELD_MAP,
    DEFAULT_HIDE_WHEN: DEFAULT_HIDE_WHEN,
    MAX_TEXT: MAX_TEXT,
    MIN_OPEN_MS: MIN_OPEN_MS,
    MAX_HOUR: MAX_HOUR,
    MAX_DAY: MAX_DAY,
    MIN_CONSENT_GAP: MIN_CONSENT_GAP,
  };
});

