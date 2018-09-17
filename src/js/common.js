// ripple effect
export const rippleEffect = (e) => {
  let self;
  let size;
  let spanEl;
  let rippleX;
  let rippleY;
  let offsetX;
  let offsetY;
  let eWidth;
  let eHeight;

  const btn = Object.prototype.hasOwnProperty.call(e, 'disabled') || e.classList.contains('disabled') ? false : e;

  btn.addEventListener('mousedown', (ev) => {
    self = e;
    // Disable right click
    if (e.button === 2) {
      return false;
    }

    let rippleFlag = 0;
    for (let i = 0; i < self.childNodes.length; i += 1) {
      if (self.childNodes[i].nodeType === Node.ELEMENT_NODE) {
        if (self.childNodes[i].matches('.ripple')) rippleFlag += 1;
      }
    }

    if (rippleFlag === 0) {
      const elChild = document.createElement('span');
      elChild.classList.add('ripple');
      self.insertBefore(elChild, self.firstChild);
    }
    [spanEl] = self.querySelectorAll('.ripple');
    spanEl.classList.remove('animated');

    eWidth = self.getBoundingClientRect().width;
    eHeight = self.getBoundingClientRect().height;
    size = Math.max(eWidth, eHeight);

    spanEl.style.width = `${size}px`;
    spanEl.style.height = `${size}px`;

    offsetX = self.ownerDocument.defaultView.pageXOffset;
    offsetY = self.ownerDocument.defaultView.pageYOffset;

    rippleX = parseInt(ev.pageX - (self.getBoundingClientRect().left + offsetX), 10) - (size / 2);
    rippleY = parseInt(ev.pageY - (self.getBoundingClientRect().top + offsetY), 10) - (size / 2);

    spanEl.style.top = `${rippleY}px`;
    spanEl.style.left = `${rippleX}px`;
    spanEl.classList.add('animated');

    setTimeout(() => {
      spanEl.remove();
    }, 800);

    return ev;
  });
};

export const isOnViewport = (element) => {
  const windowTop = window.pageYOffset;
  const windowBottom = windowTop + window.innerHeight;
  const windowLeft = window.pageXOffset;
  const windowRight = windowLeft + window.innerWidth;

  let el = element;
  let elemTop = el.offsetTop;
  let elemLeft = el.offsetLeft;
  const elemWidth = el.offsetWidth;
  const elemHeight = el.offsetHeight;

  while (el.offsetParent) {
    el = el.offsetParent;
    elemTop += el.offsetTop;
    elemLeft += el.offsetLeft;
  }

  return (
    elemTop >= windowTop &&
    elemTop + elemHeight <= windowBottom &&
    elemLeft >= windowLeft &&
    elemLeft + elemWidth <= windowRight
  );
};

export const parallaxAnim = () => {
  const elem = document.querySelectorAll('[data-pspeed]');
  const doc = document.documentElement;
  const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

  for (let i = 0; i < elem.length; i += 1) {
    const yPos = ((top * elem[i].dataset.pspeed) / 100);
    elem[i].style.transform = `translate3d(0px, ${yPos}px, 0px)`;
  }
};

export const scrollDetector = () => {
  const doc = document.documentElement;
  let scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  let currTop = 0;

  return () => {
    scrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    if (scrollTop > currTop) {
      currTop = scrollTop;
      return true;
    }
    currTop = scrollTop;
    return false;
  };
};
