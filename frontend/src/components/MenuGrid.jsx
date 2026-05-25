import { useRef } from "react";
import MenuCard from "./MenuCard";

const productos = [
  // ENTRADAS
  {
    id: 1,
    categoria: "Entradas",
    nombre: "Gyoza de Wagyu",
    descripcion:
      "Selladas al vacío y terminadas al fuego con reducción de soja añeja y cebollino fino.",
    precio: "24.00",
    badge: "Signature",
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAor4gmM7cFq6L3SGwzR-JEoSuepOiyY0TAHmW9kupja2F82r_dkcongMXNxwATZ7YUyQKZjsj63FGJowPdi2Q6Gg4bLvNUeWUz41ZxrY8_yE6ErMtGUJAf4BEzwruh92udofgO_2USqVmEEVzqJi3cOfi9KUr-9-Jnm8wHQqWlX0r00KRgxIEhD_lVdYVI1UOxnIzHKrSl-mp7ryXB7-M1pqcQuMyraz1HiE3Yae6lv5Vh4HBZ05aHBkOM_ArYsJJr7lDKvDy2QEI",
  },
  {
    id: 2,
    categoria: "Entradas",
    nombre: "Tartar de Atún Rojo",
    descripcion:
      "Atún Bluefin con emulsión de chile serrano, aguacate y perlas de yuzu.",
    precio: "32.00",
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBcrEUp59Y6Jr6rpIOkRNCriiXUpvL20AhRXtKCh3q22rpNwNLYTUMIWWyG4YvoExM8EEe6Py01To4G9HxC9qxlEdDRC3OTPpKkyRoGKh45xHisOHkuEfadCFFhH0LACm38fIcbtbA8ow_MR1oN4rKr6nzYTSc_e0Ymxcz2ZXEyh_DydhdpgtNhvncgz8TLy7micTLZj4HqiQ7fpAq1JIl0OZF3E4jXYj2TtfgZTbVhQyrNYLXf_gr-R3u3tHEbqHwcannLfxFZqug",
  },
  {
    id: 3,
    categoria: "Entradas",
    nombre: "Rock Shrimp Tempura",
    descripcion:
      "Camarones de roca en tempura ligera con mayonesa de sriracha casera.",
    precio: "28.00",
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBroyZw0GdKer8PZb4I7NObpKMHzfcQ0JlCmOohCD2uIWNxOwYv2wrI2o2h_9R4WUy_qtyfyiWg8bGPtCoEgkyL26XvP_c9ig9IGxY_zNmBHNfL6pIKfD5mgLJ_UxQ2Otm0Dy2Myw6S0Elh6gYIof0Z1YsBasGAr-VF0P3wYMuY5fxI_SR84jC5rDdK2uxPK-mvEqePNUy7aRQSzgDP4aWw5jJD0IefH0Ik0fvO7cWeB86kr0t2aAYVE0KeAoSKH3ZbaxgRRtt_NPE",
  },
  {
    id: 4,
    categoria: "Entradas",
    nombre: "Edamames con Sal de Mar",
    descripcion:
      "Vainas de soja tiernas al vapor terminadas con escamas de sal Maldon.",
    precio: "12.00",
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD6ITmu3vmoWk-KfNP0RvAMioZqD4Cgont_sSbEn22Fhnd7mZeybm_t7VdRU-seG0nQX013bx7XJDvY2zJf5xcOlYiFzO1hgUAsJ6KMokp9tO1duifGNJwjyjQhfd04KGDP9EmqZMozM-qgUCk7RoqbsU0sbGIGv1RzjQ-TfjcsrlEsI3RgBtK6pjAXR0yyVoQWPd8dJFpJz7UFAFyF3rCm5UPtPL5Vn40apc97YkWmxqvXrXuxD-jzFc72BbVn94_XgXe0IefM_bg",
  },
  {
    id: 5,
    categoria: "Entradas",
    nombre: "Hamachi Jalapeño",
    descripcion:
      "Cortes finos de Hamachi con rodajas de jalapeño y salsa ponzu cítrica.",
    precio: "34.00",
    imagen:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop",
  },
  {
    id: 6,
    categoria: "Entradas",
    nombre: "Pork Belly Bao",
    descripcion:
      "Pan al vapor relleno de panza de cerdo braseada, pepino y salsa hoisin.",
    precio: "18.00",
    imagen:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDwSd-KDmXAIreefuHCou2o6UWpcPyOoNa0_O7b5Hdm_dUloHKJQVKN3jkU4IKJN3M6DYBIHb4q9OiNhOybGuqqekfKPU_ayrb0rHTrc4bStRk5PsNw4MoWx1KvgGSxBFKHpqXHZJimU3jKqG-aC6TxAp58iR5gSEgOAXAhgIh3F2hTOEmazccmDqaADSFGpoJzGNYJlbVvExPp9BwjukWLEbsVEzQN03Nw3v1Q1b6Y33p9vMhyUuMWSbXGQJBoYHEjML5DAl-4rvQ",
  },

  // SUSHI & SASHIMI
  {
    id: 7,
    categoria: "Sushi & Sashimi",
    nombre: "Nigiri de Toro",
    descripcion:
      "Corte de ventresca de atún sobre arroz de sushi avinagrado, terminado con ralladura de yuzu.",
    precio: "38.00",
    badge: "Chef's Pick",
    imagen:
      "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&h=400&fit=crop",
  },
  {
    id: 8,
    categoria: "Sushi & Sashimi",
    nombre: "Roll Oaxaca-Maki",
    descripcion:
      "Roll de cangrejo real, aguacate y chapulín tostado con mayonesa de mole negro.",
    precio: "29.00",
    badge: "Signature",
    imagen:
      "https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=400&h=400&fit=crop",
  },
  {
    id: 9,
    categoria: "Sushi & Sashimi",
    nombre: "Sashimi Mixto",
    descripcion:
      "Selección del día: salmón, hamachi y pez mantequilla en corte tradicional.",
    precio: "45.00",
    imagen:
      "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=400&fit=crop",
  },
  {
    id: 10,
    categoria: "Sushi & Sashimi",
    nombre: "Temaki de Camarón",
    descripcion:
      "Cono de alga nori con camarón tigre, pepino, aguacate y sriracha casera.",
    precio: "22.00",
    imagen:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=400&fit=crop",
  },

  // DUMPLINGS
  {
    id: 11,
    categoria: "Dumplings",
    nombre: "Xiao Long Bao",
    descripcion:
      "Bolsas de masa fina rellenas de cerdo y caldo concentrado de jengibre.",
    precio: "26.00",
    badge: "Signature",
    imagen:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop",
  },
  {
    id: 12,
    categoria: "Dumplings",
    nombre: "Har Gow de Langostino",
    descripcion:
      "Dumpling cantonés translúcido al vapor con langostino entero y aceite de sésamo.",
    precio: "24.00",
    imagen:
      "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=400&h=400&fit=crop",
  },
  {
    id: 13,
    categoria: "Dumplings",
    nombre: "Shumai de Wagyu",
    descripcion:
      "Abiertos al vapor con carne de res Wagyu, hongos shiitake y salsa de soja añeja.",
    precio: "28.00",
    imagen:
      "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=400&fit=crop",
  },

  // ESPECIALIDADES
  {
    id: 14,
    categoria: "Especialidades",
    nombre: "Ramen de Mole",
    descripcion:
      "Caldo de pollo 12 horas infusionado con mole negro oaxaqueño, chashu y huevo marinado.",
    precio: "52.00",
    badge: "Signature",
    imagen:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
  },
  {
    id: 15,
    categoria: "Especialidades",
    nombre: "Robata de Costilla",
    descripcion:
      "Costilla corta a la brasa sobre carbón de mezquite con glaseado de sake y chile pasilla.",
    precio: "68.00",
    imagen:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop",
  },
  {
    id: 16,
    categoria: "Especialidades",
    nombre: "Chirashi Oaxaqueño",
    descripcion:
      "Bowl de arroz con sashimi variado, chapulines, hoja de aguacate y vinagreta de yuzu.",
    precio: "58.00",
    badge: "Chef's Pick",
    imagen:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop",
  },

  // POSTRES
  {
    id: 17,
    categoria: "Postres",
    nombre: "Mochi de Chocolate Oaxaqueño",
    descripcion:
      "Mochi artesanal relleno de ganache de cacao 70% con sal de mar y polvo de matcha.",
    precio: "16.00",
    badge: "Signature",
    imagen:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop",
  },
  {
    id: 18,
    categoria: "Postres",
    nombre: "Helado de Té Hojicha",
    descripcion:
      "Helado artesanal de té tostado con caramelo de piloncillo y galleta de sésamo.",
    precio: "14.00",
    imagen:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop",
  },
  {
    id: 19,
    categoria: "Postres",
    nombre: "Taiyaki de Crema",
    descripcion:
      "Waffle en forma de pez relleno de crema pastelera de vainilla con coulis de tamarindo.",
    precio: "18.00",
    imagen:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop",
  },
  // ENTRADAS — nuevos
  {
    id: 20,
    categoria: "Entradas",
    nombre: "Tataki de Res",
    descripcion:
      "Lomo de res sellado al fuego, cortado fino con vinagreta de ponzu y cebolla morada encurtida.",
    precio: "36.00",
    imagen:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=400&fit=crop",
  },
  {
    id: 21,
    categoria: "Entradas",
    nombre: "Ensalada Wakame",
    descripcion:
      "Alga marina marinada con aceite de sésamo, chile de árbol y ajonjolí tostado.",
    precio: "14.00",
    imagen:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop",
  },
  {
    id: 22,
    categoria: "Entradas",
    nombre: "Karaage de Pollo",
    descripcion:
      "Trozos de muslo de pollo marinados en sake y jengibre, fritos en aceite de cártamo.",
    precio: "22.00",
    imagen:
      "https://images.unsplash.com/photo-1562802378-063ec186a863?w=400&h=400&fit=crop",
  },

  // SUSHI & SASHIMI — nuevos
  {
    id: 23,
    categoria: "Sushi & Sashimi",
    nombre: "Uramaki de Salmón",
    descripcion:
      "Roll invertido de salmón ahumado, queso crema y pepino con cobertura de aguacate.",
    precio: "32.00",
    imagen:
      "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=400&h=400&fit=crop",
  },
  {
    id: 24,
    categoria: "Sushi & Sashimi",
    nombre: "Gunkan de Erizo",
    descripcion:
      "Barca de alga nori con erizo de mar fresco y salsa de soja reducida al mirin.",
    precio: "55.00",
    badge: "Chef's Pick",
    imagen:
      "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=400&fit=crop",
  },
  {
    id: 25,
    categoria: "Sushi & Sashimi",
    nombre: "Sashimi de Salmón Sellado",
    descripcion:
      "Salmón atlántico sellado con soplete, sal negra y aceite de oliva de primera extracción.",
    precio: "42.00",
    imagen:
      "https://images.unsplash.com/photo-1534482421-64566f976cfa?w=400&h=400&fit=crop",
  },

  // DUMPLINGS — nuevos
  {
    id: 26,
    categoria: "Dumplings",
    nombre: "Gyoza de Camarón",
    descripcion:
      "Dumpling frito-vapor relleno de camarón, cilantro y jengibre fresco con salsa ponzu.",
    precio: "24.00",
    imagen:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&fit=crop",
  },
  {
    id: 27,
    categoria: "Dumplings",
    nombre: "Wontons en Aceite Rojo",
    descripcion:
      "Wontons de cerdo y camarón en aceite de chile sichuan con ajo negro y cebollín.",
    precio: "22.00",
    badge: "Signature",
    imagen:
      "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?w=400&h=400&fit=crop",
  },
  {
    id: 28,
    categoria: "Dumplings",
    nombre: "Baozi de Pato",
    descripcion:
      "Pan al vapor esponjoso relleno de pato confitado, ciruela china y cebolla cambray.",
    precio: "28.00",
    imagen:
      "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=400&fit=crop",
  },

  // ESPECIALIDADES — nuevos
  {
    id: 29,
    categoria: "Especialidades",
    nombre: "Tonkotsu Negro",
    descripcion:
      "Caldo de hueso de cerdo 18 horas con tinta de calamar, noodles caseros y chashu ahumado.",
    precio: "58.00",
    badge: "Signature",
    imagen:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
  },
  {
    id: 30,
    categoria: "Especialidades",
    nombre: "Yakitori de Codorniz",
    descripcion:
      "Brochetas de codorniz a la brasa con glaseado tare de soja añeja y shichimi togarashi.",
    precio: "46.00",
    imagen:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=400&fit=crop",
  },
  {
    id: 31,
    categoria: "Especialidades",
    nombre: "Donburi de Wagyu",
    descripcion:
      "Bowl de arroz japonés con corte de Wagyu en teriyaki casero, huevo onsen y dashi.",
    precio: "72.00",
    badge: "Chef's Pick",
    imagen:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
  },

  // POSTRES — nuevos
  {
    id: 32,
    categoria: "Postres",
    nombre: "Dorayaki de Cajeta",
    descripcion:
      "Panquecitos japoneses rellenos de cajeta oaxaqueña y pasta de frijol rojo.",
    precio: "16.00",
    imagen:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop",
  },
  {
    id: 33,
    categoria: "Postres",
    nombre: "Parfait de Matcha",
    descripcion:
      "Capas de helado de matcha, granola de sésamo, gelatina de yuzu y crema batida.",
    precio: "18.00",
    imagen:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop",
  },
  {
    id: 34,
    categoria: "Postres",
    nombre: "Churros Mochi",
    descripcion:
      "Churros de masa mochi con azúcar de canela y dip de chocolate negro con miso.",
    precio: "20.00",
    badge: "Signature",
    imagen:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop",
  },
];

