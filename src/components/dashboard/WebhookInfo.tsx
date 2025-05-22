
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const WebhookInfo = () => {
  // URL para o webhook - substitua pela URL real do seu aplicativo
  const webhookUrl = `${window.location.origin}/api/meetings/webhook`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl)
      .then(() => toast.success("URL copiada para a área de transferência!"))
      .catch(err => toast.error("Não foi possível copiar: " + err));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração do Webhook</CardTitle>
        <CardDescription>
          Configure seu serviço para enviar dados para esta URL
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input 
            value={webhookUrl}
            readOnly
            className="font-mono text-sm"
          />
          <Button variant="outline" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Esta é a URL para configurar seu webhook. Envie as solicitações POST para este endpoint no formato JSON.
        </p>
      </CardContent>
    </Card>
  );
};

export default WebhookInfo;
