import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  console.log('Запрос получен');
  try {
    const { prompt, options } = await req.json();
    console.log('Получены данные:', prompt, options);

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
      messages: [{ role: 'user', content: fullPrompt }],
      model: 'gpt-4',
    });

    const code = completion.choices[0]?.message?.content || '';
    console.log('Полученный код:', code);

    return NextResponse.json({ code });
  } catch (err) {
    console.log('Ошибка в блоке try-catch');
    // Логируем ошибку
    if (err instanceof Error) {
      console.error('OpenAI API error:', err.message, err.stack);
    } else {
      console.error('Unknown error:', err);
    }

    return new NextResponse(
      JSON.stringify({ error: 'Ошибка генерации компонента' }),
      { status: 500 }
    );
  }
}
