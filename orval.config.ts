import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "http://localhost:3000/openapi",
    },
    output: {
      client: "react-query",
      target: "api/client.ts",
      override: {
        mutator: {
          path: "./api/axios.ts",
          name: "axiosMutator",
        },
      },
    },
  },
});
