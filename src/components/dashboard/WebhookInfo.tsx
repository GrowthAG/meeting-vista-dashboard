
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Info } from "lucide-react";
import { toast } from "sonner";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const WebhookInfo = () => {
  // URL da função Edge do Supabase para o webhook (será atualizada automaticamente)
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-id.supabase.co';
  const webhookUrl = `${supabaseUrl}/functions/v1/webhook-meetings`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl)
      .then(() => toast.success("URL copiada para a área de transferência!"))
      .catch(err => toast.error("Não foi possível copiar: " + err));
  };

  // Exemplo de JSON para enviar ao webhook
  const jsonExample = `{
  "organizador": "joao.silva@empresa.com.br",
  "convidados": ["maria.santos@empresa.com.br", "carlos.oliveira@empresa.com.br"],
  "data_reuniao": "2025-05-22",
  "horario_reuniao": "15:30",
  "link_gravacao": "https://meeting-recordings.com/abc123",
  "transcricao": "João: Bom dia pessoal, vamos discutir o novo projeto...",
  "resumo": "Reunião para planejamento inicial do projeto XYZ com definição de responsabilidades e próximos passos."
}`;

  // Comando curl para teste
  const curlCommand = `curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ANON_KEY" \\
  -d '${jsonExample}'`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuração do Webhook</CardTitle>
        <CardDescription>
          Envie dados de reuniões para esta URL da função Edge do Supabase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="instructions">
            <AccordionTrigger>
              <div className="flex items-center">
                <Info className="h-4 w-4 mr-2" />
                Como usar este webhook
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Envie solicitações POST para este endpoint da função Edge do Supabase no formato JSON:
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-xs overflow-auto">{jsonExample}</pre>
                </div>
                <p className="text-sm text-muted-foreground">
                  Exemplo de comando curl para testar (substitua YOUR_ANON_KEY pela sua chave anônima do Supabase):
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <pre className="text-xs overflow-auto">{curlCommand}</pre>
                </div>
                <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                  <p className="text-sm text-green-800">
                    <strong>Status:</strong> Estrutura backend criada! ✅
                  </p>
                  <ul className="text-sm text-green-800 mt-2 list-disc list-inside space-y-1">
                    <li>Função Edge "webhook-meetings" criada</li>
                    <li>Tabela "meetings" configurada</li>
                    <li>Políticas RLS implementadas</li>
                    <li>Webhook funcional e pronto para receber dados</li>
                  </ul>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default WebhookInfo;
