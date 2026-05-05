"use client";

import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("");

  const handleShare = async () => {
    if (!navigator.share) {
      setStatus("Este navegador no soporta navigator.share().");
      return;
    }

    try {
      alert(window.location.origin);
      const origin = window.location.origin;
      const videoUrl = `${origin}/video/Wrapped.mp4`;

      const response = await fetch(videoUrl);

      if (!response.ok) {
        throw new Error("No se pudo cargar el video para compartir.");
      }

      const blob = await response.blob();
      const videoFile = new File([blob], "Wrapped.mp4", { type: "video/mp4" });
      const shareData: ShareData = {
        title: "Wrapped video",
        text: "Te comparto este video.",
        files: [videoFile],
      };

      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        setStatus("Video compartido correctamente.");
        return;
      }

      await navigator.share({
        title: "Wrapped video",
        text: "Tu navegador no soporta compartir archivos; te comparto el enlace.",
        url: videoUrl,
      });
      setStatus("Se compartió el enlace del video (sin archivo adjunto).");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `No se completó el share: ${error.message}`
          : "No se completó el share."
      );
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-3xl font-bold">Prueba de navigator.share()</h1>
      <p className="text-zinc-600 dark:text-zinc-300">
        Este botón intenta compartir `Wrapped.mp4` como archivo adjunto con Web
        Share API.
      </p>
      <button
        type="button"
        onClick={handleShare}
        className="rounded-full bg-black px-6 py-3 font-medium text-white transition-opacity hover:opacity-80 dark:bg-white dark:text-black"
      >
        Compartir
      </button>
      {status && (
        <p className="rounded-md bg-zinc-100 px-4 py-2 text-sm dark:bg-zinc-800">
          {status}
        </p>
      )}
    </main>
  );
}
