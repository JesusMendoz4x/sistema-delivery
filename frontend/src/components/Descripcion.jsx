function Descripcion() {
  return (
    <section id="info" className="py-32 px-16 max-w-5xl mx-auto">
      {/* Separador */}
      <div className="flex items-center gap-6 mb-16">
        <div className="h-px flex-grow bg-[#D4AF6A]/20" />
        <span className="font-['JetBrains_Mono'] text-[10px] text-[#D4AF6A]/60 uppercase tracking-[0.4em]">
          Nuestra Historia
        </span>
        <div className="h-px flex-grow bg-[#D4AF6A]/20" />
      </div>

      <div className="grid grid-cols-2 gap-24 items-center">
        <div>
          <h2
            className="font-['EB_Garamond'] text-[52px] leading-tight text-[#F2EDE4] mb-8"
            style={{ fontWeight: 400 }}
          >
            Donde Japón
            <br />
            <span className="italic text-[#D4AF6A]">se encuentra</span>
            <br />
            con Oaxaca
          </h2>
          <p className="font-['DM_Sans'] text-[15px] text-[#F2EDE4]/50 leading-relaxed mb-6">
            Desde 1981, Casablanca ha fusionado la precisión y delicadeza de la
            cocina japonesa con los sabores profundos y auténticos de Oaxaca.
            Cada platillo es una conversación entre dos culturas, elaborado con
            ingredientes de temporada y técnicas heredadas de generaciones.
          </p>
          <p className="font-['DM_Sans'] text-[15px] text-[#F2EDE4]/50 leading-relaxed">
            Nuestro equipo de chefs viaja anualmente a Japón para traer de
            vuelta técnicas, ingredientes y una filosofía que se refleja en cada
            corte, cada caldo y cada presentación que llega a tu mesa.
          </p>
        </div>

        {/* Datos rápidos */}
        <div className="flex flex-col gap-8 border-l border-[#D4AF6A]/15 pl-24">
          {[
            { numero: "40+", label: "Años de experiencia" },
            { numero: "12", label: "Chefs especializados" },
            { numero: "60+", label: "Platillos en carta" },
          ].map((item) => (
            <div key={item.label}>
              <span className="font-['EB_Garamond'] text-[56px] text-[#D4AF6A] leading-none">
                {item.numero}
              </span>
              <p className="font-['JetBrains_Mono'] text-[11px] text-[#F2EDE4]/40 uppercase tracking-widest mt-1">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Descripcion;
