export default function IngredientesSection({ ingredientes }) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-[#8B1C62] mb-3">
          Ingredientes
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-800">
          {ingredientes.map((ing, index) => (
            <li key={index}>
              {ing.cantidad} - {ing.ingrediente?.nombre || "Ingrediente desconocido"}
            </li>
          ))}
        </ul>
      </div>
    );
  }