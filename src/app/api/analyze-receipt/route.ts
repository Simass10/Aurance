import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Imagem não fornecida' },
        { status: 400 }
      );
    }

    // Análise da imagem com OpenAI Vision
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analisa este comprovativo/recibo e extrai as seguintes informações em formato JSON:
              - amount: valor total (apenas número, sem símbolos)
              - description: descrição breve do que foi comprado/pago
              - merchant: nome do estabelecimento/vendedor (se visível)
              - date: data da transação no formato YYYY-MM-DD (se visível)
              - category: categoria sugerida (escolhe entre: salary, sales, services, investment, rent, utilities, food, transport, vehicle, supplies, marketing, other)
              
              Responde APENAS com o JSON, sem texto adicional.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json(
        { error: 'Não foi possível analisar a imagem' },
        { status: 500 }
      );
    }

    // Parse do JSON retornado
    const analysis = JSON.parse(content);

    return NextResponse.json({
      success: true,
      data: {
        amount: parseFloat(analysis.amount) || 0,
        description: analysis.description || 'Transação',
        merchant: analysis.merchant || '',
        date: analysis.date || new Date().toISOString().split('T')[0],
        category: analysis.category || 'other',
      },
    });
  } catch (error) {
    console.error('Erro ao analisar comprovativo:', error);
    return NextResponse.json(
      { error: 'Erro ao processar a imagem' },
      { status: 500 }
    );
  }
}
