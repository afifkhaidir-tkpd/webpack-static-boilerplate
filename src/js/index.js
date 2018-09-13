/**
 * jQuery is not included as default. Please enable jQuery in config.js
 * if you wanna use jQuery.
 */
import { isOnViewport, initRippleButton } from './common';

const initPivot = () => {
  const pivotDelay = 200;
  const overlay = document.getElementsByClassName('overlay')[0];
  const pivotContainer = document.getElementsByClassName('pivot-container')[0];
  const pivotButton = document.querySelectorAll('.pivot-button, .pivot-container');

  let pivotEnterTimeout;
  let pivotLeaveTimeout;

  pivotButton.forEach((elem) => {
    elem.addEventListener('mouseenter', () => {
      clearTimeout(pivotLeaveTimeout);

      pivotEnterTimeout = setTimeout(() => {
        pivotContainer.classList.add('pivot-container--active');
        overlay.classList.add('active');
      }, pivotDelay);
    });

    elem.addEventListener('mouseleave', () => {
      clearTimeout(pivotEnterTimeout);

      pivotLeaveTimeout = setTimeout(() => {
        pivotContainer.classList.remove('pivot-container--active');
        overlay.classList.remove('active');
      }, pivotDelay);
    });
  });
};

const initApplink = () => {
  const applink = document.querySelectorAll('[data-applink]');

  for (let i = 0; i < applink.length; i += 1) {
    applink[i].addEventListener('click', (event) => {
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
  }
};

const initGtmClickListener = (dataLayer) => {
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
};

const gtmImpression = (dataLayer) => {
  const gtmElement = document.querySelectorAll('[data-impression]:not(.viewed)');

  gtmElement.forEach((elem) => {
    if (isOnViewport(elem)) {
      dataLayer.push(JSON.parse(elem.getAttribute('data-impression')));
      elem.classList.add('viewed');
    }
  });
};

window.onload = () => {
  const dataLayer = window.dataLayer || [];
  const rippleElem = document.querySelectorAll('.ripple-effect');

  initApplink();
  initGtmClickListener(dataLayer);
  initPivot();
  initRippleButton(rippleElem);

  gtmImpression(dataLayer);

  window.onscroll = () => {
    gtmImpression(dataLayer);
  };
};
