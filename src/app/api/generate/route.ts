import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const { prompt, options } = await req.json();

  const techStack = [
    options.typescript ? 'TypeScript' : 'JavaScript',
    options.tailwind ? 'TailwindCSS' : 'SCSS',
  ];

  if (options.storybook) techStack.push('Storybook');
  if (options.tests) techStack.push('unit-тесты');

  const fullPrompt = `
Ты пишешь React-компоненты. Используй стек: ${techStack.join(', ')}.
Сгенерируй код компонента по описанию: "${prompt}".
${options.tests ? 'Добавь unit-тесты (Vitest).' : ''}
${options.storybook ? 'Добавь Storybook story.' : ''}
Верни только код. Без объяснений.
  `;

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: fullPrompt,
      },
    ],
    model: 'gpt-4',
  });

  const code = completion.choices[0]?.message?.content || '';
  return NextResponse.json({ code });
}
