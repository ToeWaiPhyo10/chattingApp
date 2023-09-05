import React, { ComponentPropsWithoutRef } from "react";
import Button from "./button";
import { LoadingIndicator } from "stream-chat-react";
interface LoadingButtonProps extends ComponentPropsWithoutRef<"button"> {
  loading: boolean;
}
export default function LoadingButton({
  loading,
  ...props
}: LoadingButtonProps) {
  return (
    <Button {...props} disabled={loading}>
      {loading ? <LoadingIndicator /> : props.children}
    </Button>
  );
}