const categorias = [
  "Entradas",
  "Sushi & Sashimi",
  "Dumplings",
  "Especialidades",
  "Postres",
];

function CarruselSeccion({ categoria, items, onAgregar }) {
  const carruselRef = useRef(null);
  const cardStep = 280;

  const handleScroll = (dir) => {
    if (!carruselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carruselRef.current;
    const maxScrollLeft = Math.max(scrollWidth - clientWidth, 0);

    if (dir > 0 && scrollLeft + clientWidth + 2 >= scrollWidth) {
      carruselRef.current.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    if (dir < 0 && scrollLeft <= 2) {
      carruselRef.current.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      return;
    }

    carruselRef.current.scrollBy({ left: dir * cardStep, behavior: "smooth" });
  };

  return (
    <div className="mb-16">
      {/* Header de sección */}
      <div className="flex items-center gap-6 mb-4">
        <div
          className="h-px flex-grow"
          style={{ background: "rgba(212, 175, 106, 0.15)" }}
        />
        <span
          className="font-['JetBrains_Mono'] text-[10px] uppercase tracking-[0.3em]"
          style={{ color: "rgba(212, 175, 106, 0.5)" }}
        >
          {items.length} platillos
        </span>
        <div
          className="h-px flex-grow"
          style={{ background: "rgba(212, 175, 106, 0.15)" }}
        />
      </div>

      <h2
        className="font-['Outfit'] text-[32px] mb-6"
        style={{ color: "#F2EDE4", fontWeight: 400 }}
      >
        {categoria}
      </h2>

      {/* Carrusel con flechas */}
      <div
        className="relative overflow-visible"
        style={{ maxWidth: "1120px", margin: "0 auto" }}
      >
        <button
          type="button"
          aria-label="Anterior"
          onClick={() => handleScroll(-1)}
          className="absolute left-0 top-1/2 -translate-x-[120%] -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-[#D4AF6A]/40 bg-[#141414]/90 text-[#D4AF6A] shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-colors hover:border-[#D4AF6A] hover:bg-[#1a1a1a]"
        >
          &#8592;
        </button>
        <button
          type="button"
          aria-label="Siguiente"
          onClick={() => handleScroll(1)}
          className="absolute right-0 top-1/2 translate-x-[70%] -translate-y-1/2 z-20 h-10 w-10 rounded-full border border-[#D4AF6A]/40 bg-[#141414]/90 text-[#D4AF6A] shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-colors hover:border-[#D4AF6A] hover:bg-[#1a1a1a]"
        >
          &#8594;
        </button>

        <div
          ref={carruselRef}
          className="carrusel flex flex-nowrap gap-5 overflow-x-auto overflow-y-visible py-3"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
        >
          {items.map((producto) => (
            <div
              key={producto.id}
              className="flex-shrink-0"
              style={{
                width: "260px",
                scrollSnapAlign: "start",
              }}
            >
              <MenuCard {...producto} onAgregar={() => onAgregar(producto)} />
            </div>
          ))}

          {/* Espaciado final para que la última tarjeta no quede pegada al borde */}
          <div className="flex-shrink-0" style={{ width: "1px" }} />
        </div>
      </div>

      {/* Indicador de scroll */}
      <div className="flex items-center gap-2 mt-3">
        <div
          className="h-px flex-grow"
          style={{ background: "rgba(212, 175, 106, 0.08)" }}
        />
        <span
          className="font-['JetBrains_Mono'] text-[9px] uppercase tracking-widest"
          style={{ color: "rgba(212, 175, 106, 0.3)" }}
        >
          desliza →
        </span>
      </div>
    </div>
  );
}

function MenuGrid({ categoriaActiva, onAgregar }) {
  const categoriasFiltradas = categorias;

  return (
    <main
      className="flex-grow min-h-screen px-[clamp(16px,4vw,40px)] py-[40px]"
      style={{ background: "rgb(16,16,16)" }}
    >
      {/* Header */}
      <header className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <h1
            className="font-['Outfit'] text-[40px] uppercase leading-tight"
            style={{ color: "#9B2335", fontWeight: 600 }}
          >
            {categoriaActiva}
          </h1>
          <span
            className="font-['JetBrains_Mono'] text-[12px] tracking-widest"
            style={{ color: "rgba(212, 175, 106, 0.5)" }}
          >
            FILTRAR POR PREFERENCIA
          </span>
        </div>
        <div
          className="h-px w-full"
          style={{ background: "rgba(212, 175, 106, 0.15)" }}
        />
      </header>

      {/* Secciones con carrusel */}
      {categoriasFiltradas.map((cat) => {
        const items = productos.filter((p) => p.categoria === cat);
        if (items.length === 0) return null;
        return (
          <CarruselSeccion
            key={cat}
            categoria={cat}
            items={items}
            onAgregar={onAgregar}
          />
        );
      })}
    </main>
  );
}

export default MenuGrid;
