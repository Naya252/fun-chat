import BaseComponent from '@/components/shared/base-component';
import styles from '@/components/footer/footer.module.css';

export default class Footer extends BaseComponent {
  constructor() {
    super('footer', ['w-full']);

    const container = new BaseComponent('div', ['mx-auto', 'max-w-7xl', 'px-2', 'sm:px-6', 'lg:px-8']);
    const subcontainer = new BaseComponent('div', ['relative', 'flex', 'h-16', 'items-center', 'justify-between']);

    const github = new BaseComponent<HTMLAnchorElement>('a', [styles.github], {
      href: 'https://github.com/Naya252',
      target: '_blank',
    });
    const rss = new BaseComponent<HTMLAnchorElement>('a', [styles['rs-logo']], {
      href: 'https://rs.school/',
      target: '_blank',
    });

    container.append(subcontainer);
    subcontainer.append(github, rss);
    this.append(container);
  }
}
