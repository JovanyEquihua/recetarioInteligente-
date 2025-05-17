export default function HeaderReceta({ receta }) {
    return (
      <>
        <h1 className="text-4xl font-bold text-center mb-6 text-[#8B1C62]">
          {receta.titulo}
        </h1>
        <p className="text-center text-sm text-gray-600 mt-2">
          Publicada por{" "}
          <span className="font-medium text-[#8B1C62]">
            {receta.usuario?.nombre || "Autor desconocido"}
          </span>{" "}
          | Fecha:{" "}
          {new Date(receta.fechaCreacion).toLocaleDateString("es-MX", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <img
          src={receta.imagen || "/placeholder-food.jpg"}
          alt={receta.titulo}
          className="w-full h-72 object-cover rounded-2xl shadow-lg mb-8"
        />
      </>
    );
  }