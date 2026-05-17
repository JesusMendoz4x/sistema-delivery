function Ubicacion() {
  return (
    <section
      className="py-32 px-16"
      style={{ borderTop: "1px solid rgba(212, 175, 106, 0.1)" }}
    >
      {/* Separador */}
      <div className="flex items-center gap-6 mb-16">
        <div className="h-px flex-grow bg-[#D4AF6A]/20" />
        <span className="font-['JetBrains_Mono'] text-[10px] text-[#D4AF6A]/60 uppercase tracking-[0.4em]">
          Encuéntranos
        </span>
        <div className="h-px flex-grow bg-[#D4AF6A]/20" />
      </div>

      <div className="grid grid-cols-2 gap-24 max-w-5xl mx-auto">
        {/* Dirección y horarios */}
        <div className="flex flex-col gap-12">
          <div>
            <p className="font-['JetBrains_Mono'] text-[10px] text-[#D4AF6A]/60 uppercase tracking-[0.3em] mb-4">
              Dirección
            </p>
            <p className="font-['EB_Garamond'] text-[22px] text-[#F2EDE4] leading-relaxed">
              Circuito Sur 113, La Cascada,
              <br />
              68050 Oaxaca de Juárez, Oax.
            </p>
          </div>

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
          <div
            className="absolute bottom-0 left-0 right-0 h-12"
            style={{
              background: "linear-gradient(to top, rgb(16,16,16), transparent)",
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default Ubicacion;
