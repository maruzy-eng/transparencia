import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  title?: string;
  message: string;
  retryHref?: string;
}

export function ErrorState({
  title = "Não foi possível carregar os dados",
  message,
  retryHref = "/transparency",
}: ErrorStateProps) {
  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="max-w-md text-sm text-muted-foreground">{message}</p>
        </div>
        <Button asChild variant="outline">
          <a href={retryHref}>Tentar novamente</a>
        </Button>
      </CardContent>
    </Card>
  );
}
