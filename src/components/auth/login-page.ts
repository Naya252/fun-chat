import BaseComponent from '@/components/shared/base-component';
import BaseInput from '@/components/shared/base-input/base-input';
import BaseButton from '@/components/shared/base-button/base-button';
import isValid from '@/utils/form-validation';
import * as repository from '@/repositories/front-requests';
import store from '@/store/store';
import { ROUTES } from '@/router/pathes';
import emitter from '@/utils/event-emitter';

const createTitle = (): BaseComponent => {
  const title = new BaseComponent(
    'h2',
    ['mt-10', 'text-center', 'text-2xl', 'font-bold', 'leading-9', 'tracking-tight', 'text-gray-300'],
    {},
    'Sign in to Fun chat',
  );

  return title;
};

const createLogin = (): BaseInput => {
  const login = new BaseInput(
    'login',
    'Login',
    'login-text',
    '',
    {
      name: 'login',
      autocomplete: 'off',
      required: 'true',
      value: '',
      maxlength: '12',
      minlength: '4',
      pattern: '^[A-Z]{1}[a-z0-9]*-?[A-Za-z0-9]*',
    },
    'text',
    ['focus:ring-sky-500'],
  );

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
      pattern: '^[A-Z]{1}[a-z0-9]*-?[A-Za-z0-9]*',
    },
    'password',
    ['focus:ring-sky-500'],
  );

  return password;
};

class LoginPage extends BaseComponent {
  private loginForm: BaseComponent;
  private login: BaseInput;
  private password: BaseInput;
  private submitBtn: BaseButton;
  public isSubmit = false;
  private onChangeRoute: (route: string, isAuth: boolean) => void;
  private destroyFns: VoidFunction[] = [];

  constructor(routerPush: (route: string, isAuth: boolean) => void) {
    super('div', ['mx-auto', 'container', 'max-w-7xl', 'px-2', 'sm:px-6', 'lg:px-8']);
    this.onChangeRoute = routerPush;
    const title = createTitle();

    this.loginForm = new BaseComponent<HTMLFormElement>(
      'form',
      ['space-y-6', 'mx-3', 'sm:mx-auto', 'sm:w-full', 'sm:max-w-sm'],
      { action: '#', method: 'POST' },
    );

    this.login = createLogin();
    this.password = createPassword();

    this.submitBtn = new BaseButton('submit', 'Login', [
      'bg-sky-600',
      'hover:bg-sky-500',
      'focus-visible:outline-sky-600',
      'disabled:bg-sky-600',
      'disabled:hover:bg-sky-600',
      'disabled:focus:bg-sky-600',
    ]);
    this.submitBtn.addListener('click', (e) => {
      this.submitLoginForm(e);
    });
    this.loginForm.append(title, this.login, this.password, this.submitBtn);
    this.append(this.loginForm);
    this.validateInput();
    document.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && !store.user.isAuth()) {
        event.preventDefault();
        this.submitLoginForm(event);
      }
    });
    this.destroyFns = [
      emitter.on('login', () => this.goToChat()),
      emitter.on('loginError', () => this.removeDisabled()),
    ];
  }

  public remove(): void {
    this.destroyFns.forEach((fn) => fn());
    super.remove();
  }

  public submitLoginForm(e: Event): void {
    if (this.validateForm(e)) {
      const btn = this.submitBtn.getElement();
      btn.setAttribute('disabled', '');

      const login = this.login.getValue();
      const password = this.password.getValue();

      repository.loginUser(login, password);
      store.user.setLogin(login);
      store.user.setPassword(password);
    }
  }

  private removeDisabled(): void {
    const btn = this.submitBtn.getElement();
    btn.removeAttribute('disabled');
  }

  public goToChat(): void {
    this.removeDisabled();
    const isAuth = store.user.isAuth();

    this.onChangeRoute(ROUTES.Chat, isAuth);
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

const createPage = (routerPush: (route: string, isAuth: boolean) => void): BaseComponent => {
  const page = new LoginPage(routerPush);
  return page;
};

export default createPage;
