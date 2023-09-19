import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { onMessageListener } from "./firebase";
import Link from "next/link";

const Notification = () => {
  const [notification, setNotification] = useState({ title: "", body: "" });
  const notify = () => toast(<ToastDisplay />);
  function ToastDisplay() {
    return (
      <Link href={"/user/chat/"}>
        <div>
          <p>
            <b>{notification?.title}</b>
          </p>
          <p>{notification?.body}</p>
        </div>
      </Link>
    );
  }
  useEffect(() => {
    if (notification?.title) {
      notify();
    }
  }, [notification]);

  onMessageListener()
    .then((payload) => {
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });
    })
    .catch((err) => console.log("failed: ", err));

  return <Toaster />;
};

export default Notification;
