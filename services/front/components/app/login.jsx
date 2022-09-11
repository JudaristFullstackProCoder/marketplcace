import {
  TextInput,
  PasswordInput,
  Anchor,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";

import { openModal, closeAllModals } from "@mantine/modals";

import SignUp from "./signup";

export default function Login() {
  return (
    <body>
      <Container mt={5}>
        {" "}
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
            fontSize: "2em",
            color: "black",
          })}
        >
          Login
        </Title>
      </Container>
      <Container size={420} mb={20} mt={40}>
        <Text size="sm" align="center" mt={5}>
          Do not have an account yet?{" "}
          <Anchor
            href="#"
            size="sm"
            onClick={(event) => {
              event.preventDefault();
              openModal({
                onClose: () => closeAllModals(),
                closeOnClickOutside: true,
                children: (
                  <>
                    <SignUp />
                  </>
                ),
              });
            }}
          >
            Create account
          </Anchor>
        </Text>

        <TextInput label="Email" placeholder="you@mantine.dev" required />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
        />
        <Group position="apart" mt="md">
          <Anchor
            onClick={(event) => event.preventDefault()}
            href="#"
            size="sm"
          >
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl">
          Sign in
        </Button>
      </Container>
    </body>
  );
}
