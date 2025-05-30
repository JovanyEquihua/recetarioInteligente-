import ListaCompras from "@/app/components/ListaCompras/ListaCompras";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";
export default async function () {
  const session = await getServerSession(authOptions);
  const usuarioId = session?.user?.id;
  return (
    <div className="min-h-screen ">
      <ListaCompras usuarioId={usuarioId} />
    </div>
  );
}
