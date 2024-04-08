"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const rounter=useRouter()
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const Onsave = async () => {
    console.log(user);
    try {
      axios
        .post("/auth/login", user)
        .then((response) => {
          console.log("Response:", response);
          if(response.statusText==="OK"){
            // rounter.push('/chat')
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <>
      <div className=" flex justify-center mt-3">
        <Card className="w-[350px] shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              If You have not an Account{" "}
              <Link href={"/register"}>click hear for</Link>Creating Account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    className="mx-4"
                    placeholder="Enter Your Email"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label>Password</Label>
                  <Input
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    className="mx-4"
                    placeholder="Enter Your Password"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={Onsave} variant={"ghost"}>
              Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
