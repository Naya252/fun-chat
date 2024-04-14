import BaseComponent from '@/components/shared/base-component';
import BaseInput from '@/components/shared/base-input/base-input';
import BaseButton from '@/components/shared/base-button/base-button';
import isValid from '@/utils/form-validation';

const createTitle = (): BaseComponent => {
  const title = new BaseComponent(
    'h2',
    [
      'mt-10',
      'text-center',
      'text-2xl',
      'font-bold',
      'leading-9',
      'tracking-tight',
      'text-gray-900',
      'dark:text-gray-300',
    ],
    {},
    'Sign in to Fun chat',
  );

  return title;
};

const createLogin = (): BaseInput => {
  const login = new BaseInput('login', 'Login', 'login-text', '', {
    name: 'login',
    autocomplete: 'off',
    required: 'true',
    value: '',
    maxlength: '30',
    minlength: '4',
    pattern: '^[A-Za-z0-9]*-?[A-Za-z0-9]* ?[A-Za-z0-9]*$',
  });

  return login;
};

const createPassword = (): BaseInput => {
  const password = new BaseInput(
    'password',
    'Password',
    'password-text',
    '',
    {
      name: 'password',
      autocomplete: 'current-password',
      required: 'true',
      value: '',
      maxlength: '30',
      minlength: '6',
      pattern: '^[A-Za-z0-9]*-?[A-Za-z0-9]* ?[A-Za-z0-9]*$',
    },
    'password',
  );

  return password;
};

class LoginPage extends BaseComponent {
  private loginForm: BaseComponent;
  private login: BaseInput;
  private password: BaseInput;
  private submitBtn: BaseButton;
  public isSubmit = false;

  constructor() {
    super('div', ['mx-auto', 'container', 'max-w-7xl', 'px-2', 'sm:px-6', 'lg:px-8']);

    const title = createTitle();

    this.loginForm = new BaseComponent<HTMLFormElement>(
      'form',
      ['space-y-6', 'sm:mx-auto', 'sm:w-full', 'sm:max-w-sm'],
      { action: '#', method: 'POST' },
    );

    this.login = createLogin();

    this.password = createPassword();

    this.submitBtn = new BaseButton('submit', 'Login', []);
    this.submitBtn.addListener('click', (e) => {
      this.submitLoginForm(e);
    });

    this.loginForm.append(title, this.login, this.password, this.submitBtn);
    this.append(this.loginForm);
    this.validateInput();

    document.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.submitLoginForm(event);
      }
    });
  }

  public submitLoginForm(e: Event): void {
    if (this.validateForm(e)) {
      this.submitBtn.setClasses(['disabled']);
    }
  }

  private validateInput(): void {
    this.login.inputListener('input', () => {
      if (this.isSubmit) {
        isValid(this.loginForm.getElement());
      }
    });
    this.password.inputListener('input', () => {
      if (this.isSubmit) {
        isValid(this.loginForm.getElement());
      }
    });
  }

  private validateForm(e: Event): boolean {
    this.isSubmit = true;

    const isValidData = isValid(this.loginForm.getElement());

    e.preventDefault();
    e.stopPropagation();

    this.loginForm.setClasses(['was-validated']);
    return isValidData;
  }
}

const createPage = (): BaseComponent => {
  const page = new LoginPage();
  return page;
};

export default createPage;
