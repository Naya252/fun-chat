import BaseComponent from '@/components/shared/base-component';
import Users from './components/users-card';
import Chat from './components/chat-card';

class ChatPage extends BaseComponent {
  private side: Users;
  private chat: Chat;

  constructor() {
    super('div', ['mx-auto', 'container', 'flex', 'max-w-7xl', 'px-2', 'sm:px-6', 'lg:px-8', 'chat-page']);

    this.side = new Users();
    this.chat = new Chat();

    this.append(this.side, this.chat);
  }
}

const createPage = (): BaseComponent => {
  const page = new ChatPage();
  return page;
};

export default createPage;
