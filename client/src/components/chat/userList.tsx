"use client";


// import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Mail } from "@/data/email";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
// import { useMail } from "@/components/chat/use-chat"

interface MailListProps {
  items: Mail[];
}

export function UserList({ items }: MailListProps) {
  //   const [mail, setMail] = useState([])

  return (
    <ScrollArea className="h-screen  ">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (

            <>
            
          <Link
          href={`/message/${item.id}`}
           key={item.id}>
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage alt={item.name} />
                    <AvatarFallback>
                      {item.name
                        .split(" ")
                        .map((chunk) => chunk[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="font-semibold">{item.name}</div>
                  {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
              </div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.text.substring(0, 30)}....
            </div>
          </Link>
          <Separator className="my-1" />
          </>
        ))}
      </div>
    </ScrollArea>
  );
}
