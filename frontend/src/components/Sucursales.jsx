import { useState, useEffect } from "react";
import centroImg from "../assets/centro.png";
import reformaImg from "../assets/reforma.png";
import macroplazaImg from "../assets/macroplaza.png";
import montealbanImg from "../assets/MonteAlban.png";
import api from "../services/api";

const sucursales = [
  {
    id: 1,
    codigo: "01",
    nombre: "Centro",
    nombreCompleto: "Casablanca Ramen House Centro",
    direccion:
      "Luis Jimenez Figueroa, Col. Centro, 68070 Oaxaca de Juarez, Oax.",
    horario: "Lun - Dom  ·  13:00 - 22:00 hrs",
    descripcion:
      "Ubicacion centrica con excelente ambiente que destaca por contar con una terraza en azotea ideal para disfrutar del ramen por la tarde.",
    foto: {
      src: centroImg,
      alt: "Sucursal Centro",
    },
    referencias: [
      "A 2 cuadras del Zocalo",
      "Frente al Mercado Benito Juarez",
      "Zona peatonal",
    ],
    lat: 17.0683,
    lng: -96.7214,
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d951.3!2d-96.7214!3d17.0683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDA0JzA2LjAiTiA5NsKwNDMnMTcuMCJX!5e0!3m2!1ses!2smx!4v1700000001",
  },
  {
    id: 2,
    codigo: "02",
    nombre: "Reforma",
    nombreCompleto: "Casablanca Ramen House Reforma",
    direccion:
      "Av. Fuerza Aerea Mexicana 900, esq. Azucenas, Col. Reforma, 68050 Oaxaca de Juarez, Oax.",
    horario: "Lun - Dom  ·  13:00 - 22:00 hrs",
    descripcion:
      "La sucursal principal de la zona norte; espacio amplio y contemporaneo famoso por su rapidez extrema en el servicio del menu personalizable.",
    foto: {
      src: reformaImg,
      alt: "Sucursal Reforma",
    },
    referencias: [
      "Esquina con Calle Azucenas",
      "Zona norte de la ciudad",
      "Amplio estacionamiento",
    ],
    lat: 17.0818,
    lng: -96.7135,
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d951.3!2d-96.7135!3d17.0818!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDA0JzU0LjUiTiA5NsKwNDInNDguNiJX!5e0!3m2!1ses!2smx!4v1700000002",
  },
  {
    id: 3,
    codigo: "03",
    nombre: "Macroplaza",
    nombreCompleto: "Casablanca Ramen House Macro Plaza",
    direccion:
      "Carretera Internacional Km 1.5, Nueva Santa Lucia, 71244 Santa Lucia del Camino, Oax.",
    horario: "Lun - Dom  ·  12:00 - 21:00 hrs",
    descripcion:
      "Formato optimizado para la zona oriente de la ciudad. Misma experiencia del ramen armado en 6 pasos con servicio al instante.",
    foto: {
      src: macroplazaImg,
      alt: "Sucursal Macroplaza",
    },
    referencias: [
      "Dentro del area de comida",
      "Subiendo escaleras al fondo a la derecha",
      "Plaza comercial",
    ],
    lat: 17.0652,
    lng: -96.6961,
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d951.3!2d-96.6961!3d17.0652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDAzJzU0LjciTiA5NsKwNDEnNDUuOSJX!5e0!3m2!1ses!2smx!4v1700000003",
  },
  {
    id: 4,
    codigo: "04",
    nombre: "Monte Alban",
    nombreCompleto: "Casablanca Ramen House Monte Alban",
    direccion:
      "Carretera a Monte Alban 860, Agencia de Policia Montoya, 68143 Oaxaca de Juarez, Oax.",
    horario: "Lun - Dom  ·  13:00 - 21:45 hrs",
    descripcion:
      "Sucursal de la zona poniente, ideal para comer en el lugar o pedir para llevar a casa mediante plataformas de entrega.",
    foto: {
      src: montealbanImg,
      alt: "Sucursal Monte Alban",
    },
    referencias: [
      "Carretera a Monte Alban",
      "Zona poniente de la ciudad",
      "Servicio a domicilio disponible",
    ],
    lat: 17.0655,
    lng: -96.757,
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d951.3!2d-96.757!3d17.0655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTfCsDAzJzU1LjgiTiA5NsKwNDUnMjUuMiJX!5e0!3m2!1ses!2smx!4v1700000004",
  },
];

