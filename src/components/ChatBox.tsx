import { Avatar, Tooltip } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useEffect, useRef, useState } from "react";
import { CopyIcon } from "@chakra-ui/icons";
import MarkdownIt from "markdown-it";
import mdHighlight from "markdown-it-highlightjs";
import mdKbd from "markdown-it-kbd";
import mdKatex from "markdown-it-katex";
import { preWrapperPlugin } from "../utils";
import userAvatar from "../assets/icon/person.jpg";
import assistantAvatar from "../assets/icon/bot.png";
import "highlight.js/styles/tokyo-night-dark.css";
import "../assets/style/chatbox.css";

export type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
};

const ChatBoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
`;
const MessageBubbleContainer = styled.div<{ role: "user" | "assistant" }>`
  display: flex;
  flex-direction: ${({ role }) => (role === "user" ? "row-reverse" : "row")};
  align-items: flex-start;
  margin-bottom: 16px;
  align-items: center;
  animation: pop-up 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
  animation-fill-mode: backwards;
  @keyframes pop-up {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MessageTextContainer = styled.div<{ role: "user" | "assistant" }>`
  position: relative;
  background-color: ${({ role }) => (role === "user" ? "#2C7A7B" : "#E2E8F0")};
  color: ${({ role }) => (role === "user" ? "#FFFFFF" : "#1A202C")};
  border-radius: 8px;
  padding: 8px;
  margin: 4px;
  @media (max-width: 780px) {
    width: calc(100% - 70px);
  }
`;

const CopyIconContainer = styled.div`
  position: absolute;
  right: 5px;
  top: 15px;
  transform: translateY(-50%);
  opacity: 0.5;
  color: #232327;
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

const md = MarkdownIt({
  linkify: true,
  breaks: true,
})
  .use(mdKatex)
  .use(mdHighlight, {
    inline: true,
  })
  .use(mdKbd)
  .use(preWrapperPlugin);

const copyCodeHandler = () => {
  const copybtns = document.getElementsByClassName(
    "copy-code"
  ) as HTMLCollectionOf<HTMLButtonElement>;

  if (copybtns) {
    Array.from(copybtns).forEach((copybtn) => {
      copybtn.addEventListener("click", () => {
        const sibling = copybtn.nextElementSibling as HTMLPreElement | null;
        if (!parent || !sibling) {
          return;
        }
        const text = sibling.innerText;
        navigator.clipboard.writeText(text.trim()).then(() => {
          copybtn.classList.add("copied");
        });
      });
    });
  }
};

const MessageBubble = ({ content, role }: MessageBubbleProps) => {
  const [showCopyIcon, setShowCopyIcon] = useState(false);
  const [isOpenToolTip, setIsOpenToolTip] = useState(false);
  const codeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (role === "assistant") {
      if (codeRef.current?.querySelector("code")) {
        copyCodeHandler();
      }
    }
  }, [content, role]);

  const handleMouseOver = () => {
    setShowCopyIcon(true);
  };

  const handleMouseLeave = () => {
    setShowCopyIcon(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setShowCopyIcon(false);
    setIsOpenToolTip(true);
    setTimeout(() => {
      setIsOpenToolTip(false);
    }, 500);
  };

  return (
    <MessageBubbleContainer role={role}>
      <Avatar src={role === "user" ? userAvatar : assistantAvatar} />
      <Tooltip
        hasArrow
        label="Copied!"
        placement="top-start"
        isOpen={isOpenToolTip}
      >
        <MessageTextContainer
          role={role}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={codeRef}
            style={{ marginRight: "15px", marginLeft: "15px" }}
            dangerouslySetInnerHTML={{ __html: md.render(content) }}
          ></div>

          {showCopyIcon && (
            <CopyIconContainer onClick={handleCopy}>
              <CopyIcon />
            </CopyIconContainer>
          )}
        </MessageTextContainer>
      </Tooltip>
    </MessageBubbleContainer>
  );
};

interface ChatBoxProps {
  messages: Array<MessageBubbleProps>;
}

const ChatBox = ({ messages }: ChatBoxProps) => {
  const chatBoxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (chatBoxRef.current) {
      const chatBox = chatBoxRef.current;
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  }, [messages]);

  return (
    <ChatBoxContainer ref={chatBoxRef}>
      {messages.map((message, index) => (
        <MessageBubble
          key={index}
          content={message.content}
          role={message.role}
        />
      ))}
    </ChatBoxContainer>
  );
};

export default ChatBox;
