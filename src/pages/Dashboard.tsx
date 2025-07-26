import {
  Box,
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import { FiCopy, FiExternalLink } from "react-icons/fi";
import { useGetUrl, usePostUrl } from "../../api/client";
import { toaster } from "../components/ui/toaster";

export function Dashboard() {
  const { refetch, data } = useGetUrl();

  const shortenedUrls = data?.data || [];
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, fieldName: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toaster.success({
      title: "Copied!",
      description: `${fieldName} copied to clipboard`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const { mutate: shortenUrl } = usePostUrl({
    mutation: {
      onSuccess: () => {
        toaster.success({
          title: "URL shortened successfully!",
          description: "Your URL has been shortened and saved.",
        });
        setUrlInput("");
        refetch();
      },
      onError: (error: AxiosError<{ error: string }>) => {
        const message = error.response?.data?.error || "Failed to shorten URL";
        toaster.error({
          title: "URL shortening failed",
          description: message,
        });
      },
    },
  });

  const [urlInput, setUrlInput] = useState("");

  const handleShortenUrl = useCallback(() => {
    if (urlInput.trim()) {
      shortenUrl({ data: { longUrl: urlInput.trim() } });
    }
  }, [urlInput, shortenUrl]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrlInput(e.target.value);
    },
    []
  );

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={8} align="stretch">
        <HStack gap={4}>
          <Input
            placeholder="Enter a long URL to shorten..."
            value={urlInput}
            onChange={handleInputChange}
            size="lg"
          />
          <Button
            colorScheme="blue"
            onClick={handleShortenUrl}
            size="lg"
            px={8}
          >
            Shorten
          </Button>
        </HStack>

        <Box>
          <Heading size="md" mb={4}>
            Shortened URLs
          </Heading>
          <VStack gap={3} align="stretch">
            {shortenedUrls.length === 0 ? (
              <Box p={3}>
                <Text color="gray.500" fontStyle="italic">
                  No shortened URLs yet. Shorten your first URL above!
                </Text>
              </Box>
            ) : (
              shortenedUrls.map((url, index) => (
                <Box
                  key={index}
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                  border="1px"
                  borderColor="gray.200"
                >
                  <Grid templateColumns="1fr 2fr" gap={4}>
                    <Card
                      label="Original URL"
                      url={url.longUrl || ""}
                      index={index}
                      fieldType="original"
                      copiedField={copiedField}
                      copyToClipboard={copyToClipboard}
                      fontSize="sm"
                      fontWeight="normal"
                    />
                    <Card
                      label="Shortened URL"
                      url={url.shortUrl || ""}
                      index={index}
                      fieldType="shortened"
                      copiedField={copiedField}
                      copyToClipboard={copyToClipboard}
                      fontSize="md"
                      fontWeight="bold"
                    />
                  </Grid>
                </Box>
              ))
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}

interface CardProps {
  label: string;
  url: string;
  index: number;
  fieldType: "original" | "shortened";
  copiedField: string | null;
  copyToClipboard: (text: string, fieldName: string) => void;
  fontSize?: string;
  fontWeight?: string;
}

function Card({
  label,
  url,
  index,
  fieldType,
  copiedField,
  copyToClipboard,
  fontSize = "sm",
  fontWeight = "normal",
}: CardProps) {
  const fieldName = `${fieldType}-${index}`;
  const isCopied = copiedField === fieldName;

  return (
    <>
      <GridItem>
        <Text fontWeight="medium" color="gray.600">
          {label}:
        </Text>
      </GridItem>
      <GridItem>
        <HStack gap={2}>
          <Text
            fontSize={fontSize}
            fontWeight={fontWeight}
            wordBreak="break-all"
            color="blue.600"
            textDecoration="underline"
            cursor="pointer"
            onClick={() => window.open(url, "_blank")}
            _hover={{ color: "blue.800" }}
            flex={1}
          >
            {url}
          </Text>
          <Icon
            as={FiExternalLink}
            color="blue.500"
            cursor="pointer"
            onClick={() => window.open(url, "_blank")}
            _hover={{ color: "blue.700" }}
          />
          <Icon
            as={FiCopy}
            color={isCopied ? "green.500" : "gray.500"}
            cursor="pointer"
            onClick={() => copyToClipboard(url, fieldName)}
            _hover={{
              color: isCopied ? "green.600" : "gray.600",
            }}
          />
        </HStack>
      </GridItem>
    </>
  );
}
