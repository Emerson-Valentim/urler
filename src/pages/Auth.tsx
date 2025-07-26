import { Box, Button, Input, VStack, Tabs } from "@chakra-ui/react";
import { usePostAccount, usePostSignin } from "../../api/client";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toaster } from "../components/ui/toaster";
import { AxiosError } from "axios";

const TABS = ["signin", "signup"] as const;

export function Auth() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<(typeof TABS)[number]>("signin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: createAccount } = usePostAccount({
    mutation: {
      onSuccess: () => {
        toaster.success({
          title: "Account created successfully!",
          description: "Sign in to continue.",
        });

        setTab("signin");
        setUsername("");
        setPassword("");
      },
      onError: (error: AxiosError<{ error: string }>) => {
        const message = error.response?.data?.error || "Failed to create account";
        toaster.error({
          title: "Sign up failed",
          description: message,
        });
      },
    },
  });

  const handleCreateAccount = () => {
    createAccount({ data: { username, password } });
  };

  const { mutate: signin } = usePostSignin({
    mutation: {
      onSuccess: () => {
        navigate("/dashboard");
      },
      onError: (error: AxiosError<{ error: string }>) => {
        const message = error.response?.data?.error || "Failed to sign in";
        toaster.error({
          title: "Sign in failed",
          description: message,
        });
      },
    },
  });

  const handleSignin = () => {
    signin({ data: { username, password } });
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Box
        maxW="md"
        w="full"
        borderRadius="xl"
        boxShadow="lg"
        bg="gray.500"
        p={8}
        color="white"
      >
        <Tabs.Root
          value={tab}
          onValueChange={(value) =>
            setTab(value.value as (typeof TABS)[number])
          }
          variant="enclosed"
          w="full"
        >
          <Tabs.List mb={6} w="full">
            <Tabs.Trigger value={TABS[0]} w="full">
              Sign In
            </Tabs.Trigger>
            <Tabs.Trigger value={TABS[1]} w="full">
              Sign Up
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value={TABS[0]}>
            <VStack gap={4}>
              <Input
                placeholder="username"
                size="lg"
                borderRadius="md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                size="lg"
                borderRadius="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button size="lg" w="full" onClick={handleSignin}>
                Submit
              </Button>
            </VStack>
          </Tabs.Content>

          <Tabs.Content value={TABS[1]}>
            <VStack gap={4}>
              <Input
                placeholder="username"
                size="lg"
                borderRadius="md"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="password"
                type="password"
                size="lg"
                borderRadius="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button size="lg" w="full" onClick={handleCreateAccount}>
                Submit
              </Button>
            </VStack>
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Box>
  );
}
