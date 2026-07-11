import { useState } from "react";
import { AlertCircle, User, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useAdminAuth } from "./AdminAuthContext";

export default function AdminLogin() {
  const { loginError, isLoggingIn, handleLoginSubmit } = useAdminAuth();
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    handleLoginSubmit(e, usernameInput, passwordInput);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      <Card className="relative w-full max-w-md border-muted bg-card/60 backdrop-blur-md shadow-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your administration credentials to access dashboard.
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {loginError && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Username
              </label>
              <div className="relative">
                <User className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full cursor-pointer bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:shadow-lift transition-all duration-300"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
