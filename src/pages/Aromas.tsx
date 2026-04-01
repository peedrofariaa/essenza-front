import { aromas } from '../utils/aromasData'

export default function AromasPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12 pt-32">
      <h1 className="mb-2 text-3xl font-semibold">Nossos Aromas</h1>
      <p className="text-muted-foreground mb-10">
        Conheça cada aroma, suas propriedades e os produtos em que estão
        presentes.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {aromas.map((aroma) => (
          <div key={aroma.slug} className="space-y-3 rounded-2xl border p-6">
            <h2 className="text-xl font-medium">{aroma.nome}</h2>
            <p className="text-muted-foreground text-sm">{aroma.descricao}</p>
            <div className="flex flex-wrap gap-2">
              {aroma.propriedades.map((p) => (
                <span
                  key={p}
                  className="bg-secondary rounded-full px-2 py-1 text-xs"
                >
                  {p}
                </span>
              ))}
            </div>
            <div>
              <p className="mt-2 mb-1 text-xs font-medium">
                Produtos com esse aroma:
              </p>
              <ul className="text-muted-foreground list-inside list-disc text-xs">
                {aroma.produtos.map((prod) => (
                  <li key={prod}>{prod}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
