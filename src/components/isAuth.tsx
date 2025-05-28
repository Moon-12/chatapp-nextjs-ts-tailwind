"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { getUserSession } from "@/utils/getUserSession";

export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
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
