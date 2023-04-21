import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ProSidebarProvider } from "react-pro-sidebar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!window.localStorage.getItem("loginToken")){
       if(window.location.pathname !== '/register/' && window.location.pathname !== '/forgotpassword/' && window.location.pathname !== '/resetpassword/') {
        // If token doesn't exist, redirect user to login page
        router.push("/login/");
       }
      } else {
        router.push(window.location.pathname);
      }
    }
  }, []);

  return (
    <GoogleOAuthProvider
      clientId={`${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}`}
    >
      <ProSidebarProvider>
        <Component {...pageProps} />
      </ProSidebarProvider>
    </GoogleOAuthProvider>
  );
}
