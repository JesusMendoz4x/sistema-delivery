import { useState, useEffect, useRef } from "react";
import PedidoCard from "./PedidoCard";
import api from "../services/api";

const SUCURSALES_STATIC_FALLBACK = [
  {
    _id: "6650dbf7f1a0b1234567890a",
    nombre: "Sucursal Centro",
    direccion: "Macedonio Alcalá 402, Centro Histórico, Oaxaca",
    ubicacion: { latitud: 17.0604, longitud: -96.7266 }
  },
  {
    _id: "6650dbf7f1a0b1234567890e",
    nombre: "Sucursal Reforma",
    direccion: "Av. Fuerza Aérea Mexicana 900, esq. Azucenas, Col. Reforma, Oaxaca",
    ubicacion: { latitud: 17.0818, longitud: -96.7135 }
  },
  {
    _id: "6650dbf7f1a0b1234567890f",
    nombre: "Sucursal Macroplaza",
    direccion: "Carretera Internacional Km 1.5, Santa Lucía del Camino, Oaxaca",
    ubicacion: { latitud: 17.0652, longitud: -96.6961 }
  },
  {
    _id: "6650dbf7f1a0b12345678910",
    nombre: "Sucursal Monte Alban",
    direccion: "Carretera a Monte Albán 860, Montoya, Oaxaca",
    ubicacion: { latitud: 17.0655, longitud: -96.7570 }
  }
];

const ESTADOS = [
  {
    key: "pendiente",
    label: "Pendiente",
    desc: "Tu pedido fue recibido y está en espera.",
    color: "#C8901A",
    icon: "schedule",
  },
  {
    key: "preparando",
    label: "En preparación",
    desc: "El equipo de cocina está preparando tu orden.",
    color: "#9B2335",
    icon: "soup_kitchen",
  },
  {
    key: "en_camino",
    label: "En camino",
    desc: "Tu pedido va rumbo a tu domicilio en tiempo real.",
    color: "#D4AF6A",
    icon: "two_wheeler",
  },
  {
    key: "entregado",
    label: "Entregado",
    desc: "Orden completada. ¡Buen provecho!",
    color: "#7a6655",
    icon: "celebration",
  },
];

