import { createBrowserRouter } from "react-router-dom";
import ChatView from "../pages/chatview";
import OAuthView from "../pages/oauthview";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChatView />,
  },
  {
    path: "/oauth",
    element: <OAuthView />,
  },
]);

export default router;
