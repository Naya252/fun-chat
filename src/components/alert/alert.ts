import BaseComponent from '@/components/shared/base-component';
import styles from '@/components/alert/alert.module.css';
import { ALERT_TYPES } from '@/shared/constants';

const removeAlert = (alert: BaseComponent): void => {
  setTimeout(() => {
    alert.removeClasses(['show']);
    setTimeout(() => {
      alert.remove();
    }, 300);
  }, 3000);
};

export type AlertType = 'success' | 'info' | 'warning';

class BaseAlert extends BaseComponent {
  private count: number;

  constructor() {
    super('div', [styles.alerts]);
    this.count = 0;
  }

  private createAlert(type: AlertType, message: string): BaseComponent {
    const alert = new BaseComponent('div', [styles.alert], {
      id: `alert-${this.count}`,
    });
    const icon = new BaseComponent('div', [styles.icon]);
    const text = new BaseComponent('p', [styles['alert-content']]);
    alert.append(icon, text);

    if (type === ALERT_TYPES.success) {
      alert.setClasses(['alert-success']);
      icon.setClasses([styles.success]);
      text.setHTML(message);
    }
    if (type === ALERT_TYPES.info) {
      alert.setClasses(['alert-info']);
      icon.setClasses([styles.info]);
      text.setHTML(message);
    }
    if (type === ALERT_TYPES.warning) {
      alert.setClasses(['alert-danger', 'bg-pink-900', 'text-pink-200', 'rounded-md', 'px-3', 'py-3']);
      icon.setClasses([styles.warning]);
      text.setHTML(message);
    }

    this.count += 1;
    return alert;
  }

  public addAlert(type: AlertType, message: string): void {
    const alert = this.createAlert(type, message);

    this.append(alert);

    setTimeout(() => {
      alert.setClasses(['show']);
      removeAlert(alert);
    }, 200);
  }
}

const alerts = new BaseAlert();
export default alerts;
