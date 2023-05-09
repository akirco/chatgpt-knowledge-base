import ThemeToggleButton from './components/ThemeToggleButton';
import ChatBox, { MessageBubbleProps } from './components/ChatBox';
import SendButton from './components/SendButton';
import { saveAs } from 'file-saver';
import { useState, KeyboardEvent, ChangeEvent, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Textarea,
  Text,
  Heading,
  Divider,
} from '@chakra-ui/react';
import { requestData, OpenAIWithOutStreamResponse } from './api/request';
import { getCurrentDateTime } from './utils';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<MessageBubbleProps>>([]);
  const [isStream, setIsStream] = useState(true);

  const fetchData = async () => {
    const res = await requestData(inputValue, isStream);
    const data = res.body;

    const reader = data?.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      let message: string;
      const chunks = await reader?.read();
      done = chunks?.done as boolean;
      const chunkValue = decoder.decode(chunks?.value);
      if (!isStream) {
        const data: OpenAIWithOutStreamResponse = JSON.parse(chunkValue);
        message = data.choices[0].message.content;
      } else {
        message = chunkValue;
      }
      pushMessage({
        message: message,
        role: 'assistant',
      });
    }
  };

  const pushMessage = useCallback(
    (message: MessageBubbleProps) => {
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (message.role !== 'user' && lastMessage?.role === 'assistant') {
          return [
            ...prevMessages.slice(0, -1),
            { ...lastMessage, message: lastMessage.message + message.message },
          ];
        } else {
          return [...prevMessages, message];
        }
      });
    },
    [setMessages]
  );

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendBtnClick = () => {
    if (inputValue) {
      pushMessage({ role: 'user', message: inputValue });
      setInputValue('');
      fetchData();
    }
  };

  const handleInputKeyDown = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (inputValue && e.key === 'Enter') {
      pushMessage({
        message: inputValue,
        role: 'user',
      });
      setInputValue('');
      fetchData();
    }
  };
  const handleBoxChange = () => {
    setIsStream(!isStream);
  };
  const handleExportBtnClick = () => {
    const markdown = messages
      .map((k) => {
        if (k.role === 'user') {
          return `**🔒question:**\n${k.message.trim()}\n`;
        } else {
          return `**🗝️reply:**\n${k.message.trim()}\n\n ------`;
        }
      })
      .join('\n');
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const filename = getCurrentDateTime() + '.md';
    saveAs(blob, filename);
  };
  return (
    <>
      <Flex
        flexDirection="column"
        w="100%"
        h="100%"
        py={'15px'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Card
          w={['95%', '85%', '75%', '65%', '55%']}
          height={'calc(100% - 140px)'}
        >
          <CardHeader>
            <Heading as={'h3'}>chatbot</Heading>
            <Text color={'#737aa2'}>A smart assitant for you.</Text>
          </CardHeader>
          <Divider />
          <CardBody overflowY={'auto'}>
            <ChatBox
              messages={messages}
              isStream={isStream}
              handleBoxChange={handleBoxChange}
              handleExportBtnClick={handleExportBtnClick}
            />
          </CardBody>
        </Card>
        <Card
          w={['95%', '85%', '75%', '65%', '55%']}
          h="120px"
          pos="fixed"
          bottom={'20px'}
        >
          <CardBody display="flex" alignItems={'center'}>
            <Textarea
              value={inputValue}
              onChange={handleTextChange}
              onKeyDown={handleInputKeyDown}
              variant="flushed"
              placeholder="typing your questions..."
              resize="none"
              minH={'4rem'}
              autoFocus
            />
            <SendButton onClick={handleSendBtnClick} />
          </CardBody>
        </Card>
      </Flex>
      <ThemeToggleButton />
    </>
  );
}

export default App;
