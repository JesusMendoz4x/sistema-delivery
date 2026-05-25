function AdminDashboard() {
  return (
    <div>
      <h2 className="text-[24px] font-['Outfit'] text-[#F2EDE4] mb-10 tracking-widest uppercase">
        Resumen del Sistema
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Card 1 */}
        <div className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-8 rounded-xl hover:border-[#D4AF6A]/50 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[#F2EDE4]/60 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]">
              Total Pedidos
            </h3>
            <span className="material-symbols-outlined text-[#D4AF6A] font-light">receipt_long</span>
          </div>
          <p className="text-[44px] font-['Outfit'] text-[#F2EDE4] leading-none mb-4">124</p>
          <p className="text-[10px] text-[#9B2335] font-['JetBrains_Mono'] tracking-[0.2em] uppercase">+12% vs ayer</p>
        </div>

        {/* Card 2 */}
        <div className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-8 rounded-xl hover:border-[#D4AF6A]/50 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[#F2EDE4]/60 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]">
              Ingresos del Día
            </h3>
            <span className="material-symbols-outlined text-[#D4AF6A] font-light">payments</span>
          </div>
          <p className="text-[44px] font-['Outfit'] text-[#D4AF6A] leading-none mb-4">$3,450</p>
          <p className="text-[10px] text-[#9B2335] font-['JetBrains_Mono'] tracking-[0.2em] uppercase">+5.2% vs ayer</p>
        </div>

        {/* Card 3 */}
        <div className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-8 rounded-xl hover:border-[#D4AF6A]/50 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-[#F2EDE4]/60 font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]">
              Usuarios Activos
            </h3>
            <span className="material-symbols-outlined text-[#D4AF6A] font-light">group</span>
          </div>
          <p className="text-[44px] font-['Outfit'] text-[#F2EDE4] leading-none mb-4">89</p>
          <p className="text-[10px] text-[#D4AF6A]/50 font-['JetBrains_Mono'] tracking-[0.2em] uppercase">4 nuevos hoy</p>
        </div>
      </div>

      <div className="bg-[#141414]/60 border border-[#D4AF6A]/20 p-10 rounded-xl backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
        <h3 className="text-[16px] font-['Outfit'] text-[#F2EDE4] mb-8 tracking-widest uppercase">Últimos Pedidos</h3>
        <div className="flex items-center justify-center h-48 border border-dashed border-[#D4AF6A]/20 rounded-lg bg-[#141414]/40">
          <p className="text-[#F2EDE4]/40 font-['Nunito'] text-sm tracking-wide">
            La tabla de pedidos recientes se implementará en la siguiente fase.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