function Sucursales() {
  const [sucursalesReales, setSucursalesReales] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activa, setActiva] = useState(0);
  const [animando, setAnimando] = useState(false);
  const [direccion, setDireccion] = useState(1);
  const [mapKey, setMapKey] = useState(0);
  const [vistaPanel, setVistaPanel] = useState("foto");

  useEffect(() => {
    const fetchSucursales = async () => {
      try {
        const response = await api.get('/sucursales');
        const listaDB = response.data.data || [];
        
        // Cruzamos la telemetría real de MongoDB con las descripciones y fotos locales de Casablanca
        const cruzadas = listaDB.map((sucDB, index) => {
          const estatica = sucursales.find(
            s => s.nombre.toLowerCase().includes(sucDB.nombre.toLowerCase()) ||
                 sucDB.nombre.toLowerCase().includes(s.nombre.toLowerCase())
          ) || sucursales[index % sucursales.length];
          
          return {
            ...estatica,
            _id: sucDB._id,
            nombre: sucDB.nombre,
            direccion: sucDB.direccion || estatica.direccion,
            lat: sucDB.ubicacion?.latitud || estatica.lat,
            lng: sucDB.ubicacion?.longitud || estatica.lng,
          };
        });
        
        setSucursalesReales(cruzadas);
      } catch (err) {
        console.error("Error al cargar sucursales de MongoDB:", err);
        // Fallback resiliente a los datos locales
        setSucursalesReales(sucursales);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSucursales();
  }, []);

  if (isLoading) {
    return (
      <div 
        style={{
          minHeight: "100vh",
          backgroundColor: "rgb(10,10,10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: "#D4AF6A",
          textTransform: "uppercase",
          letterSpacing: "0.2em"
        }}
      >
        Cargando red de sucursales en tiempo real...
      </div>
    );
  }

  if (sucursalesReales.length === 0) {
    return (
      <div 
        style={{
          minHeight: "100vh",
          backgroundColor: "rgb(10,10,10)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Nunito', sans-serif",
          fontSize: "14px",
          color: "rgba(242, 237, 228, 0.4)"
        }}
      >
        No hay sucursales activas registradas en MongoDB.
      </div>
    );
  }

  const total = sucursalesReales.length;
  const sucursal = sucursalesReales[activa];

  const navegar = (dir) => {
    if (animando) return;
    setDireccion(dir);
    setAnimando(true);
    setTimeout(() => {
      setActiva((prev) => (prev + dir + total) % total);
      setMapKey((k) => k + 1);
      setAnimando(false);
    }, 320);
  };

  const seleccionarSucursal = (index) => {
    if (animando || index === activa) return;
    setDireccion(index > activa ? 1 : -1);
    setAnimando(true);
    setTimeout(() => {
      setActiva(index);
      setMapKey((k) => k + 1);
      setAnimando(false);
    }, 320);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "rgb(10,10,10)",
        display: "flex",
        flexDirection: "column",
        paddingTop: "80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "55%",
            width: "60vw",
            maxWidth: "900px",
            aspectRatio: "1/1",
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 50% 50%, rgba(140,0,0,0.35) 0%, rgba(95,0,0,0.15) 35%, rgba(10,10,10,0) 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header style={{ padding: "32px 64px 24px" }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(212,175,106,0.6)",
              marginBottom: "6px",
            }}
          >
            Red de sucursales
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <h1
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: "clamp(28px, 4vw, 48px)",
                color: "#F2EDE4",
                fontWeight: 400,
                letterSpacing: "0.04em",
                margin: 0,
              }}
            >
              Nuestras Sucursales
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                paddingBottom: "6px",
              }}
            >
              <button
                onClick={() => navegar(-1)}
                style={{
                  width: "28px",
                  height: "28px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(212,175,106,0.25)",
                  color: "rgba(242,237,228,0.6)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,175,106,0.6)";
                  e.currentTarget.style.color = "#D4AF6A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,175,106,0.25)";
                  e.currentTarget.style.color = "rgba(242,237,228,0.6)";
                }}
                aria-label="Sucursal anterior"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "16px" }}
                >
                  arrow_back
                </span>
              </button>

              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                {sucursalesReales.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => seleccionarSucursal(i)}
                    style={{
                      width: i === activa ? "24px" : "6px",
                      height: "6px",
                      borderRadius: "3px",
                      backgroundColor:
                        i === activa ? "#D4AF6A" : "rgba(212,175,106,0.25)",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      padding: 0,
                    }}
                    aria-label={`Ir a sucursal ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => navegar(1)}
                style={{
                  width: "28px",
                  height: "28px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(212,175,106,0.25)",
                  color: "rgba(242,237,228,0.6)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,175,106,0.6)";
                  e.currentTarget.style.color = "#D4AF6A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,175,106,0.25)";
                  e.currentTarget.style.color = "rgba(242,237,228,0.6)";
                }}
                aria-label="Sucursal siguiente"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "16px" }}
                >
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
          <div
            style={{
              height: "1px",
              backgroundColor: "rgba(212,175,106,0.2)",
              marginTop: "20px",
            }}
          />
        </header>

        <main
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 0,
            padding: "0 64px 48px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              paddingRight: "48px",
              opacity: animando ? 0 : 1,
              transform: animando
                ? `translateX(${direccion * -30}px)`
                : "translateX(0)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "90px",
                  color: "#F2EDE4",
                  lineHeight: 1,
                  borderLeft: "2px solid rgba(212,175,106,0.55)",
                  paddingLeft: "12px",
                  userSelect: "none",
                }}
              >
                {sucursal.codigo}
              </div>

              <div style={{ display: "flex", flexDirection: "column" }}>
                <h2
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "32px",
                    color: "#F2EDE4",
                    fontWeight: 400,
                    letterSpacing: "0.02em",
                    margin: 0,
                  }}
                >
                  {sucursal.nombre}
                </h2>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "#D4AF6A",
                    margin: "4px 0 0",
                  }}
                >
                  {sucursal.nombreCompleto}
                </p>
              </div>
            </div>

            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "14px",
                color: "rgba(242,237,228,0.72)",
                lineHeight: "1.7",
                maxWidth: "440px",
                margin: 0,
              }}
            >
              {sucursal.descripcion}
            </p>

            <div
              style={{
                borderLeft: "1px solid rgba(212,175,106,0.3)",
                paddingLeft: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "rgba(212,175,106,0.6)",
                    marginBottom: "3px",
                  }}
                >
                  Direccion
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    color: "rgba(242,237,228,0.78)",
                    lineHeight: "1.5",
                    margin: 0,
                  }}
                >
                  {sucursal.direccion}
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "rgba(212,175,106,0.6)",
                    marginBottom: "3px",
                  }}
                >
                  Horario
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "13px",
                    color: "rgba(242,237,228,0.78)",
                    margin: 0,
                  }}
                >
                  {sucursal.horario}
                </p>
              </div>
            </div>

            <div
              style={{
                backgroundColor: "rgba(61,53,48,0.35)",
                border: "1px solid rgba(212,175,106,0.15)",
                padding: "14px 18px",
              }}
            >
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "9px",
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "rgba(212,175,106,0.7)",
                  marginBottom: "8px",
                }}
              >
                Referencias
              </p>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                {sucursal.referencias.map((ref, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: "#D4AF6A",
                        opacity: 0.5,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "12px",
                        color: "rgba(242,237,228,0.6)",
                      }}
                    >
                      {ref}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            style={{
              position: "sticky",
              top: "100px",
              opacity: animando ? 0 : 1,
              transform: animando
                ? `translateX(${direccion * 30}px)`
                : "translateX(0)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <div
              style={{
                position: "relative",
                border: "1px solid rgba(212,175,106,0.2)",
                padding: "12px",
                overflow: "hidden",
              }}
            >
              <button
                onClick={() =>
                  setVistaPanel((prev) => (prev === "foto" ? "mapa" : "foto"))
                }
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "14px",
                  width: "34px",
                  height: "34px",
                  backgroundColor: "rgba(10,10,10,0.7)",
                  border: "1px solid rgba(212,175,106,0.35)",
                  color: "rgba(242,237,228,0.85)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  zIndex: 5,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,175,106,0.7)";
                  e.currentTarget.style.color = "#D4AF6A";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212,175,106,0.35)";
                  e.currentTarget.style.color = "rgba(242,237,228,0.85)";
                }}
                aria-label={
                  vistaPanel === "foto"
                    ? "Ver mapa de la sucursal"
                    : "Ver foto de la sucursal"
                }
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  {vistaPanel === "foto" ? "arrow_forward" : "arrow_back"}
                </span>
              </button>

              {vistaPanel === "foto" ? (
                <img
                  src={sucursal.foto.src}
                  alt={sucursal.foto.alt}
                  style={{
                    width: "100%",
                    height: "420px",
                    objectFit: "cover",
                    display: "block",
                    filter: "saturate(1.05) contrast(1.05)",
                  }}
                />
              ) : (
                <>
                  {[
                    {
                      top: 0,
                      left: 0,
                      borderTop: "1px solid #D4AF6A",
                      borderLeft: "1px solid #D4AF6A",
                    },
                    {
                      top: 0,
                      right: 0,
                      borderTop: "1px solid #D4AF6A",
                      borderRight: "1px solid #D4AF6A",
                    },
                    {
                      bottom: 0,
                      left: 0,
                      borderBottom: "1px solid #D4AF6A",
                      borderLeft: "1px solid #D4AF6A",
                    },
                    {
                      bottom: 0,
                      right: 0,
                      borderBottom: "1px solid #D4AF6A",
                      borderRight: "1px solid #D4AF6A",
                    },
                  ].map((s, i) => (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        width: "16px",
                        height: "16px",
                        zIndex: 2,
                        ...s,
                      }}
                    />
                  ))}

                  <iframe
                    key={mapKey}
                    src={sucursal.mapSrc}
                    width="100%"
                    height="420"
                    style={{
                      display: "block",
                      border: "none",
                      filter:
                        "sepia(0.15) saturate(1.1) contrast(1.03) brightness(0.95)",
                      pointerEvents: "none",
                    }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa sucursal ${sucursal.nombre}`}
                  />

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, transparent 70%, rgba(10,10,10,0.4) 100%)",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />
                </>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: "10px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "rgba(212,175,106,0.55)",
                  }}
                >
                  {vistaPanel === "foto"
                    ? "Foto de la sucursal"
                    : "Mapa de la sucursal"}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "rgba(212,175,106,0.35)",
                  }}
                >
                  {String(activa + 1).padStart(2, "0")} /{" "}
                  {String(total).padStart(2, "0")}
                </span>
              </div>
            </div>

            {vistaPanel === "mapa" && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0 0",
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "rgba(212,175,106,0.4)",
                  }}
                >
                  {sucursal.lat.toFixed(4)}°N{" "}
                  {Math.abs(sucursal.lng).toFixed(4)}
                  °O
                </span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${sucursal.lat},${sucursal.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "9px",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "rgba(212,175,106,0.5)",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#D4AF6A")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(212,175,106,0.5)")
                  }
                >
                  Abrir en Maps
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "12px" }}
                  >
                    open_in_new
                  </span>
                </a>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Sucursales;
