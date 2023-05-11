import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { OAuthResponse } from '../components/Github';
import { Box } from '@chakra-ui/react';

const OAuthView = (): React.ReactElement => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const state = JSON.parse(searchParams.get('state') || '');
    const vendor = state.vendor as OAuthResponse['vendor'];
    const code = searchParams.get('code') || '';
    const response: OAuthResponse = {
      vendor,
    };

    if (code) {
      const successResponse: OAuthResponse = {
        ...response,
        success: {
          code,
        },
      };

      localStorage.setItem('oauth-response', JSON.stringify(successResponse));
      window.close();
      return;
    }

    const responseError: OAuthResponse = {
      ...response,
      isError: true,
    };
    localStorage.setItem('oauth-response', JSON.stringify(responseError));
    window.close();
  }, [searchParams]);
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        height: '100vh',
        width: '100%',
      }}
    >
      <div className="lds-facebook">
        <div />
        <div />
        <div />
      </div>
      <Box sx={{ marginTop: '16px' }}>Redirecting...</Box>
    </Box>
  );
};

export default OAuthView;
