function Ubicacion() {
  const sucursales = [
    {
      nombre: "Reforma / Antigua Aeropuerto",
      direccion: "Av. Fuerza Aérea Mexicana 900, esquina con calle Azucenas",
    },
    {
      nombre: "Plaza Monte Albán",
      direccion: "Carretera a Monte Albán 600, Montoya — Área de comida",
    },
    {
      nombre: "Macroplaza",
      direccion: "Zona comercial del norte, Oaxaca de Juárez",
    },
    {
      nombre: "Centro",
      direccion: "Calle Luis Jiménez Figueroa, 68070 Oaxaca de Juárez",
    },
  ];

  return (
    <section
      className="py-32 px-16"
      style={{ borderTop: "1px solid rgba(212, 175, 106, 0.1)" }}
    >
      {/* Separador */}
      <div className="mb-16">
        <div className="flex items-center gap-6 mb-4">
          <div
            className="h-px flex-grow"
            style={{ background: "rgba(212, 175, 106, 0.15)" }}
          />
          <span
            className="font-['JetBrains_Mono'] text-[11px] uppercase tracking-[0.4em]"
            style={{
              color: "#D4AF6A",
              border: "1px solid rgba(212, 175, 106, 0.4)",
              padding: "6px 20px",
              textShadow:
                "0 0 12px rgba(212,175,106,0.6), 0 0 24px rgba(212,175,106,0.3)",
            }}
          >
            Encuéntranos
          </span>
          <div
            className="h-px flex-grow"
            style={{ background: "rgba(212, 175, 106, 0.15)" }}
          />
        </div>
        <div className="flex items-stretch gap-5">
          <div className="w-[3px] bg-[#9B2335] rounded-sm flex-shrink-0" />
          <div className="flex flex-col gap-2">
            <p className="font-['EB_Garamond'] text-[40px] text-[#F2EDE4] font-normal m-0 cursor-default transition-all duration-300 hover:text-[#D4AF6A] hover:tracking-wide">
              Visitanos
            </p>
            <span className="font-['DM_Sans'] text-[13px] text-[#F2EDE4]/40">
              en cualquiera de nuestras 4 ubicaciones en Oaxaca
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-24 max-w-5xl mx-auto">
        {/* Sucursales y horarios */}
        <div className="flex flex-col gap-12">
          {/* 4 sucursales */}
          <div>
            <p className="font-['JetBrains_Mono'] text-[10px] text-[#D4AF6A]/40 uppercase tracking-[0.3em] mb-6">
              Nuestras Sucursales
            </p>
            <div className="flex flex-col gap-6">
              {sucursales.map((s) => (
                <div
                  key={s.nombre}
                  className="pb-6"
                  style={{
                    borderBottom: "1px solid rgba(212, 175, 106, 0.08)",
                  }}
                >
                  <p className="font-['EB_Garamond'] text-[18px] text-[#D4AF6A] mb-1">
                    {s.nombre}
                  </p>
                  <p className="font-['DM_Sans'] text-[13px] text-[#F2EDE4]/50 leading-relaxed">
                    {s.direccion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Horarios */}
          <div>
            <p className="font-['JetBrains_Mono'] text-[10px] text-[#D4AF6A]/60 uppercase tracking-[0.3em] mb-4">
              Horarios
            </p>
            <div className="flex flex-col gap-3">
              {[
                { dia: "Lunes — Viernes", hora: "13:00 — 19:00" },
                { dia: "Sábado — Domingo", hora: "13:00 — 19:00" },
              ].map((h) => (
                <div
                  key={h.dia}
                  className="flex justify-between items-center border-b border-[#D4AF6A]/10 pb-3"
                >
                  <span className="font-['DM_Sans'] text-[14px] text-[#F2EDE4]/60">
                    {h.dia}
                  </span>
                  <span className="font-['JetBrains_Mono'] text-[12px] text-[#D4AF6A]">
                    {h.hora}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <p className="font-['JetBrains_Mono'] text-[10px] text-[#D4AF6A]/60 uppercase tracking-[0.3em] mb-4">
              Contacto
            </p>
            <p className="font-['DM_Sans'] text-[14px] text-[#F2EDE4]/60">
              reservaciones@casablanca.mx
            </p>
          </div>
        </div>

        {/* Mapa embed */}
        <div
          className="relative"
          style={{ border: "1px solid rgba(212, 175, 106, 0.15)" }}
        >
          <iframe
            title="Ubicación Casablanca"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3814.1!2d-96.7266!3d17.0732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85c7222!2sCircuito+Sur+113%2C+La+Cascada%2C+Oaxaca!5e0!3m2!1ses!2smx!4v1"
            width="100%"
            height="380"
            style={{
              filter: "grayscale(1) invert(0.9) contrast(0.8)",
              display: "block",
            }}
            allowFullScreen=""
            loading="lazy"
          />

          {/* Punto rojo de ubicación exacta */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="absolute rounded-full animate-ping"
              style={{
                width: "28px",
                height: "28px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(155, 35, 53, 0.35)",
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: "20px",
                height: "20px",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                background: "rgba(155, 35, 53, 0.2)",
                border: "1px solid rgba(155, 35, 53, 0.5)",
              }}
            />
            <div
              className="relative rounded-full"
              style={{
                width: "10px",
                height: "10px",
                background: "#9B2335",
                boxShadow: "0 0 0 2px rgba(242, 237, 228, 0.9)",
              }}
            />
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 h-12"
            style={{
              background: "linear-gradient(to top, rgb(16,16,16), transparent)",
            }}
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          bottom: 16,
          width: 56,
          height: 28,
          borderRadius: 9999,
          background: "rgba(212,175,106,0.08)",
          border: "1px solid rgba(212,175,106,0.16)",
          pointerEvents: "none",
          zIndex: 20,
        }}
      />
    </section>
  );
}

export default Ubicacion;
