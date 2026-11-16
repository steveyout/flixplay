"use client";

import React from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function NavigationLoader() {
  return (
    <ProgressBar
      height="3px"
      color="var(--gradient-color, #da2f68)"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
