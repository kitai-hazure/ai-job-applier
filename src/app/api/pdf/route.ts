import { NextRequest, NextResponse } from 'next/server';
import latex from 'node-latex';
import { Readable } from 'stream';

export const POST = async (req: NextRequest) => {
  try {
    const { latexString } = await req.json();

    if (!latexString) {
      return NextResponse.json({ message: 'Missing LaTeX string' }, { status: 400 });
    }

    const input = Readable.from([latexString]);
    const pdf = latex(input);

    let chunks: Buffer[] = [];
    return new Promise<NextResponse>((resolve, reject) => {
      pdf.on('data', (chunk) => chunks.push(chunk));
      pdf.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        const response = new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
          },
        });
        resolve(response);
      });
      pdf.on('error', (err) => {
        console.error(err);
        reject(new NextResponse(JSON.stringify({ message: 'Error generating PDF' }), { status: 500 }));
      });
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error processing LaTeX string' }, { status: 500 });
  }
};