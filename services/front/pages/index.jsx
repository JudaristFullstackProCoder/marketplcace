import { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  ScrollArea,
  NavLink,
  Box,
  Divider,
  TextInput,
  Group,
  Button,
} from "@mantine/core";

import IconLogto from "../public/icon";

import {
  Home24Regular,
  StoreMicrosoft24Regular,
  Comment24Regular,
  BuildingShop24Regular,
  PeopleSettings24Regular,
  Person24Regular,
  PersonBoard24Regular,
  Search24Regular,
} from "@fluentui/react-icons";

import { IconUserCircle } from "@tabler/icons";

import ToggleTheme from "../components/theme/toogleTheme";
import { openModal } from "@mantine/modals";
import Login from "../components/app/login";

export default function Index() {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 200 }}
        >
          <Navbar.Section></Navbar.Section>
          <Navbar.Section
            grow
            component={ScrollArea}
            position={{ top: 0, left: 0 }}
          >
            <NavLink
              label="home"
              variant="light"
              color="blue"
              description="browse all products"
              icon={<Home24Regular />}
            />
            <NavLink
              label="subscriptions"
              variant="light"
              color="blue"
              description="subscriptions"
              icon={<StoreMicrosoft24Regular />}
            />
            <NavLink
              label="your store"
              variant="light"
              color="blue"
              description="manage your own store"
              icon={<BuildingShop24Regular />}
            />
            <Divider
              my="xs"
              variant="solid"
              labelPosition="center"
              label={
                <>
                  <Box ml={5}>account & settings</Box>
                </>
              }
            />
            <NavLink
              label="profile"
              variant="light"
              color="blue"
              icon={<Person24Regular />}
            />
            <NavLink
              label="settings"
              variant="light"
              color="blue"
              icon={<PeopleSettings24Regular />}
            />
            <NavLink
              label="dashboard"
              variant="light"
              color="blue"
              icon={<PersonBoard24Regular />}
            />
            <Divider
              my="xs"
              variant="solid"
              labelPosition="center"
              label={
                <>
                  <Box ml={5}>comment</Box>
                </>
              }
            />
            <NavLink
              label="write us"
              variant="light"
              color="blue"
              description="report a bug or request a feature"
              icon={<Comment24Regular />}
            />
          </Navbar.Section>
          <Navbar.Section></Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70}>
          <Group position="apart">
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Group
              grow
              p={"md"}
              position={"apart"}
              sx={(theme) => ({
                paddingLeft: "10px",
                [theme.fn.smallerThan("sm")]: {
                  display: "none",
                },
              })}
            >
              <IconLogto />
            </Group>
            <div>
              <TextInput
                placeholder="search"
                icon={<Search24Regular filled={"true"} primaryFill="blue" />}
                size="sm"
                sx={{ width: "45vw" }}
              />
            </div>
            <Group sx={{ paddingRight: "10px" }} grow={false}>
              <Button
                leftIcon={<IconUserCircle />}
                variant="outline"
                size="xs"
                color="gray"
                onClick={() => {
                  openModal({
                    children: (
                      <>
                        <Login />
                      </>
                    ),
                  });
                }}
              >
                Login
              </Button>
              <ToggleTheme />
            </Group>
          </Group>
        </Header>
      }
    >
      <Text></Text>
    </AppShell>
  );
}
