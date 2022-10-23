import {useEffect, useState} from "react";
import {
  AppShell,
  Box,
  Burger,
  Button,
  Divider,
  Group,
  Header,
  MediaQuery,
  Navbar,
  NavLink,
  ScrollArea,
  Text,
  TextInput,
  useMantineTheme,
} from "@mantine/core";

import IconLogto from "../public/icon";

import {IconSearch, IconUserCircle} from "@tabler/icons";

import {
  BuildingShop24Regular,
  Comment24Regular,
  Home24Regular,
  PeopleSettings24Regular,
  Person24Regular,
  PersonBoard24Regular,
  Search24Regular,
  StoreMicrosoft24Regular,
} from "@fluentui/react-icons";

import apiEndpoints from "../config/api";

import ToggleTheme from "../components/theme/toogleTheme";
import {openModal} from "@mantine/modals";
import Login from "../components/app/login";
import * as axios from "axios";


const NavBarDivider = ({text}) => <Divider
    my="xs"
    variant="solid"
    labelPosition="center"
    label={
      <>
        <Box ml={5}>{text}</Box>
      </>
    }
/>

export default function Index() {
  const theme = useMantineTheme();
  const [session, setSession] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      return await (await axios.default.get(apiEndpoints.home)).data;
    };
    setSession(fetchData());
  }, []);

  const [opened, setOpened] = useState(false);

  const bodyComponent = useState("");

  const navLinks = [
    {
      label: "home",
      variant: "light",
      color: "blue",
      description: "browse all products",
      icon: <Home24Regular />
    },{
      label: "subscriptions",
      variant: "light",
      color: "blue",
      description: "subscriptions",
      icon: <StoreMicrosoft24Regular />
    },{
    label: "your store",
    variant: "light",
    color: "blue",
    description: "manage your own store",
    icon: <BuildingShop24Regular />
  }]

  const navLinks2 = [
    {
      label: "profile",
      variant: "light",
      color: "blue",
      icon: <Person24Regular />
    }, {
    label: "settings",
    variant: "light",
    color: "blue",
    icon: <PeopleSettings24Regular />
  }, {
    label: "dashboard",
    variant: "light",
    color: "blue",
    icon: <PersonBoard24Regular />
  }]

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

          <Navbar.Section
            grow
            component={ScrollArea}
            position={{ top: 0, left: 0 }}
          >
            {navLinks.map(e => <NavLink
                label={e?.label}
                variant={e?.variant}
                color={e?.color}
                key={e.toString()}
                description={e?.description}
                icon={e.icon}
            />)}
            <NavBarDivider text="account & settings" />
            {navLinks2.map(e => <NavLink
                label={e?.label}
                variant={e?.variant}
                color={e?.color}
                key={e.toString()}
                description={e?.description}
                icon={e.icon}
            />)}
            <NavBarDivider text="comment" />
            <NavLink
              label="write us"
              variant="light"
              color="blue"
              description="report a bug or request a feature"
              icon={<Comment24Regular />}
            />
          </Navbar.Section>
        </Navbar>
      }
      header={
        <Header height={70}>
          <Group position="apart" my={"sm"}>
            <MediaQuery largerThan="sm">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                  sx={(theme) =>({
                    [theme.fn.largerThan('sm')]: {
                      display: "none",
                    }
                  })}
                />
                <div style={{
                  paddingLeft: "15px"
                }}><IconLogto /></div>
              </div>
            </MediaQuery>
            {/* <IconLogto /> */}
            <Group
              sx={(theme) => ({
                [theme.fn.largerThan("xl")]: {
                  display: "none",
                },
              })}
            >
              <IconSearch />
            </Group>
            <TextInput
              placeholder="search"
              icon={<Search24Regular filled={"true"} primaryFill="blue" />}
              size="sm"
              sx={(theme) => ({
                width: "45vw",
                [theme.fn.smallerThan("xl")]: {
                  display: "none",
                },
              })}
            />
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
      <Text>body…</Text>
    </AppShell>
  );
}
