import { Button } from '@chakra-ui/react';
import { MdiGithubFace } from './icons/MdiGithubFace';

const gh_clientId = import.meta.env.VITE_GH_AUTH_CLIENT_ID || '';
const gh_clientSecret = import.meta.env.VITE_GH_AUTH_CLIENT_SECRETS;
const gh_Redirect_URI = import.meta.env.VITE_GH_AUTH_REDIRECT_URI || '';
const gh_Max_Open_Popup = 60000;

export type OAuthResponse = {
  vendor: 'github';
  success?: {
    code: string;
  };
  isError?: boolean;
};

const scopeAsParam = (scopes: string[]) => {
  return scopes.reduce((rev, curr) => `${rev}+${curr}`);
};

const openDialog = (url: string): Promise<OAuthResponse> => {
  const popup = window.open(url, '', 'width=700, height=700,fullscreen=no');
  let openDuration = 0;

  const promise = new Promise<OAuthResponse>((resolve, reject) => {
    const checking = setInterval(() => {
      const response = localStorage.getItem('oauth-response');

      if (response) {
        const data = JSON.parse(response);

        if (data.isError) {
          reject(new Error('Access denied'));
        } else {
          resolve(data);
        }

        clearInterval(checking);
        localStorage.removeItem('oauth-response');
      }

      if (openDuration >= gh_Max_Open_Popup) {
        popup?.close();
        reject(new Error('Timeout'));
        clearInterval(checking);
      }
      openDuration += 1000;

      if (popup?.closed) {
        reject(new Error('Closed'));
        clearInterval(checking);
      }
    }, 1000);
  });

  return promise;
};

export function GithubOAuth() {
  const githubDialog = () => {
    const state = JSON.stringify({
      vendor: 'github',
    });

    const scopes = ['read:user', 'user:email'];
    // authorize get
    const dialogUrl = new URL('https://github.com/login/oauth/authorize');

    const dialogUrlParam = dialogUrl.searchParams;
    dialogUrlParam.append('client_id', gh_clientId);
    dialogUrlParam.append('redirect_uri', gh_Redirect_URI);
    dialogUrlParam.append('allow_signup', 'true');
    dialogUrlParam.append('state', state);
    dialogUrlParam.append('scope', scopeAsParam(scopes));
    const url = decodeURIComponent(dialogUrl.toString());
    openDialog(url)
      .then((response) => {
        console.log(response.success?.code);

        window
          .fetch('/github/login/oauth/access_token', {
            headers: {
              Accept: 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            method: 'POST',
            body: JSON.stringify({
              client_id: gh_clientId,
              client_secret: gh_clientSecret,
              code: response.success?.code,
              redirect_uri: '127.0.0.1:5173',
            }),
          })
          .then((res) => {
            console.log('res:', res);
          });
        // setGithubCode(response.success?.code || '');
      })
      .catch(() => {
        // setGithubCode('');
      });
  };
  return (
    <>
      <Button onClick={githubDialog} leftIcon={<MdiGithubFace />}>
        Login
      </Button>
    </>
  );
}
