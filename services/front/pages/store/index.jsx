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
  useMantineTheme,
} from "@mantine/core";

import IconLogto from "../../public/icon";

import {IconSearch, IconUserCircle} from "@tabler/icons";

import {
    Alert24Regular,
  Comment24Regular,
  Home24Regular,
  Image24Regular,
  LauncherSettings24Regular,
  ShoppingBag24Regular,
  StoreMicrosoft24Regular,
} from "@fluentui/react-icons";

import apiEndpoints from "../../config/api";

import ToggleTheme from "../../components/theme/toogleTheme";
import {openModal} from "@mantine/modals";
import Login from "../../components/app/login";
import * as axios from "axios";
import Router from "next/router";


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

export default function UserStoreIndex() {
  const theme = useMantineTheme();
  const [session, setSession] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      return await (await axios.default.get(apiEndpoints.home)).data;
    };
    setSession(fetchData());
  }, []);

  const [opened, setOpened] = useState(false);

  const [bodyComponent, setBodyComponent] = useState("dashboard");

  const navLinks = [
    {
      label: "Dashboard",
      variant: "light",
      color: "blue",
      description: "",
      icon: <Home24Regular />,
      click: () => {
        setBodyComponent('body')
      }
    },{
      label: "orders",
      variant: "light",
      color: "blue",
      description: "",
      icon: <StoreMicrosoft24Regular />,
      click: () => {
          setBodyComponent('orders')
      }
    },{
    label: "Products",
    variant: "light",
    color: "blue",
    description: "",
    icon: <ShoppingBag24Regular />,
      click: () => {
        setBodyComponent('store')
      }
  }]

  const navLinks2 = [
    {
      label: "Notification",
      variant: "light",
      color: "blue",
      icon: <Alert24Regular />,
      click: () => {
          setBodyComponent('notification')
      }
    }, {
    label: "settings",
    variant: "light",
    color: "blue",
    icon: <LauncherSettings24Regular />,
      click: () => {
          setBodyComponent('settings')
      }
  }, {
    label: "Images",
    variant: "light",
    color: "blue",
    icon: <Image24Regular />,
      click: () => {
      setBodyComponent('images')
      }
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
            {navLinks.map(e => <span key={e.toString()} onClick={e.click}><NavLink
                label={e?.label}
                variant={e?.variant}
                color={e?.color}
                key={e.toString()}
                description={e?.description}
                icon={e.icon}
            /></span>)}
            <NavBarDivider text="account & settings" />
            {navLinks2.map(e => <span key={e.toString()} onClick={e.click}><NavLink
                label={e?.label}
                variant={e?.variant}
                color={e?.color}
                key={e.toString()}
                description={e?.description}
                icon={e.icon}
            /></span>)}
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
      <div>{bodyComponent}</div>
    </AppShell>
  );
}
