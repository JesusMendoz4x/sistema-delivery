function Footer() {
  return (
    <footer className="py-12 px-16 border-t border-[#D4AF6A]/10">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        {/* Logo y nombre */}
        <div className="flex flex-col">
          <span className="font-['Outfit'] text-[16px] tracking-widest uppercase text-[#D4AF6A]">
            Casablanca
          </span>
          <span className="font-['JetBrains_Mono'] text-[9px] text-[#F2EDE4]/30 tracking-widest mt-1">
            EST. 1981
          </span>
        </div>

        {/* Centro */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-['JetBrains_Mono'] text-[9px] text-[#F2EDE4]/20 uppercase tracking-widest">
            © 2025 Casablanca. Todos los derechos reservados.
          </span>
        </div>

        {/* Desarrollador */}
        <div className="flex flex-col items-end">
          <span className="font-['JetBrains_Mono'] text-[9px] text-[#F2EDE4]/30 uppercase tracking-widest">
            Desarrollado por
          </span>
          <span className="font-['Outfit'] text-[14px] text-[#D4AF6A]/70 mt-1">
            Equipo Casablanca Dev
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
