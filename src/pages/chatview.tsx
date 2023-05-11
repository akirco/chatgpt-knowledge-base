import ChatBox, { MessageBubbleProps } from '../components/ChatBox';
import SendButton from '../components/SendButton';
import { saveAs } from 'file-saver';
import { useState, KeyboardEvent, ChangeEvent, useCallback } from 'react';
import { requestData, OpenAIWithOutStreamResponse } from '../api/request';
import { getCurrentDateTime } from '../utils';
import { GithubOAuth } from '../components/Github';
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Textarea,
  Text,
  Heading,
  Divider,
  useColorModeValue,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';

function ChatView() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<MessageBubbleProps>>([]);
  const [isStream, setIsStream] = useState(true);
  const { isOpen, onToggle } = useDisclosure();

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
  /* -------------------------------------------------------------------------- */
  /*                                    main                                    */
  /* -------------------------------------------------------------------------- */
  return (
    <>
      <Flex
        flexDirection="column"
        w="100%"
        h="100%"
        py={2}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Card
          w={['95%', '85%', '75%', '65%', '55%']}
          height={'calc(100% - 140px)'}
          className="card-chat"
          bg={useColorModeValue('white', '#16161e')}
        >
          <Collapse in={!isOpen} animateOpacity>
            <CardHeader
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
            >
              <div>
                <Heading as={'h3'} fontFamily="Noto Serif">
                  chatbot
                </Heading>
                <Text color={'#737aa2'}>A smart assitant for you.</Text>
              </div>
              <GithubOAuth />
            </CardHeader>
            <Divider color={'#96a0d4'} />
          </Collapse>
          <CardBody overflowY={'auto'}>
            <ChatBox
              messages={messages}
              isStream={isStream}
              handleBoxChange={handleBoxChange}
              handleExportBtnClick={handleExportBtnClick}
              handleCollapseBtnClick={onToggle}
            />
          </CardBody>
        </Card>
        <Card
          w={['95%', '85%', '75%', '65%', '55%']}
          h="120px"
          pos="fixed"
          bottom={3}
          bg={useColorModeValue('#fff', '#16161e')}
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
    </>
  );
}

export default ChatView;
