import store from '@/store/store';
import * as repository from '@/repositories/front-requests';

export const formatDate = (datetime: number): string => {
  const currentDate = new Date(datetime);

  const formattedDate = currentDate.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const formattedTime = currentDate.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const formattedDateTime = `${formattedDate}, ${formattedTime}`;

  return formattedDateTime;
};

export const scrollTo = (element: HTMLElement | ChildNode): void => {
  if (element instanceof HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
};

export const readMessages = (member: string): void => {
  const data = store.users.getChatData(member);
  if (data && data.newMessages && data.newMessages?.length > 0) {
    data.newMessages.forEach((el) => {
      repository.readMessage(el.id);
    });
  }
};
