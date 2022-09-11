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
import Login from "./login";

export default function SignUp() {
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
          SignUp
        </Title>
      </Container>
      <Container size={420} mb={20} mt={40}>
        <Text size="sm" align="center" mt={10} mb={30}>
          Already have an account?{" "}
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
                    <Login />
                  </>
                ),
              });
            }}
          >
            Sign into your account
          </Anchor>
        </Text>

        <Group position="apart" grow>
          <TextInput label="Email" placeholder="youemail@gmail.com" required />
          <TextInput label="Username" placeholder="John Doe" required />
        </Group>
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          mt="md"
        />
        <Button fullWidth mt="xl">
          Sign up
        </Button>
      </Container>
    </body>
  );
}
