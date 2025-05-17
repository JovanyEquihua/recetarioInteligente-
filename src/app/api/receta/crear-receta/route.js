import { NextResponse } from 'next/server';
import { cloudinary } from '@/libs/cloudinary';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const imagen = formData.get('imagen'); // Archivo de imagen

    if (!imagen) {
      return NextResponse.json({ error: 'No se subió ninguna imagen' }, { status: 400 });
    }

    // Convierte el archivo en un buffer
    const arrayBuffer = await imagen.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir la imagen a Cloudinary usando una Promesa
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'chefpick' }, // Carpeta en Cloudinary
        (error, result) => {
          if (error) {
            reject(error); // Rechaza la promesa si hay un error
          } else {
            resolve(result); // Resuelve la promesa con el resultado
          }
        }
      );

      // Escribe el buffer en el stream
      uploadStream.end(buffer);
    });

    // Devuelve la URL de la imagen subida
    return NextResponse.json({ mensaje: 'Imagen subida con éxito', url: uploadResult.secure_url });
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    return NextResponse.json({ error: 'Error al subir la imagen' }, { status: 500 });
  }
}