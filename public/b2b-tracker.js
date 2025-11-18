/**
 * B2B Tracking Script
 * Lightweight, privacy-compliant tracking for B2B funnels
 *
 * Usage:
 * <script src="https://yoursite.com/tracker.js" data-tracking-id="YOUR_TRACKING_ID"></script>
 */

(function () {
  'use strict';

  // Configuration
  const script = document.currentScript;
  const trackingId = script?.getAttribute('data-tracking-id');
  const apiUrl = script?.getAttribute('data-api-url') || (script?.src.match(/^https?:\/\/[^/]+/) || [''])[0];
  const endpoint = apiUrl + '/api/track';

  if (!trackingId) {
    console.warn('[B2B Tracker] Missing data-tracking-id attribute');
    return;
  }

  // Helper: Generate UUID v4
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Helper: Get or create cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  // Initialize identifiers
  let anonymousId = getCookie('__b2b_aid');
  if (!anonymousId) {
    anonymousId = generateUUID();
    setCookie('__b2b_aid', anonymousId, 365); // 1 year
  }

  let sessionId = sessionStorage.getItem('__b2b_sid');
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem('__b2b_sid', sessionId);
  }

  // Event queue for offline/async handling
  const eventQueue = [];
  let isProcessing = false;

  // Send event to server
  async function sendEvent(eventData) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
        keepalive: true, // Ensure request completes even if page unloads
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[B2B Tracker] Failed to send event:', error);
      throw error;
    }
  }

  // Process event queue
  async function processQueue() {
    if (isProcessing || eventQueue.length === 0) return;

    isProcessing = true;

    while (eventQueue.length > 0) {
      const event = eventQueue.shift();
      try {
        await sendEvent(event);
      } catch (error) {
        // Re-queue on failure
        eventQueue.unshift(event);
        break;
      }
    }

    isProcessing = false;
  }

  // Track event (main API)
  function track(eventType, eventData = {}) {
    const event = {
      trackingId,
      anonymousId,
      sessionId,
      eventType,
      eventData,
      pageUrl: window.location.href,
      pageTitle: document.title,
      referrer: document.referrer || undefined,
      timestamp: new Date().toISOString(),
      // UTM parameters
      utmSource: new URLSearchParams(window.location.search).get('utm_source') || undefined,
      utmMedium: new URLSearchParams(window.location.search).get('utm_medium') || undefined,
      utmCampaign: new URLSearchParams(window.location.search).get('utm_campaign') || undefined,
    };

    eventQueue.push(event);
    processQueue();
  }

  // Auto-track page view
  track('page_view');

  // Track link clicks
  document.addEventListener('click', function (e) {
    let target = e.target;

    // Find closest anchor tag
    while (target && target.tagName !== 'A') {
      target = target.parentElement;
    }

    if (target && target.tagName === 'A') {
      const href = target.getAttribute('href');
      const trackClick = target.getAttribute('data-track-click');

      // Only track if data-track-click is present or it's an external link
      if (trackClick !== null || (href && (href.startsWith('http') || href.startsWith('mailto:')))) {
        track('link_click', {
          href,
          text: target.innerText?.trim()?.substring(0, 100) || undefined,
          linkId: target.id || undefined,
          linkClass: target.className || undefined,
        });
      }
    }
  }, { passive: true });

  // Track form submissions
  document.addEventListener('submit', function (e) {
    const form = e.target;
    if (form.tagName === 'FORM') {
      const formData = new FormData(form);
      const data = {};

      // Capture form data (excluding sensitive fields)
      formData.forEach((value, key) => {
        if (!['password', 'credit_card', 'ssn'].some(s => key.toLowerCase().includes(s))) {
          data[key] = typeof value === 'string' ? value.substring(0, 200) : value;
        }
      });

      track('form_submit', {
        formId: form.id || undefined,
        formAction: form.action || undefined,
        fields: Object.keys(data),
      });
    }
  }, { passive: true });

  // Track time on page (send on page unload)
  const pageLoadTime = Date.now();
  window.addEventListener('beforeunload', function () {
    const timeOnPage = Math.round((Date.now() - pageLoadTime) / 1000);

    // Use sendBeacon for reliability
    const event = {
      trackingId,
      anonymousId,
      sessionId,
      eventType: 'page_exit',
      eventData: { timeOnPage },
      pageUrl: window.location.href,
      timestamp: new Date().toISOString(),
    };

    navigator.sendBeacon?.(endpoint, JSON.stringify(event));
  });

  // Expose global API
  window.b2bTracker = {
    track,
    identify: function (email, userData = {}) {
      return track('identify', {
        email,
        ...userData
      });
    },
    getAnonymousId: function () {
      return anonymousId;
    },
    getSessionId: function () {
      return sessionId;
    }
  };

  // Signal ready
  window.dispatchEvent(new Event('b2b-tracker-ready'));

})();
