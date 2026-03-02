export default function Sobre() {
  return (
    <main className="px-6 pt-32 pb-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-4xl tracking-tight text-[#00843d] font-stretch-extra-expanded">
          Essenza
        </h1>
        <p className="mb-8 text-lg text-[#c9a227] italic">
          A essência do cuidado natural
        </p>

        <div className="space-y-5 leading-relaxed text-gray-600">
          <p>
            Do italiano, <em>essenza</em> significa essência — a alma das
            coisas, o que há de mais puro e verdadeiro.
          </p>

          <p>
            Na Essenza, transformamos essa filosofia em velas e criações
            artesanais que acolhem, perfumam e cuidam de você e do seu lar.
            Acreditamos na beleza dos pequenos detalhes da rotina: aquele
            cuidado ao acender uma vela na hora do banho, no momento da
            meditação, no silêncio de um fim de tarde. Por isso, criamos mais do
            que produtos — criamos experiências que despertam memórias e
            convidam a viver com mais presença.
          </p>

          <p>
            Cada frasco, cada textura, cada aroma carrega uma história feita de
            escolhas conscientes, estética natural e respeito ao tempo das
            coisas. Tudo é feito à mão, com ingredientes orgânicos que respeitam
            sua pele e o planeta, e com materiais biodegradáveis e embalagens
            conscientes — porque a verdadeira essência também é sustentável.
          </p>

          <p>
            Aqui, o simples é celebrado e o essencial é suficiente. Ao escolher
            a Essenza, você não escolhe apenas um produto: você escolhe um
            estilo de vida mais lento, mais puro, mais essencial. Um convite ao
            cuidado — da casa, das roupas, da alma.
          </p>

          <p className="border-l-2 border-[#00843d] pl-4 text-gray-500 italic">
            Seja bem-vinda ao nosso mundo, onde a rotina vira ritual e o dia a
            dia se enche de propósito.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {[
            'Feito à mão',
            'Ingredientes orgânicos',
            'Embalagens conscientes',
            'Sustentável',
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#00843d]/30 px-3 py-1 text-xs text-[#00843d]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}
