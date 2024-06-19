import { Auth0Provider } from "@auth0/auth0-react";

function Auth0ProviderWithNavigate({ children }) {
  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;

  if (!domain || !clientId || !redirectUri) 
  {
    throw new Error("Unable to initialise the auth: Missing environment variables");
  }

  const onRedirectCallback = (appState, error) => {
    if (error) {
      console.error("Auth0 redirect error:", error);
    } else {
      console.log("Auth0 redirect success:", appState);
    }
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirectUri:{redirectUri},
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}

export default Auth0ProviderWithNavigate;
