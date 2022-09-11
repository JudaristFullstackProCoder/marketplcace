import { ActionIcon, Group } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons";
import { useRouter } from "next/router";
import { useTheme } from "../../pages/_app";

export default function ToggleTheme() {
  const [theme, setTheme] = useTheme();
  const router = useRouter();

  return (
    <ActionIcon
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
        router.reload();
      }}
      size="lg"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color:
          theme.colorScheme === "dark"
            ? theme.colors.yellow[4]
            : theme.colors.blue[6],
      })}
    >
      {theme === "dark" ? <IconSun size={18} /> : <IconMoonStars size={18} />}
    </ActionIcon>
  );
}
