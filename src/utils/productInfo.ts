export const CANDLE_CARE = {
  title: 'Orientações para uso da vela',
  tips: [
    'Sempre acenda a vela em uma superfície plana, estável, longe de materiais inflamáveis e fora de alcance de crianças e animais de estimação.',
    'Na primeira queima, deixe a vela acesa até que toda a superfície esteja completamente líquida — isso evita a formação de buracos e garante queima uniforme até o fim.',
    'Não queime por mais de 4 horas seguidas.',
    'Apare o pavio para cerca de 5mm antes de cada uso. Isso mantém a chama estável, sem fumaça escura e com melhor aproveitamento da vela.',
  ],
}

export const MASSAGE_CANDLE_INFO = {
  title: 'Modo de usar',
  tips: [
    'Acenda o pavio e espere formar uma pocinha de cera derretida.',
    'Apague a chama e em seguida pode derramar sobre a pele.',
    'Ela estará em uma temperatura agradável, pois a combustão da cera utilizada na composição é baixa — isso facilita o deslizar dos dedos durante a massagem, produzindo um relaxamento consistente.',
  ],
}

export function shouldShowCandleCare(category: string, name: string): boolean {
  return category === 'VELAS' && !name.toLowerCase().includes('massagem')
}

export function shouldShowMassageCandleInfo(
  category: string,
  name: string,
): boolean {
  return category === 'VELAS' && name.toLowerCase().includes('massagem')
}
