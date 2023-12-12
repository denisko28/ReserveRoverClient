import { FC, useEffect, useState } from "react"
import styles from "./ChatsPage.module.scss";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { serverUrl } from "../../services/axios-config";
import { auth } from "../../services/firebase-config";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Avatar, ChatContainer, Conversation, ConversationHeader, ConversationList, MainContainer, Message, MessageInput, MessageList, Sidebar } from "@chatscope/chat-ui-kit-react";
import useAuth from "../../hooks/useAuth";

type Mess = {
    message: string;
    senderId: string
};

const ChatsPage: FC = function () {
    const { currentUser } = useAuth();
    const [connection, setConnection] = useState<HubConnection>();
    const [unreadCnt, setUnreadCnt] = useState<number>(0);
    const [messages, setMessages] = useState<Mess[]>([
        {
            message: "Привіт, друже!",
            senderId: "GQ6qNAoxa4e0RDvaFEnIQbuzbpm1"
        },
        {
            message: "Правда класний чат?",
            senderId: "GQ6qNAoxa4e0RDvaFEnIQbuzbpm1"
        },
        {
            message: "Привіт, таак, топ!",
            senderId: "L31xc7GbqoVTjPFlyyWjDFqhc6u1"
        }
    ]);

    useEffect(() => {
        const startHubConnection = async () => {
            const connection = new HubConnectionBuilder()
                .withUrl(serverUrl + "/chatHub", {
                    accessTokenFactory: async () =>
                        `${await auth.currentUser?.getIdToken()}`
                })
                .configureLogging(LogLevel.Information)
                .build();

            connection.on("ReceiveMessage", (obj: any) => {
                setMessages(messages => [...messages, obj]);
                setUnreadCnt(unreadCnt => unreadCnt + 1)
            });
            await connection.start();
            setConnection(connection);
        }

        startHubConnection().catch(console.error);
    }, [])

    const sendMessage = async (message: string) => {
        setMessages([...messages, {message, senderId: currentUser?.uid ?? ""}]);
        setUnreadCnt(0);
        connection?.invoke("SendMessage", { toUserId: currentUser?.uid == "GQ6qNAoxa4e0RDvaFEnIQbuzbpm1" ? "L31xc7GbqoVTjPFlyyWjDFqhc6u1" : "GQ6qNAoxa4e0RDvaFEnIQbuzbpm1", message })
        .catch(console.error);
    }    

    return (
        <div className={`w-full bg-white ${styles["friends-page"]}`}>
         
            <h3 className="text-3xl font-bold mb-4">
                Повідомлення
            </h3>
            <MainContainer className="w-full " style={{height: "650px", borderWidth: 0, borderBottomWidth: 1}}>
                <Sidebar position="left">
                    <ConversationList>
                        {
                            currentUser?.uid === "GQ6qNAoxa4e0RDvaFEnIQbuzbpm1" ?
                            <>
                                <Conversation name="Микита Явтушенко" unreadCnt={unreadCnt} info="В мережі" active onClick={() => {}}>
                                    <Avatar src="https://firebasestorage.googleapis.com/v0/b/reserverover-107c6.appspot.com/o/L31xc7GbqoVTjPFlyyWjDFqhc6u1.png?alt=media&token=278ea4f8-41b4-4378-9625-2a7dc3b2a880"/>
                                </Conversation>
                                <Conversation name="Дмитро Федоренко" info="Та що там говорити">
                                    <Avatar src="https://firebasestorage.googleapis.com/v0/b/reserverover-107c6.appspot.com/o/En6jfcgABnQqw5wNBIpHLvMlB102.png?alt=media&token=f5ab50c0-cef1-4a20-bae2-e949259a690c"/>
                                </Conversation>
                            </>
                            : <>
                                <Conversation name="Харітеску Денис" unreadCnt={unreadCnt} info="В мережі" active onClick={() => {}}>
                                    <Avatar src="https://firebasestorage.googleapis.com/v0/b/reserverover-107c6.appspot.com/o/GQ6qNAoxa4e0RDvaFEnIQbuzbpm1.png?alt=media&token=9d5a07f0-2c3f-4e1c-9289-1f4c9370c8f9"/>
                                </Conversation>
                            </>
                        }
                    </ConversationList>
                </Sidebar>
                <ChatContainer>
                        {
                            currentUser?.uid === "GQ6qNAoxa4e0RDvaFEnIQbuzbpm1" ?
                            <ConversationHeader>
                                <Avatar src="https://firebasestorage.googleapis.com/v0/b/reserverover-107c6.appspot.com/o/L31xc7GbqoVTjPFlyyWjDFqhc6u1.png?alt=media&token=278ea4f8-41b4-4378-9625-2a7dc3b2a880"/>
                                <ConversationHeader.Content userName="Микита Явтушенко"/>
                            </ConversationHeader>
                            : <ConversationHeader>
                                <Avatar src="https://firebasestorage.googleapis.com/v0/b/reserverover-107c6.appspot.com/o/GQ6qNAoxa4e0RDvaFEnIQbuzbpm1.png?alt=media&token=9d5a07f0-2c3f-4e1c-9289-1f4c9370c8f9"/>
                                <ConversationHeader.Content userName="Денис Харітеску"/>
                            </ConversationHeader>
                        }
                    <MessageList>
                        {
                            messages.map(mess => <Message key={mess.message}
                                model={{
                                    message: mess.message,
                                    direction: mess.senderId === currentUser?.uid ? 1 : 0,
                                    position: "single"
                                }}
                            />)
                        }
                    </MessageList>
                    <MessageInput placeholder="Type message here" onSend={message => sendMessage(message)}/>
                </ChatContainer>
            </MainContainer>
        </div>
    )
}

export default ChatsPage;