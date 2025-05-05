export default function DetallesSection({ receta }) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-[#8B1C62] mb-3">
          Detalles
        </h2>
        <div className="space-y-1 text-gray-700">
          <p><strong>Dificultad:</strong> {receta.dificultad}</p>
          <p><strong>Tiempo total:</strong> {receta.tiempoPreparacion} min</p>
          <p><strong>Porciones:</strong> {receta.porciones}</p>
          <p><strong>Tipo de comida:</strong> {receta.tipoComida?.nombre}</p>
        </div>
      </div>
    );
  }