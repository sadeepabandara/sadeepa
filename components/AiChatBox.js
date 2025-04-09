import React from 'react';
import { useChat } from 'ai/react';
import { IoClose } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const AiChatBox = ({ open, onClose }) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat({
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Hi, I'm the chatbot",
      },
      {
        id: '2',
        role: 'user',
        content: "Hi, I'm the user",
      },
      {
        id: '3',
        role: 'assistant',
        content: `
[Coding in flow](https://facebook.com)

List:
- Item 1
- Item 2
- Item 3
`,
      },
    ],
  });

  if (!open) return null;

  return (
    <div className='bottom-0 z-50 w-full max-w-[500px] xl:right-36 fixed'>
      <button onClick={onClose} className='block mb-1 ms-auto'>
        <IoClose size={30} className='bg-black rounded-full' />
      </button>
      <div className='flex h-[600px] flex-col rounded bg-white/10 backdrop-blur-sm shadow-xl'>
        <div className='h-full px-3 mt-3 overflow-y-auto'>
          {messages.map((message) => (
            <ChatMessage message={message} key={message.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AiChatBox;

const ChatMessage = ({ message: { role, content } }) => {
  const isAiMessage = role === 'assistant';

  return (
    <div
      className={`flex items-center mb-3 ${
        isAiMessage ? 'me-5 justify-start' : 'ms-5 justify-end'
      }`}
    >
      {isAiMessage && <FaRobot className='flex-none mr-5' />}
      <div
        className={`rounded-md border px-3 py-2 ${
          isAiMessage
            ? 'bg-white border-black text-black'
            : 'bg-black text-white'
        }`}
      >
        <ReactMarkdown
          components={{
            p: ({ node, ...props }) => (
              <p
                {...props}
                className={isAiMessage ? 'text-black' : 'text-white'}
              />
            ),
            a: ({ node, ...props }) => (
              <a
                {...props}
                className={isAiMessage ? 'text-black' : 'text-white'}
              />
            ),
            li: ({ node, ...props }) => (
              <li
                {...props}
                className={isAiMessage ? 'text-black' : 'text-white'}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};
