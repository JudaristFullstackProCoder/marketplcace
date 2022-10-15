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
import endpoints from '../../config/api';
import { useForm } from "react-hook-form";

import { openModal, closeAllModals } from "@mantine/modals";

import SignUp from "./signup";
import axios from "axios";
import Router from "next/router";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
        mode: "onChange",
  });

  console.log(errors, isSubmitting, isValid);

  const onSubmit = async data => {
    const response = await (await axios.post(endpoints.userLogin, {
      ...data
    })).data;
    if (response?.data?.token) {
      Router.reload();
    } else {
      //
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, (errors) => console.log(errors))}>
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

        <TextInput
          label="Phone number"
          {...register("phonenumber", {
            required: true,
          })}
          disabled={isSubmitting}
          error={errors['phonenumber']?true:false}
          placeholder="+237 111 111 111"
          required
        />
        <PasswordInput
          label="Password"
          error={errors['password']?true:false}
          placeholder="Your password"
          required
          mt="md"
          {...register("password", {
            required: true,
          })}
          disabled={isSubmitting}
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
        <Button type="submit" disabled={isSubmitting || !isValid} fullWidth mt="xl">
          Sign in
        </Button>
      </Container>
    </form>
  );
}