function ModalConfirmar({ sucursal, onAceptar, onCancelar }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-sm mx-4 p-8"
        style={{
          background: "#F2E6D8",
          border: "1px solid rgba(90,70,54,0.2)",
          opacity: 0,
          animation: "pedidoFadeUp 0.25s ease 0.05s both",
        }}
      >
        <p className="font-['DM_Sans'] text-[10px] text-[#9B2335] uppercase tracking-[0.3em] mb-3">
          — Confirmar orden
        </p>
        <h2 className="font-['EB_Garamond'] text-2xl text-[#2f1f14] mb-2">
          ¿Seguro que quieres confirmar?
        </h2>
        <p className="font-['DM_Sans'] text-sm text-[#7a6655] mb-8">
          Tu pedido será enviado a {sucursal?.nombre || "la sucursal"} y no podrás modificarlo.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 py-3 font-['DM_Sans'] text-xs uppercase tracking-widest text-[#7a6655] hover:text-[#2f1f14] transition-colors"
            style={{ border: "1px solid rgba(90,70,54,0.25)" }}
          >
            Cancelar
          </button>
          <button
            onClick={onAceptar}
            className="flex-1 py-3 bg-[#9B2335] font-['DM_Sans'] text-xs uppercase tracking-widest text-white hover:bg-[#7d1c2a] transition-colors active:scale-[0.98]"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

function PanelEstado({ pedido, sucursal, onCerrar }) {
  const idxActual = ESTADOS.findIndex((e) => e.key === pedido.estado);

  return (
    <>
      {/* Backdrop de fondo oscuro en móvil para destacar el panel de estado */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        onClick={onCerrar}
      />
      
      <div
        className="fixed lg:absolute z-[1000] lg:z-20 flex flex-col overflow-hidden inset-x-4 bottom-4 top-24 lg:top-4 lg:right-4 lg:bottom-4 lg:left-auto lg:inset-y-auto w-auto lg:w-[260px] max-w-[340px] lg:max-w-none mx-auto lg:mx-0"
        style={{
          background: "rgba(10,6,3,0.96)",
          border: "1px solid rgba(212,175,106,0.2)",
          backdropFilter: "blur(14px)",
          opacity: 0,
          boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
          animation: "panelSlideRight 0.3s ease 0.05s both",
        }}
      >
        <div
          className="px-5 py-5 flex items-start justify-between flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(212,175,106,0.1)" }}
        >
          <div>
            <p className="font-['DM_Sans'] text-[9px] text-[#9B2335] uppercase tracking-[0.3em] mb-1">
              #{String(pedido._id || pedido.id || '').slice(-4).padStart(4, "0")}
            </p>
            <p className="font-['EB_Garamond'] text-[17px] text-[#F2E6D8] leading-tight">
              Estado del pedido
            </p>
          </div>
          <button
            onClick={onCerrar}
            className="w-6 h-6 flex items-center justify-center text-[#5a4636] hover:text-[#F2E6D8] transition-colors flex-shrink-0 mt-0.5"
            style={{ border: "1px solid rgba(212,175,106,0.15)" }}
          >
            <span className="font-['DM_Sans'] text-[10px]">✕</span>
          </button>
        </div>

        <div
          className="px-5 py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(212,175,106,0.08)" }}
        >
          <p className="font-['DM_Sans'] text-[9px] text-[#5a4636] uppercase tracking-widest mb-1">
            Sucursal
          </p>
          <p className="font-['DM_Sans'] text-[15px] font-medium text-[#F2E6D8]">
            {sucursal.nombre}
          </p>
          <p className="font-['DM_Sans'] text-[10px] text-[#5a4636] mt-0.5 leading-snug">
            {sucursal.direccion}
          </p>
        </div>

        <div
          className="flex-1 overflow-y-auto px-5 py-5"
          style={{ overscrollBehavior: "contain" }}
        >
          <p className="font-['DM_Sans'] text-[9px] text-[#5a4636] uppercase tracking-widest mb-4">
            Progreso
          </p>
          <div className="flex flex-col gap-2">
            {ESTADOS.map((e, i) => {
              const done = i < idxActual;
              const activo = i === idxActual;
              const futuro = i > idxActual;
              return (
                <div key={e.key} className="flex gap-3">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0"
                      style={{
                        background: activo
                          ? "#9B2335"
                          : done
                            ? "#D4AF6A"
                            : "rgba(212,175,106,0.15)",
                        border: `1px solid ${futuro ? "rgba(212,175,106,0.15)" : "rgba(212,175,106,0.85)"}`,
                        boxShadow: activo
                          ? "0 0 10px rgba(155, 35, 53, 0.55)"
                          : "none",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: "12px",
                          color: activo
                            ? "#fff"
                            : done
                              ? "#3D3530"
                              : "rgba(61,53,48,0.35)",
                        }}
                      >
                        {e.icon}
                      </span>
                    </div>
                    {i < ESTADOS.length - 1 && (
                      <div
                        className="w-px flex-1 my-1 transition-all duration-500"
                        style={{
                          minHeight: "36px",
                          background: done
                            ? "rgba(212,175,106,0.65)"
                            : "rgba(212,175,106,0.15)",
                        }}
                      />
                    )}
                  </div>
                  <div className="pb-5">
                    <p
                      className="font-['DM_Sans'] text-[9px] uppercase tracking-wider mb-0.5"
                      style={{
                        color: activo
                          ? "#9B2335"
                          : done
                            ? "#D4AF6A"
                            : "rgba(212,175,106,0.4)",
                      }}
                    >
                      {e.label}
                    </p>
                    {activo && (
                      <p
                        className="font-['DM_Sans'] text-[11px] leading-snug"
                        style={{ color: "rgba(242,230,216,0.55)" }}
                      >
                        {e.desc}
                      </p>
                    )}
                    {done && (
                      <p
                        className="font-['DM_Sans'] text-[9px]"
                        style={{ color: "rgba(90,70,54,0.5)" }}
                      >
                        Completado
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="px-5 py-5 flex items-center justify-between flex-shrink-0"
          style={{
            borderTop: "1px solid rgba(212,175,106,0.08)",
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <div>
            <p className="font-['DM_Sans'] text-[9px] text-[#5a4636] uppercase tracking-widest">
              {(pedido.items || pedido.productos || []).reduce((a, i) => a + i.cantidad, 0)} productos
            </p>
            <p className="font-['DM_Sans'] text-[11px] text-[#F2E6D8]/50 mt-0.5">
              {pedido.fecha || (pedido.createdAt ? new Date(pedido.createdAt).toLocaleDateString() : '')}
            </p>
          </div>
          <div className="text-right">
            <p className="font-['DM_Sans'] text-[9px] text-[#5a4636] uppercase tracking-widest">
              Total
            </p>
            <p className="font-['EB_Garamond'] text-xl text-[#D4AF6A]">
              ${(pedido.total || 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function VistaPedidos({ pedidos = [], onConfirmarPedido }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [sucursales, setSucursales] = useState(SUCURSALES_STATIC_FALLBACK);
  const [leafletReady, setLeafletReady] = useState(!!window.L);

  const leafletMapRef = useRef(null);
  const markerSucursalRef = useRef(null);
  const markerClienteRef = useRef(null);
  const markerRepartidorRef = useRef(null);
  const polylineRouteRef = useRef(null);
  const lastPedidoKeyRef = useRef("");

  // Auto-seleccionar el primer pedido si no hay ninguno seleccionado
  useEffect(() => {
    if (!pedidoSeleccionado && pedidos.length > 0) {
      setPedidoSeleccionado(pedidos[0]._id || pedidos[0].id);
    }
  }, [pedidos, pedidoSeleccionado]);

  // Cargar sucursales reales de la base de datos
  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await api.get("/sucursales");
        const listaDB = response.data.data || [];
        if (listaDB.length > 0) {
          // Unir datos de base de datos con las coordenadas correspondientes
          const mapeadas = listaDB.map((sucDB) => {
            const fallback = SUCURSALES_STATIC_FALLBACK.find(
              (s) => s.nombre.toLowerCase().includes(sucDB.nombre.toLowerCase()) || 
                     sucDB.nombre.toLowerCase().includes(s.nombre.toLowerCase())
            );
            return {
              _id: sucDB._id,
              nombre: sucDB.nombre,
              direccion: sucDB.direccion || fallback?.direccion || "",
              ubicacion: {
                latitud: sucDB.ubicacion?.latitud || fallback?.ubicacion?.latitud || 17.0604,
                longitud: sucDB.ubicacion?.longitud || fallback?.ubicacion?.longitud || -96.7266,
              }
            };
          });
          setSucursales(mapeadas);
        }
      } catch (err) {
        console.warn("No se pudieron cargar sucursales de la DB, usando fallback estático:", err.message);
        setSucursales(SUCURSALES_STATIC_FALLBACK);
      }
    };
    fetchSucursales();
  }, []);

  // Verificar si Leaflet ya está cargado en window.L
  useEffect(() => {
    if (window.L) {
      setLeafletReady(true);
      return;
    }
    const interval = setInterval(() => {
      if (window.L) {
        setLeafletReady(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const pedidoActivo = pedidos.find((p) => (p._id || p.id) === pedidoSeleccionado) ?? null;
  const sucursalActiva = sucursales.find(s => String(s._id) === String(pedidoActivo?.sucursalId)) 
    || sucursales[0];

  // Coordenadas reales de ruta obtenidas de OSRM
  const [rutaCoords, setRutaCoords] = useState([]);

  // Obtener la ruta real usando OSRM
  useEffect(() => {
    if (!pedidoActivo) {
      setRutaCoords([]);
      return;
    }

    const latCliente = pedidoActivo.latitud || 17.0604;
    const lonCliente = pedidoActivo.longitud || -96.7266;
    const latSucursal = sucursalActiva?.ubicacion?.latitud || 17.0604;
    const lonSucursal = sucursalActiva?.ubicacion?.longitud || -96.7266;

    let active = true;

    const fetchOSRMRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${lonSucursal},${latSucursal};${lonCliente},${latCliente}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        if (active && data.routes && data.routes[0]) {
          const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
          setRutaCoords(coords);
          return;
        }
      } catch (err) {
        console.warn("Error al obtener la ruta de OSRM, usando grid fallback:", err.message);
      }
      
      if (active) {
        // Fallback a grid
        const fallback = obtenerPuntosRutaGrid([latSucursal, lonSucursal], [latCliente, lonCliente]);
        setRutaCoords(fallback);
      }
    };

    fetchOSRMRoute();

    return () => {
      active = false;
    };
  }, [pedidoActivo?._id, sucursalActiva?._id]);

  // Simulación de progreso de entrega en tiempo real del repartidor (duración: 30 segundos)
  const [progresoEntrega, setProgresoEntrega] = useState(0);

  useEffect(() => {
    if (!pedidoActivo || pedidoActivo.estado !== 'en_camino') {
      setProgresoEntrega(0);
      return;
    }

    const calcularProgreso = () => {
      const updatedAt = pedidoActivo.updatedAt || pedidoActivo.updated_at || new Date().toISOString();
      const msPassed = Date.now() - new Date(updatedAt).getTime();
      const progress = Math.min(1, Math.max(0, msPassed / 30000));
      setProgresoEntrega(progress);
    };

    calcularProgreso();
    const interval = setInterval(calcularProgreso, 200);

    return () => clearInterval(interval);
  }, [pedidoActivo?.estado, pedidoActivo?.updatedAt]);

  // Genera puntos de ruta en formato cuadrícula urbana (giros de 90°)
  const obtenerPuntosRutaGrid = (desde, hasta) => {
    const p1 = [desde[0], desde[1]];
    const p2 = [desde[0] + (hasta[0] - desde[0]) * 0.5, desde[1]];
    const p3 = [desde[0] + (hasta[0] - desde[0]) * 0.5, hasta[1]];
    const p4 = [hasta[0], hasta[1]];
    return [p1, p2, p3, p4];
  };

  // Interpolación de coordenadas a lo largo de la ruta
  const obtenerPuntoEnRuta = (puntos, fraccion) => {
    if (puntos.length === 0) return null;
    if (puntos.length === 1 || fraccion <= 0) return puntos[0];
    if (fraccion >= 1) return puntos[puntos.length - 1];

    const totalSegmentos = puntos.length - 1;
    const indexSegmento = Math.floor(fraccion * totalSegmentos);
    const fraccionEnSegmento = (fraccion * totalSegmentos) - indexSegmento;

    const pA = puntos[indexSegmento];
    const pB = puntos[indexSegmento + 1];

    const lat = pA[0] + (pB[0] - pA[0]) * fraccionEnSegmento;
    const lon = pA[1] + (pB[1] - pA[1]) * fraccionEnSegmento;
    return [lat, lon];
  };

  // Efecto principal para renderizar y actualizar el mapa Leaflet
  useEffect(() => {
    if (!leafletReady || !window.L) return;

    // Solo inicializamos el mapa si el div existe en el DOM
    const mapDiv = document.getElementById("map-pedidos");
    if (!mapDiv) return;

    // Coordenadas
    const latCliente = pedidoActivo?.latitud || 17.0604;
    const lonCliente = pedidoActivo?.longitud || -96.7266;

    const latSucursal = sucursalActiva?.ubicacion?.latitud || 17.0604;
    const lonSucursal = sucursalActiva?.ubicacion?.longitud || -96.7266;

    const desde = [latSucursal, lonSucursal];
    const hasta = [latCliente, lonCliente];
    const puntosRuta = rutaCoords.length > 0 ? rutaCoords : obtenerPuntosRutaGrid(desde, hasta);

    // Inicializar mapa si no existe
    if (!leafletMapRef.current) {
      const map = window.L.map('map-pedidos', {
        zoomControl: false,
        attributionControl: false
      }).setView(desde, 14);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;

    // Iconos personalizados con el diseño de Casablanca
    const sucursalIcon = window.L.divIcon({
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#100c0a] border border-[#D4AF6A] shadow-[0_0_15px_rgba(212,175,106,0.65)]">
          <span class="material-symbols-outlined text-[16px]" style="color: #D4AF6A; font-variation-settings: 'FILL' 1;">store</span>
        </div>
      `,
      className: 'custom-leaflet-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const clienteIcon = window.L.divIcon({
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-full bg-[#100c0a] border border-[#9B2335] shadow-[0_0_15px_rgba(155,35,53,0.65)]">
          <span class="material-symbols-outlined text-[16px]" style="color: #9B2335; font-variation-settings: 'FILL' 1;">home</span>
        </div>
      `,
      className: 'custom-leaflet-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const repartidorIcon = window.L.divIcon({
      html: `
        <div class="flex items-center justify-center w-9 h-9 rounded-full bg-[#9B2335] border border-[#D4AF6A] shadow-[0_0_18px_rgba(212,175,106,0.85)] animate-bounce">
          <span class="material-symbols-outlined text-[18px] text-white">two_wheeler</span>
        </div>
      `,
      className: 'custom-leaflet-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    // Actualizar o crear marcador de Sucursal
    if (markerSucursalRef.current) {
      markerSucursalRef.current.setLatLng(desde);
    } else {
      markerSucursalRef.current = window.L.marker(desde, { icon: sucursalIcon }).addTo(map)
        .bindPopup(`<b>${sucursalActiva.nombre}</b><br/>Origen del pedido`);
    }

    // Actualizar o crear marcador de Cliente
    if (markerClienteRef.current) {
      markerClienteRef.current.setLatLng(hasta);
    } else {
      markerClienteRef.current = window.L.marker(hasta, { icon: clienteIcon }).addTo(map)
        .bindPopup(`<b>Punto de entrega</b><br/>Dirección del cliente`);
    }

    // Actualizar o crear polilínea de ruta
    if (pedidoActivo && pedidoActivo.estado === 'en_camino') {
      if (polylineRouteRef.current) {
        polylineRouteRef.current.setLatLngs(puntosRuta);
      } else {
        polylineRouteRef.current = window.L.polyline(puntosRuta, {
          color: '#D4AF6A',
          weight: 3.5,
          opacity: 0.8,
          dashArray: '6, 12'
        }).addTo(map);
      }
    } else {
      if (polylineRouteRef.current) {
        polylineRouteRef.current.remove();
        polylineRouteRef.current = null;
      }
    }

    // Actualizar o crear repartidor en ruta
    if (pedidoActivo && pedidoActivo.estado === 'en_camino') {
      const posRep = obtenerPuntoEnRuta(puntosRuta, progresoEntrega);
      if (posRep) {
        if (markerRepartidorRef.current) {
          markerRepartidorRef.current.setLatLng(posRep);
        } else {
          markerRepartidorRef.current = window.L.marker(posRep, { icon: repartidorIcon }).addTo(map)
            .bindPopup(`<b>Repartidor en camino</b><br/>Tu comida va hacia ti.`);
        }
      }
    } else {
      if (markerRepartidorRef.current) {
        markerRepartidorRef.current.remove();
        markerRepartidorRef.current = null;
      }
    }

    // Ajustar los límites del mapa para mostrar ambos marcadores
    const currentPedidoKey = `${pedidoActivo?._id || pedidoActivo?.id || ''}_${pedidoActivo?.estado || ''}_${sucursalActiva?._id || ''}`;
    if (lastPedidoKeyRef.current !== currentPedidoKey) {
      lastPedidoKeyRef.current = currentPedidoKey;
      const bounds = window.L.latLngBounds([desde, hasta]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [leafletReady, pedidoActivo, sucursalActiva, progresoEntrega, rutaCoords]);

  // Limpieza del mapa al desmontar el componente
  useEffect(() => {
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markerSucursalRef.current = null;
        markerClienteRef.current = null;
        markerRepartidorRef.current = null;
        polylineRouteRef.current = null;
        lastPedidoKeyRef.current = "";
      }
    };
  }, []);

  const handleAceptar = () => {
    setMostrarModal(false);
    onConfirmarPedido?.();
  };
  const handleCancelar = () => setMostrarModal(false);
  const handlePedidoClick = (id) =>
    setPedidoSeleccionado((prev) => (prev === id ? null : id));

  // Funciones de interactividad de los controles del mapa
  const zoomIn = () => {
    if (leafletMapRef.current) leafletMapRef.current.zoomIn();
  };

  const zoomOut = () => {
    if (leafletMapRef.current) leafletMapRef.current.zoomOut();
  };

  const recenterMap = () => {
    if (leafletMapRef.current && pedidoActivo) {
      const latCliente = pedidoActivo.latitud || 17.0604;
      const lonCliente = pedidoActivo.longitud || -96.7266;
      const latSucursal = sucursalActiva?.ubicacion?.latitud || 17.0604;
      const lonSucursal = sucursalActiva?.ubicacion?.longitud || -96.7266;

      const bounds = window.L.latLngBounds([
        [latSucursal, lonSucursal],
        [latCliente, lonCliente]
      ]);
      leafletMapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  };

  return (
    <>
      {mostrarModal && (
        <ModalConfirmar sucursal={sucursalActiva} onAceptar={handleAceptar} onCancelar={handleCancelar} />
      )}

      <style>{`
        @keyframes pedidoFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes panelSlideRight {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes sidebarSlideLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes mapaFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* Estilo oscuro de Leaflet */
        .dark-map .leaflet-tile {
          filter: grayscale(1) invert(0.92) contrast(1.15) brightness(0.85) sepia(0.12) !important;
        }
        .dark-map .leaflet-container {
          background: #0f0d0b !important;
        }
        .custom-leaflet-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(16, 12, 10, 0.95) !important;
          border: 1px solid rgba(212, 175, 106, 0.25) !important;
          color: #F2E6D8 !important;
          border-radius: 8px !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 11px !important;
        }
        .leaflet-popup-tip {
          background: rgba(16, 12, 10, 0.95) !important;
          border: 1px solid rgba(212, 175, 106, 0.25) !important;
        }
      `}</style>

      <div className="flex flex-col lg:flex-row pt-20" style={{ height: "calc(100vh - 5rem)" }}>
        {/* Sidebar izquierdo — entra desde la izquierda */}
        <div
          className="w-full lg:w-[400px] h-[280px] lg:h-full flex-shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-[#D4AF6A]/14"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,16,14,0.98) 0%, rgba(12,10,9,0.98) 55%, rgba(10,10,10,0.98) 100%)",
            opacity: 0,
            animation: "sidebarSlideLeft 0.5s ease 0.1s both",
          }}
        >
          {/* Header sidebar */}
          <div
            className="px-6 pt-7 pb-5 flex-shrink-0"
            style={{
              borderBottom: "1px solid rgba(212,175,106,0.14)",
              opacity: 0,
              animation: "pedidoFadeUp 0.4s ease 0.2s both",
              background:
                "linear-gradient(180deg, rgba(41,9,8,0.85) 0%, rgba(10,10,10,0.25) 100%)",
            }}
          >
            <p className="font-['DM_Sans'] text-[10px] text-[#9B2335] uppercase tracking-[0.3em] mb-1.5">
              — Mis pedidos
            </p>
            <div className="flex items-baseline justify-between">
              <h1 className="font-['EB_Garamond'] text-3xl text-[#F2E6D8] tracking-tight">
                Órdenes
              </h1>
              {pedidos.length > 0 && (
                <span className="font-['DM_Sans'] text-[10px] text-[#5a4636] uppercase tracking-widest">
                  {pedidos.length} {pedidos.length === 1 ? "orden" : "órdenes"}
                </span>
              )}
            </div>
          </div>

          {/* Lista de pedidos */}
          <div
            className="flex-grow overflow-y-auto px-4 py-4 space-y-3"
            style={{ overscrollBehavior: "contain" }}
          >
            {pedidos.length === 0 ? (
              <div
                className="px-3"
                style={{
                  opacity: 0,
                  animation: "pedidoFadeUp 0.5s ease 0.3s both",
                }}
              >
                <div
                  className="p-5"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(28, 22, 18, 0.94) 0%, rgba(20, 16, 14, 0.94) 55%, rgba(14, 12, 10, 0.94) 100%)",
                    border: "1px solid rgba(155,35,53,0.2)",
                    borderRadius: "14px",
                    boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
                  }}
                >
                  <p className="font-['EB_Garamond'] text-xl text-[#F2E6D8] mb-2">
                    No hay pedidos realizados hoy
                  </p>
                  <p className="font-['DM_Sans'] text-xs text-[#5a4636]">
                    Confirma un pedido desde el carrito para verlo aquí.
                  </p>
                </div>
              </div>
            ) : (
              pedidos.map((p, i) => (
                <div
                  key={p._id || p.id}
                  onClick={() => handlePedidoClick(p._id || p.id)}
                  className="cursor-pointer transition-all duration-150"
                  style={{
                    outline:
                      pedidoSeleccionado === (p._id || p.id)
                        ? "2px solid rgba(155,35,53,0.55)"
                        : "2px solid transparent",
                  }}
                >
                  <PedidoCard pedido={p} index={i} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel derecho — mapa */}
        {pedidos.length > 0 && (
          <div
            className="flex-1 flex flex-col relative h-[calc(100%-280px)] lg:h-full"
            style={{
              background: "#0a0a0a",
              opacity: 0,
              animation: "mapaFadeIn 0.6s ease 0.3s both",
            }}
          >
            {/* Header mapa */}
            <div
              className="px-8 py-5 flex-shrink-0 flex items-center justify-between"
              style={{
                borderBottom: "1px solid rgba(212,175,106,0.16)",
                background:
                  "linear-gradient(90deg, rgba(41,9,8,0.95) 0%, rgba(26,26,26,0.95) 55%, rgba(12,10,9,0.95) 100%)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.4)",
                opacity: 0,
                animation: "pedidoFadeUp 0.4s ease 0.4s both",
              }}
            >
              <div>
                <p className="font-['JetBrains_Mono'] text-[9px] text-[#9B2335] uppercase tracking-[0.25em] mb-1">
                  — Sucursal asignada
                </p>
                <p className="font-['EB_Garamond'] text-[24px] text-[#F2EDE4] leading-tight">
                  {sucursalActiva.nombre}
                </p>
                <p className="font-['DM_Sans'] text-[11px] text-[#5a4636]">
                  {sucursalActiva.direccion}
                </p>
              </div>
              {pedidoSeleccionado !== null && (
                <button
                  onClick={() => setPedidoSeleccionado(null)}
                  className="font-['DM_Sans'] text-[10px] text-[#5a4636] uppercase tracking-widest hover:text-[#F2E6D8] transition-colors"
                >
                  ✕ Cerrar
                </button>
              )}
            </div>

            {/* Mapa */}
            <div className="flex-1 flex items-center justify-center p-6">
              <div
                className="relative w-full h-full overflow-hidden"
                style={{
                  maxWidth: "860px",
                  maxHeight: "520px",
                  borderRadius: "16px",
                  border: "1px solid rgba(212,175,106,0.28)",
                  boxShadow:
                    "0 18px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(26,26,26,0.8) inset",
                  background: "#1A1A1A",
                }}
              >
                {/* Contenedor del Mapa Leaflet */}
                <div id="map-pedidos" className="w-full h-full dark-map" style={{ zIndex: 1 }} />

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    zIndex: 2,
                    background:
                      "linear-gradient(180deg, rgba(41,9,8,0.15) 0%, rgba(10,10,10,0.3) 100%)",
                    mixBlendMode: "multiply",
                  }}
                />

                <div
                  className="absolute top-4 left-4 px-4 py-3"
                  style={{
                    zIndex: 10,
                    background: "rgba(10,10,10,0.78)",
                    border: "1px solid rgba(212,175,106,0.2)",
                    borderRadius: "12px",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.35)",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.25em] text-[#9B2335] mb-1">
                    Sucursal asignada
                  </p>
                  <p className="font-['EB_Garamond'] text-[18px] text-[#F2EDE4] leading-tight">
                    {sucursalActiva.nombre}
                  </p>
                  <p className="font-['DM_Sans'] text-[10px] text-[#D4AF6A]/80">
                    {sucursalActiva.direccion}
                  </p>
                </div>

                {/* Controles de Interactividad Flotantes */}
                <div className="absolute top-4 right-4 flex flex-col gap-2" style={{ zIndex: 10 }}>
                  <button
                    type="button"
                    onClick={zoomIn}
                    className="w-8 h-8 flex items-center justify-center text-[#D4AF6A] hover:bg-[#D4AF6A] hover:text-[#0b0b0e] transition-colors cursor-pointer"
                    style={{
                      background: "rgba(10,10,10,0.78)",
                      border: "1px solid rgba(212,175,106,0.25)",
                      borderRadius: "999px",
                      fontSize: "16px",
                      fontWeight: "bold"
                    }}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={zoomOut}
                    className="w-8 h-8 flex items-center justify-center text-[#D4AF6A] hover:bg-[#D4AF6A] hover:text-[#0b0b0e] transition-colors cursor-pointer"
                    style={{
                      background: "rgba(10,10,10,0.78)",
                      border: "1px solid rgba(212,175,106,0.25)",
                      borderRadius: "999px",
                      fontSize: "16px",
                      fontWeight: "bold"
                    }}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={recenterMap}
                    className="w-8 h-8 flex items-center justify-center text-[#D4AF6A] hover:bg-[#D4AF6A] hover:text-[#0b0b0e] transition-colors cursor-pointer"
                    style={{
                      background: "rgba(10,10,10,0.78)",
                      border: "1px solid rgba(212,175,106,0.25)",
                      borderRadius: "999px",
                    }}
                  >
                    <span className="material-symbols-outlined text-[14px]">my_location</span>
                  </button>
                </div>

                <div
                  className="absolute left-4 bottom-4 px-3 py-2"
                  style={{
                    zIndex: 10,
                    background: "rgba(10,10,10,0.78)",
                    border: "1px solid rgba(212,175,106,0.18)",
                    borderRadius: "10px",
                  }}
                >
                  <p className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-[0.25em] text-[#D4AF6A]">
                    Mapa Interactivo Casablanca
                  </p>
                </div>
              </div>

              {pedidoActivo && (
                <PanelEstado
                  pedido={pedidoActivo}
                  sucursal={sucursalActiva}
                  onCerrar={() => setPedidoSeleccionado(null)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default VistaPedidos;
