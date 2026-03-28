import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../LanguageContext";
import { chatbotReply } from "../analysisEngine";
import { useActor } from "../hooks/useActor";

interface Message {
  role: "user" | "bot";
  content: string;
  id: number;
}

let messageIdCounter = 0;

function makeId() {
  messageIdCounter += 1;
  return messageIdCounter;
}

export function Chatbot() {
  const { lang, t } = useLanguage();
  const { actor } = useActor();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Hello! I'm your AI Health Assistant. How are you feeling today? Tell me about any fatigue, nail changes, eye issues, or dietary concerns.",
      id: makeId(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const msgCount = messages.length;
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message count change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgCount]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: Message = { role: "user", content: text, id: makeId() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    if (actor) {
      actor
        .addChatMessage({
          content: text,
          role: "user",
          language: lang,
          timestamp: BigInt(Date.now()),
        })
        .catch(() => {});
    }

    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 500));
    const reply = chatbotReply(text, lang);
    const botMsg: Message = { role: "bot", content: reply, id: makeId() };
    setIsTyping(false);
    setMessages((prev) => [...prev, botMsg]);

    if (actor) {
      actor
        .addChatMessage({
          content: reply,
          role: "assistant",
          language: lang,
          timestamp: BigInt(Date.now()),
        })
        .catch(() => {});
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex-1 overflow-y-auto space-y-3 pb-4 pr-1 scrollbar-hide">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "rounded-bl-sm text-foreground"
                }`}
                style={
                  msg.role === "bot"
                    ? {
                        background: "oklch(22 0.03 220)",
                        border: "1px solid oklch(28 0.025 220)",
                      }
                    : {}
                }
              >
                {msg.role === "bot" && <span className="mr-1">🤖</span>}
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <div className="flex justify-start">
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-sm"
              style={{
                background: "oklch(22 0.03 220)",
                border: "1px solid oklch(28 0.025 220)",
              }}
            >
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 pt-3 border-t border-border">
        <Input
          data-ocid="chatbot.message.input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={t("typeMessage")}
          className="flex-1 bg-white/5 border-border"
        />
        <Button
          data-ocid="chatbot.send.button"
          onClick={sendMessage}
          disabled={!input.trim()}
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
