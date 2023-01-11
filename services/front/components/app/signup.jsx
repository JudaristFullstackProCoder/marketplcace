import {
  TextInput,
  PasswordInput,
  Anchor,
  Title,
  Text,
  Container,
  Button,
} from "@mantine/core";

import endpoints from "../../config/api";
import axios from "axios";
import { useForm } from "react-hook-form";
import Router from "next/router";
import { openModal, closeAllModals } from "@mantine/modals";
import Login from "./login";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
  });
  const onSubmit = async (data) => {
    const response = await (
      await axios.post(endpoints.userSignUp, {
        ...data,
      })
    ).data;
    if (response?.data?.token) {
      Router.reload();
    } else {
      //
    }
  };
  console.log(errors, isValid, isSubmitting);
  return (
    <form onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}>
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

        <TextInput
          label="Phone number"
          disabled={isSubmitting}
          placeholder="111 111 111"
          {...register("phonenumber", {
            required: true,
          })}
          error={errors['phonenumber']?true:false}
          required
        />
        <TextInput
          label="name"
          {...register("name", {
            required: true,
          })}
          placeholder="John Doe"
          required
          disabled={isSubmitting}
          error={errors['name']?true:false}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          disabled={isSubmitting}
          error={errors['password']?true:false}
          {...register("password", {
            required: true,
          })}
          mt="md"
        />
        <Button disabled={!isValid} loading={isSubmitting} type={"submit"} fullWidth mt="xl">
          Sign up
        </Button>
      </Container>
    </form>
  );
}
