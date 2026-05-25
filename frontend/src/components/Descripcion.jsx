function Descripcion() {
  return (
    <section id="info" className="py-32 px-16">
      {/* Separador — fuera del max-w para abarcar todo el ancho */}
      <div className="flex items-center gap-6 mb-16">
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
          Nuestra Historia
        </span>
        <div
          className="h-px flex-grow"
          style={{ background: "rgba(212, 175, 106, 0.15)" }}
        />
      </div>

      {/* Contenido limitado en ancho */}
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 gap-24 items-center">
          <div>
            <h2
              className="font-['Outfit'] text-[52px] leading-tight text-[#F2EDE4] mb-8"
              style={{ fontWeight: 400 }}
            >
              Donde Japón
              <br />
              <span className="italic text-[#D4AF6A]">se encuentra</span>
              <br />
              con Oaxaca
            </h2>
            <p className="font-['Nunito'] text-[15px] text-[#F2EDE4]/50 leading-relaxed mb-6">
              Desde 1981, Casablanca ha fusionado la precisión y delicadeza de
              la cocina japonesa con los sabores profundos y auténticos de
              Oaxaca. Cada platillo es una conversación entre dos culturas,
              elaborado con ingredientes de temporada y técnicas heredadas de
              generaciones.
            </p>
            <p className="font-['Nunito'] text-[15px] text-[#F2EDE4]/50 leading-relaxed">
              Nuestro equipo de chefs viaja anualmente a Japón para traer de
              vuelta técnicas, ingredientes y una filosofía que se refleja en
              cada corte, cada caldo y cada presentación que llega a tu mesa.
            </p>
          </div>

          {/* Datos rápidos con barra vertical y puntos */}
          <div className="relative">
            {/* barra vertical */}
            <div className="absolute left-3 top-0 bottom-0 w-px bg-[#D4AF6A]/10" />

            <div className="flex flex-col gap-8">
              {[
                { numero: "40+", label: "Años de experiencia" },
                { numero: "12", label: "Chefs especializados" },
                { numero: "60+", label: "Platillos en carta" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[24px_1fr] items-center gap-6"
                >
                  <div className="flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-[#D4AF6A]" />
                  </div>
                  <div>
                    <span className="font-['Outfit'] text-[56px] text-[#D4AF6A] leading-none">
                      {item.numero}
                    </span>
                    <p className="font-['JetBrains_Mono'] text-[11px] text-[#F2EDE4]/40 uppercase tracking-widest mt-1">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Descripcion;
