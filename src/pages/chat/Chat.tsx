import MessageList from './MessageList';
import 'styles/chat.css';
import { useEffect, useState } from 'react';
import { gun, user } from 'lib/gun';
import { logout } from 'lib/authentication';
import UserType from 'types/User';
import { useRef } from 'react';
import { SEA } from 'gun';
import { uid } from 'uid';
import { useNavigate } from 'react-router-dom';

const PAIR = '#foo';

export default function Chat() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserType>();
  const [messages, setMessages] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user['is']) {
      gun.user().on((data) => {
        setProfile({
          alias: data.alias,
          pub: data.pub,
        });
      });

      gun
        .get('chats')
        .map()
        .on(async (data, id) => {
          if (data?.text) {
            const title = await SEA.decrypt(data.alias, PAIR);

            const message = {
              id,
              title,
              type: 'text',
              date: new Date(data.createdAt),
              text: (await SEA.decrypt(data.text, PAIR)) + '',
              time: data.createdAt,
            };

            setMessages((m) => {
              const newMessages = [...m];
              if (!newMessages.find((item) => item.id === id)) {
                newMessages.push(message);
              }
              return newMessages.sort((a, b) => a.time - b.time);
            });
          }
        });
    } else {
      navigate('/');
    }
  }, []);

  const sendMessage = async (data: string) => {
    const secret = await SEA.encrypt(data, PAIR);
    const alias = await SEA.encrypt(profile?.alias, PAIR);
    const date = new Date().toISOString();
    const message = user
      .get('all')
      .set({ createdAt: date, text: secret, alias });
    const id = uid();
    gun.get('chats').get(id).put(message);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current?.value) {
      sendMessage(inputRef.current.value);
      inputRef.current.value = '';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-top">
          <div>@{profile?.alias}</div>
          <button
            onClick={handleLogout}
            className="rce-button submit"
            type="submit"
          >
            Logout
          </button>
        </div>
      </div>
      <div>
        <div>
          <MessageList
            messages={messages.map((item) => {
              const isOwner = item.title === profile?.alias;

              return {
                ...item,
                position: isOwner ? 'right' : 'left',
              };
            })}
          />
        </div>
        <form onSubmit={handleSubmit} className="chat-input-wrapper">
          <input
            className="rce-input rce-input-textarea"
            placeholder="Type here..."
            ref={inputRef}
          />
          <button className="rce-button" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
