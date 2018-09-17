/**
 * jQuery is not included as default. Please enable jQuery in config.js
 * if you wanna use jQuery.
 */
import {
  isOnViewport,
  rippleEffect,
  scrollDetector,
} from './common';

/* eslint-disable func-names */
(function () {
  const dataLayer = window.dataLayer || [];
  const isScrollDown = scrollDetector();
  const app = {
    rippleElem: document.querySelectorAll('.ripple-effect'),
    overlay: document.querySelector('.overlay'),
    pivot: document.querySelector('.pivot-container'),
    pivotDelay: 200,
    topNav: document.querySelector('.top-navigation'),
  };


  /* ================================
   * App methods
   * ================================ */

  app.toggleOverlay = (visible) => {
    if (visible) {
      app.overlay.classList.add('active');
    } else {
      app.overlay.classList.remove('active');
    }
  };

  app.togglePivot = (visible) => {
    if (visible) {
      app.pivot.classList.add('pivot-container--active');
    } else {
      app.pivot.classList.remove('pivot-container--active');
    }
  };

  app.toggleStickyNav = (show) => {
    if (window.innerWidth > 768) {
      if (show) {
        app.topNav.classList.add('show');
      } else {
        app.topNav.classList.remove('show');
      }
    }
  };

  app.sendImpression = () => {
    const gtmElement = document.querySelectorAll('*[data-impression]:not(.viewed)');
    gtmElement.forEach((elem) => {
      if (isOnViewport(elem)) {
        dataLayer.push(JSON.parse(elem.getAttribute('data-impression')));
        elem.classList.add('viewed');
      }
    });
  };


  /* ================================
   * Event listener
   * ================================ */

  // pivot event listener
  document.querySelectorAll('.pivot-button, .pivot-container').forEach((elem) => {
    let pivotEnterTimeout;
    let pivotLeaveTimeout;

    elem.addEventListener('mouseenter', () => {
      clearTimeout(pivotLeaveTimeout);
      pivotEnterTimeout = setTimeout(() => {
        app.togglePivot(true);
        app.toggleOverlay(true);
      }, app.pivotDelay);
    });

    elem.addEventListener('mouseleave', () => {
      clearTimeout(pivotEnterTimeout);
      pivotLeaveTimeout = setTimeout(() => {
        app.togglePivot(false);
        app.toggleOverlay(false);
      }, app.pivotDelay);
    });
  });

  // applink handler, if no applink support fallback to href
  document.querySelectorAll('*[data-applink]').forEach((elem) => {
    elem.addEventListener('click', (event) => {
      if (window.innerWidth < 768) {
        const weblink = event.currentTarget.getAttribute('href');
        const applinkData = event.currentTarget.getAttribute('data-applink');

        event.preventDefault();
        if (weblink || applinkData) {
          setTimeout(() => {
            window.location.href = weblink;
          }, 25);
          window.location.href = applinkData;
        }
      }
    });
  });

  // GTM click event listener by data-click attribute
  document.body.addEventListener('click', (event) => {
    let elem = event.target;
    if (!elem.matches('[data-click]')) {
      while (elem.parentElement) {
        elem = elem.parentElement;
        if (elem.matches('[data-click]')) {
          break;
        }
      }
    }
    if (elem.matches('[data-click]')) {
      const gtmProps = JSON.parse(elem.getAttribute('data-click'));
      const targetUrl = elem.getAttribute('href') || '';
      if (targetUrl && elem.getAttribute('target') !== '_blank') {
        gtmProps.eventCallback = () => {
          document.location = targetUrl;
        };
      }
      dataLayer.push(gtmProps);
    }
  });

  window.addEventListener('load', () => {
    // attach ripple effect to .ripple-effect elems
    Element.prototype.ripple = rippleEffect;
    app.rippleElem.forEach((elem) => { elem.ripple(elem); });

    // send initial GTM impression
    app.sendImpression();
  });

  window.addEventListener('scroll', () => {
    // check all GTM impression on viewport
    app.sendImpression();

    // display navbar on scrollup
    app.toggleStickyNav(!isScrollDown());
  });
}());

/* eslint-disable func-names */
