const ERROR_MESSAGES = {
  required: 'Required',
  pattern: {
    name: `Enter English letters or numbers and "-"`,
    color: `Enter HEX color`,
  },
  minlength: `Min length `,
  maxlength: `Max length `,
};

const checkRequired = (el: HTMLInputElement, info: HTMLDivElement): boolean => {
  let result = true;
  const clone = info;

  if (el.required && el.value === '') {
    result = false;
    clone.innerHTML = ERROR_MESSAGES.required;
  }

  return result;
};

const checkPattern = (el: HTMLInputElement, info: HTMLDivElement): boolean => {
  let result = true;
  const clone = info;

  if ('pattern' in el && el.pattern !== '' && typeof el.pattern === 'string') {
    const regex = new RegExp(el.pattern);
    result = regex.test(el.value);

    if (!result) {
      if (el.pattern === '^#[A-Fa-f0-9]{6}$') {
        clone.innerHTML = ERROR_MESSAGES.pattern.color;
      } else {
        clone.innerHTML = ERROR_MESSAGES.pattern.name;
      }
    }
  }
  return result;
};

const checkMinLength = (el: HTMLInputElement, info: HTMLDivElement): boolean => {
  let result = true;
  const clone = info;

  const minLength = el.getAttribute('minlength');
  if (minLength !== null) {
    result = el.value.length >= +el.minLength;

    if (!result) {
      clone.innerHTML = `${ERROR_MESSAGES.minlength} ${el.minLength} `;
    }
  }

  return result;
};

const checkMaxLength = (el: HTMLInputElement, info: HTMLDivElement): boolean => {
  let result = true;
  const clone = info;

  const maxLength = el.getAttribute('minlength');
  if (maxLength !== null) {
    result = el.value.length <= +el.maxLength;

    if (!result) {
      clone.innerHTML = `${ERROR_MESSAGES.maxlength}${el.maxLength} `;
    }
  }

  return result;
};

const checkElements = (element: ChildNode[] | HTMLFormControlsCollection): boolean => {
  const formElements = Array.from(element);

  const isValid = new Set();
  isValid.add(true);

  formElements.forEach((el) => {
    if (el instanceof HTMLInputElement) {
      if (el.parentNode === null) {
        throw new Error('null');
      }

      const info = el.parentNode.nextSibling;

      if (info === null || !(info instanceof HTMLDivElement)) {
        throw new Error('null');
      }

      info.innerHTML = '';
      if (el.getAttribute('maxlength') !== null) {
        isValid.add(checkMaxLength(el, info));
      }
      if (el.getAttribute('pattern') !== null) {
        isValid.add(checkPattern(el, info));
      }
      if (el.getAttribute('minlength') !== null) {
        isValid.add(checkMinLength(el, info));
      }

      isValid.add(checkRequired(el, info));
    }
  });

  return !isValid.has(false);
};

const validation = (e: Event | HTMLElement): boolean => {
  let isValid = true;

  if (e instanceof Event) {
    if (e.target === null) {
      isValid = false;
      throw new Error('null');
    }

    if (e.target instanceof HTMLFormElement) {
      isValid = checkElements(e.target.elements);
    }
  }

  if (e instanceof HTMLElement) {
    const arr = Array.from(e.childNodes);
    const formElements: ChildNode[] = [];
    arr.forEach((el) => {
      const item = el.childNodes[1]?.firstChild;
      if (typeof item !== 'undefined' && item !== null) {
        formElements.push(item);
      }
    });

    isValid = checkElements(formElements);
  }

  return isValid;
};

export default validation;
