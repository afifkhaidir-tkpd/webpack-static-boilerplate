/**
 * jQuery is not included as default. Please enable jQuery in config.js
 * if you wanna use jQuery.
 */
const isOnViewport = (element) => {
  const windowTop = window.scrollY;
  const windowBottom = window.scrollY + window.innerHeight;

  const elemTop = element.offsetTop;
  const elemBottom = elemTop + element.offsetHeight;

  return (elemTop >= windowTop) && (elemBottom <= windowBottom);
};

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

const gtmImpression = (dataLayer) => {
  const gtmElement = document.querySelectorAll('[data-impression]:not(.viewed)');

  gtmElement.forEach((elem) => {
    if (isOnViewport(elem)) {
      dataLayer.push(JSON.parse(elem.getAttribute('data-impression')));
      elem.classList.add('viewed');
    }
  });
};

const initGtmClickListener = (dataLayer) => {
  document.body.addEventListener('click', (event) => {
    if (event.target.matches('a[data-click]')) {
      const gtmProps = JSON.parse(event.target.getAttribute('data-click'));
      const targetUrl = event.target.getAttribute('href');

      gtmProps.eventCallback = () => {
        document.location = targetUrl;
      };

      dataLayer.push(gtmProps);
    }
  });
};

window.onload = () => {
  const dataLayer = window.dataLayer || [];

  initPivot();
  initGtmClickListener(dataLayer);

  gtmImpression(dataLayer);

  window.onscroll = () => {
    gtmImpression(dataLayer);
  };
};
