import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Toaster } from 'sonner';
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:5036/graphql/" }), // TODO poner esto en un .env
  cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <ThemeProvider>
        <AppWrapper>
          <AuthProvider>
            <Toaster position="top-right" richColors />
            <App />
          </AuthProvider>
        </AppWrapper>
      </ThemeProvider>
    </StrictMode>
  </ApolloProvider>,
);
