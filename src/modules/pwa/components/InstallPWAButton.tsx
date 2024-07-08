import { Button } from "antd";
import React, { useState, useEffect } from "react";

const InstallPWAButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevenir que el navegador muestre el prompt por defecto
      e.preventDefault();
      // Guardar el evento para poder usarlo más tarde
      setDeferredPrompt(e);
      // Mostrar el botón de instalación
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt && (deferredPrompt as any).prompt) {
      // Esconder el botón de instalación
      setIsVisible(false);
      // Mostrar el prompt de instalación
      (deferredPrompt as any).prompt();
      // Esperar la respuesta del usuario
      const choiceResult = await (deferredPrompt as any).userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("El usuario aceptó instalar la PWA");
      } else {
        console.log("El usuario rechazó instalar la PWA");
      }
      // Limpiar deferredPrompt para que solo se pueda usar una vez
      setDeferredPrompt(null);
    }
  };

  return (
    <div>
      {isVisible && (
        <Button type='text' onClick={handleInstallClick}>
          <span className='text-xs'>Instalar App en tu teléfono</span>
        </Button>
      )}
    </div>
  );
};

export default InstallPWAButton;
