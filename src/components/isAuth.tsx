"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { getUserSession } from "@/utils/getUserSession";
import { ComponentType } from "react";

export default function isAuth<T extends object>(Component: ComponentType<T>) {
  return function IsAuth(props: T) {
    const userSession = getUserSession();

    useEffect(() => {
      if (!userSession?.session) {
        return redirect("/");
      }
    }, [userSession]);

    if (!userSession?.session) {
      return null;
    }

    return <Component {...props} />;
  };
}
