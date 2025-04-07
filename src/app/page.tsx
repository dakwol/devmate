'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const [useTailwind, setUseTailwind] = useState(true);
  const [useTypeScript, setUseTypeScript] = useState(true);
  const [includeTests, setIncludeTests] = useState(false);
  const [includeStorybook, setIncludeStorybook] = useState(false);

  const generateCode = async () => {
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        prompt,
        options: {
          tailwind: useTailwind,
          typescript: useTypeScript,
          tests: includeTests,
          storybook: includeStorybook,
        },
      }),
    });
    const data = await res.json();
    setCode(data.code);
    setLoading(false);
  };

  return (
    <main className="max-w-3xl mx-auto mt-12 space-y-6 p-4">
      <Textarea
        placeholder="Опиши компонент, который хочешь..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={5}
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="tailwind"
            checked={useTailwind}
            onCheckedChange={(v) => setUseTailwind(Boolean(v))}
          />
          <Label htmlFor="tailwind">TailwindCSS</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="typescript"
            checked={useTypeScript}
            onCheckedChange={(v) => setUseTypeScript(Boolean(v))}
          />
          <Label htmlFor="typescript">TypeScript</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="tests"
            checked={includeTests}
            onCheckedChange={(v) => setIncludeTests(Boolean(v))}
          />
          <Label htmlFor="tests">Unit-тесты</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="storybook"
            checked={includeStorybook}
            onCheckedChange={(v) => setIncludeStorybook(Boolean(v))}
          />
          <Label htmlFor="storybook">Storybook</Label>
        </div>
      </div>

      <Button onClick={generateCode} disabled={loading}>
        {loading ? 'Генерирую...' : 'Сгенерировать'}
      </Button>

      {code && (
        <Card>
          <CardContent className="relative p-4">
            <pre className="whitespace-pre-wrap text-sm">{code}</pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => navigator.clipboard.writeText(code)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
