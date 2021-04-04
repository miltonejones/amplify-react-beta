import { useEffect } from "react";
import { APP_NAME } from "../Constants";

export default function TitleBar() {
  useEffect(() => document.title = APP_NAME);
  return ''
}