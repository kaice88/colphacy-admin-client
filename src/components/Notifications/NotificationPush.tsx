import { useEffect, useRef, useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Flex, Image, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { convertDateTime } from "../../utils/helper";
import { Anchor } from "@mantine/core";
import { useNotification } from "../../hooks/useNotification";
import { useMutation } from "@tanstack/react-query";
import axios from "../../settings/axios";
import { HANDLE_READ_NOTIFICATION } from "../../constants/apis";

const NotificationPush: React.FC = () => {
  const token = localStorage.getItem("accessToken");
  const hasMounted = useRef(false);
  const [reload, setReload] = useState(false);
  const { refetch, refetchRead } = useNotification({ offset: 0, limit: 5 });
  const handleSuccessRead = () => {
    setReload((prev) => !prev);
  };
  const handleReadNoti = useMutation({
    mutationKey: ["a-noti"],
    mutationFn: (id: number) => {
      return axios.put(HANDLE_READ_NOTIFICATION(id));
    },
    onSuccess: handleSuccessRead,
  });
  const onHandlReadNoti = (id: number) => {
    handleReadNoti.mutate(id);
  };

  useEffect(() => {
    refetch();
    refetchRead();
  }, [reload]);

  useEffect(() => {
    if (!hasMounted.current) {
      async function fetchNotification() {
        const ctrl = new AbortController();

        try {
          await fetchEventSource(
            "https://colphacy.tech/api/notifications/admin",
            {
              method: "GET",
              headers: {
                Accept: "text/event-stream",
                Authorization: `Bearer ${token}`,
              },
              signal: ctrl.signal,
              openWhenHidden: true,
              onopen: async (res) => {
                const contentType = res.headers.get("content-type");

                if (
                  !!contentType &&
                  contentType.indexOf("application/json") >= 0
                ) {
                  throw await res.json();
                }
              },
              onerror: (e) => {
                if (!!e) {
                  console.log("Fetch onerror", e);
                }
                throw e;
              },
              onmessage: async (ev) => {
                const data = ev.data;
                if (!data) {
                  return;
                }
                try {
                  const result = JSON.parse(data);
                  notifications.show({
                    title: result?.title,
                    message: (
                      <>
                        <Anchor
                          onClick={() => {
                            onHandlReadNoti(result?.id);
                          }}
                          href={result?.url}
                          underline={false}
                        >
                          <Flex py={5} gap="xs" align="center" direction="row">
                            <Image width={50} height={50} src={result?.image} />
                            <Flex
                              gap={8}
                              justify="center"
                              align="flex-start"
                              direction="column"
                              wrap="wrap"
                            >
                              <Text style={{ color: "#000" }}>
                                {result?.description}
                              </Text>
                              <Text style={{ color: "#00439C" }}>
                                {convertDateTime(result?.createdTime)}
                              </Text>
                            </Flex>
                          </Flex>
                        </Anchor>
                      </>
                    ),
                    autoClose: 5000,
                  });
                  handleSuccessRead();
                } catch (e) {
                  console.log("Fetch onmessage error", e);
                }
              },
            }
          );
        } catch (e) {
          console.log("Error", e);
        }
      }
      fetchNotification();
      hasMounted.current = true;
    }
  }, []);
  return null;
};

export default NotificationPush;
