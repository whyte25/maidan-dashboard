import { env } from "@/env";
import axios from "axios";

const instance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 100000,
});

export default instance;
