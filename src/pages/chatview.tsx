import ChatBox, { MessageBubbleProps } from "../components/ChatBox";
import { requestData, OpenAIWithOutStreamResponse } from "../api/request";
import { getCurrentDateTime } from "../utils";
import SendButton from "../components/SendButton";
import ModalBox from "../components/ModalBox";
import { saveAs } from "file-saver";
import {
  useState,
  KeyboardEvent,
  ChangeEvent,
  useCallback,
  useEffect,
} from "react";

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
  CardFooter,
  Tooltip,
  Box,
  Checkbox,
  IconButton,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  DownloadIcon,
  RepeatIcon,
  UpDownIcon,
  StarIcon,
} from "@chakra-ui/icons";

function ChatView() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Array<MessageBubbleProps>>([]);
  const [isStream, setIsStream] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (messages.length > 0 && lastMessage.role === "user") {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  const fetchData = async () => {
    const res = await requestData(messages, isStream);

    const data = res.body;
    const reader = data?.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      let message: string;
      const chunks = await reader?.read();

      setLoading(!chunks?.done);

      done = chunks?.done as boolean;
      const chunkValue = decoder.decode(chunks?.value);

      if (!isStream) {
        const data: OpenAIWithOutStreamResponse = JSON.parse(chunkValue);

        message = data.choices[0].message.content;
      } else {
        message = chunkValue;
      }
      pushMessage({
        content: message,
        role: "assistant",
      });
    }
  };

  const pushMessage = useCallback(
    (message: MessageBubbleProps) => {
      setMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];
        if (message.role !== "user" && lastMessage?.role === "assistant") {
          return [
            ...prevMessages.slice(0, -1),
            { ...lastMessage, content: lastMessage.content + message.content },
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
    if (inputValue.trim().length > 0) {
      pushMessage({ role: "user", content: inputValue.trim() });
      setInputValue("");
    }
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (inputValue.trim().length > 0 && e.key === "Enter") {
      pushMessage({
        content: inputValue.trim(),
        role: "user",
      });
      setInputValue("");
    }
  };

  const handleBoxChange = () => {
    setIsStream(!isStream);
  };

  const handleExportBtnClick = () => {
    if (messages.length > 0) {
      const markdown = messages
        .map((k) => {
          if (k.role === "user") {
            return `**🔒question:**\n${k.content.trim()}\n`;
          } else {
            return `**🗝️reply:**\n${k.content.trim()}\n\n ------`;
          }
        })
        .join("\n");
      const blob = new Blob([markdown], { type: "text/markdown" });
      const filename = getCurrentDateTime() + ".md";
      saveAs(blob, filename);
    } else {
      return;
    }
  };

  const handleCleanBtnClick = () => {
    setMessages([]);
  };
  const handleReGenerateBtnClick = () => {
    const lastMessages = messages[messages.length - 1];
    const currentMessage = messages[messages.length - 2];
    if (lastMessages.role === "assistant" && currentMessage.role === "user") {
      const newMessages = [...messages];
      newMessages.pop();
      setMessages(newMessages);
    } else {
      return;
    }
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
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Card
          w={["95%", "85%", "75%", "65%", "55%"]}
          height={"calc(100% - 130px)"}
          className="card-chat"
          bg={useColorModeValue("white", "#16161e")}
        >
          <Collapse in={!isOpen} animateOpacity>
            <CardHeader
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <div>
                <Heading as={"h3"} fontFamily="Noto Serif">
                  Chatty
                </Heading>
                <Text color={"#737aa2"}>A smart assitant for you.</Text>
              </div>
            </CardHeader>
            <Divider color={"#96a0d4"} />
          </Collapse>
          <CardBody overflowY={"auto"}>
            <ChatBox messages={messages} />
          </CardBody>
          <CardFooter>
            <Box
              mt="auto"
              display="grid"
              gap={3}
              gridTemplateColumns="repeat(18, 1fr)"
            >
              <Tooltip label="Is stream reply?">
                <IconButton aria-label="stream" size={"sm"}>
                  <Checkbox
                    defaultChecked={isStream}
                    onChange={handleBoxChange}
                    colorScheme={"facebook"}
                  ></Checkbox>
                </IconButton>
              </Tooltip>
              <Tooltip label="Export chat content">
                <IconButton
                  aria-label="export"
                  onClick={handleExportBtnClick}
                  size={"sm"}
                >
                  <DownloadIcon cursor="pointer" />
                </IconButton>
              </Tooltip>
              <Tooltip label="Immersement Chating">
                <IconButton
                  aria-label="collapse"
                  onClick={onToggle}
                  size={"sm"}
                >
                  <UpDownIcon cursor="pointer" />
                </IconButton>
              </Tooltip>
              <Tooltip label="regenerate chat content">
                <IconButton
                  aria-label="collapse"
                  onClick={handleReGenerateBtnClick}
                  size={"sm"}
                >
                  <RepeatIcon cursor="pointer" />
                </IconButton>
              </Tooltip>
              <Tooltip label="clean current chat content">
                <IconButton
                  aria-label="collapse"
                  onClick={handleCleanBtnClick}
                  size={"sm"}
                >
                  <DeleteIcon cursor="pointer" />
                </IconButton>
              </Tooltip>
              <Tooltip label="dnoate">
                <IconButton
                  aria-label="collapse"
                  onClick={() => setShow(true)}
                  size={"sm"}
                >
                  <StarIcon cursor="pointer" />
                </IconButton>
              </Tooltip>
            </Box>
          </CardFooter>
        </Card>
        <Card
          w={["95%", "85%", "75%", "65%", "55%"]}
          h="120px"
          bg={useColorModeValue("#fff", "#16161e")}
        >
          <CardBody display="flex" alignItems={"center"}>
            <Textarea
              value={inputValue}
              onChange={handleTextChange}
              onKeyDown={handleInputKeyDown}
              variant="flushed"
              placeholder="typing your questions..."
              resize="none"
              minH={"4rem"}
              autoFocus
            />
            <SendButton onClick={handleSendBtnClick} isLoading={isLoading} />
          </CardBody>
        </Card>
      </Flex>
      <ModalBox
        showModal={show}
        closeModal={() => setShow(false)}
        modalBody={<div>something here...</div>}
      ></ModalBox>
    </>
  );
}

export default ChatView;
