import { MantineProvider } from "@mantine/core";
import usePersistentState from "../hooks/usePersistState";
import store from "store";
import { useEffect, useState } from "react";
import RouterTransition from "../components/app/routerTransition";
import { ModalsProvider } from "@mantine/modals";

export function useTheme() {
  const [theme, setTheme] = usePersistentState(
    "theme",
    store.get("theme") ?? "light"
  );
  return [theme, setTheme];
}

function MyApp({ Component, pageProps }) {
  const [themeColor, setTheme] = usePersistentState(
    "theme",
    store.get("theme") ?? "light"
  );
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: themeColor }}
    >
      <ModalsProvider>
        <RouterTransition />
        {pageLoaded ? (
          <Component
            {...pageProps}
            themeColor={themeColor}
            setTheme={setTheme}
          />
        ) : null}
      </ModalsProvider>
    </MantineProvider>
  );
}

export default MyApp;
