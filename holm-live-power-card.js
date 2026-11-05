/* holm-live-power-card — https://github.com/kaaribou/holm-live-power-card — licence MIT — v1.1.0 */
// HOLM Live Power Card — la puissance de chaque appareil en direct, groupée, animée, entièrement réglable dans l'éditeur visuel.
// Config :
//   type: custom:holm-live-power-card
//   title: Consommations en direct
//   sort: power            # power (tri en direct) | none (ordre de l'éditeur)
//   idle: show             # show | dim | hide (appareils au repos)
//   idle_threshold: 2      # W : en dessous, l'appareil est « au repos »
//   style: fill            # fill (ligne remplie) | bar (barre sous le nom)
//   color: gradient        # gradient (vert → rouge) | level (couleur selon le niveau) | accent
//   columns: auto          # auto | 1 | 2 (groupes côte à côte)
//   show_total / show_sparkline / show_energy: true
//   sparkline_hours: 3
//   total_entity: sensor.xxx   # facultatif : consommation totale de la maison (part mesurée)
//   groups:
//     - name: Autres consommations
//       icon: mdi:chart-histogram
//       devices:
//         - entity: sensor.chauffe_eau_power
//           name: Chauffe-eau
//           icon: mdi:water-boiler
//           max: 2500             # facultatif : sinon le pic des 7 derniers jours
//           energy: sensor.xxx    # facultatif : sinon trouvé sur le même appareil
(() => {
  const VERSION = "1.1.0";
  const LANGS = ["fr", "en", "de", "es", "it", "nl", "pt", "pl"];
  // clé = texte français ; valeurs = en, de, es, it, nl, pt, pl
  const T = {
    "Consommations en direct": ["Live consumption", "Live-Verbrauch", "Consumo en directo", "Consumi in diretta", "Live verbruik", "Consumo em direto", "Zużycie na żywo"],
    "en marche": ["running", "aktiv", "en marcha", "in funzione", "actief", "em funcionamento", "pracuje"],
    "au repos": ["idle", "im Ruhezustand", "en reposo", "a riposo", "in rust", "em repouso", "bezczynne"],
    "aujourd'hui": ["today", "heute", "hoy", "oggi", "vandaag", "hoje", "dziś"],
    "de la maison": ["of the home", "des Hauses", "de la casa", "della casa", "van het huis", "da casa", "domu"],
    "Non mesuré": ["Not measured", "Nicht gemessen", "No medido", "Non misurato", "Niet gemeten", "Não medido", "Niezmierzone"],
    "Total mesuré": ["Measured total", "Gemessene Summe", "Total medido", "Totale misurato", "Gemeten totaal", "Total medido", "Suma zmierzona"],
    "Ajoutez des appareils dans l'éditeur de la carte.": ["Add devices in the card editor.", "Fügen Sie im Karteneditor Geräte hinzu.", "Añade dispositivos en el editor de la tarjeta.", "Aggiungi dispositivi nell'editor della scheda.", "Voeg apparaten toe in de kaarteditor.", "Adicione dispositivos no editor do cartão.", "Dodaj urządzenia w edytorze karty."],
    "Puissance": ["Power", "Leistung", "Potencia", "Potenza", "Vermogen", "Potência", "Moc"],
    "Actuelle": ["Current", "Aktuell", "Actual", "Attuale", "Huidig", "Atual", "Obecna"],
    "Min": ["Min", "Min", "Mín", "Min", "Min", "Mín", "Min"],
    "Max": ["Max", "Max", "Máx", "Max", "Max", "Máx", "Maks"],
    "Moyenne": ["Average", "Mittelwert", "Media", "Media", "Gemiddeld", "Média", "Średnia"],
    "Énergie": ["Energy", "Energie", "Energía", "Energia", "Energie", "Energia", "Energia"],
    "En marche": ["Running", "In Betrieb", "En marcha", "In funzione", "Actief", "Em funcionamento", "Praca"],
    "Fermer": ["Close", "Schließen", "Cerrar", "Chiudi", "Sluiten", "Fechar", "Zamknij"],
    "Historique": ["History", "Verlauf", "Historial", "Cronologia", "Geschiedenis", "Histórico", "Historia"],
    "Chargement…": ["Loading…", "Wird geladen…", "Cargando…", "Caricamento…", "Laden…", "A carregar…", "Ładowanie…"],
    "Pas d'historique : ce capteur est exclu de l'enregistreur (recorder) de Home Assistant.": ["No history: this sensor is excluded from the Home Assistant recorder.", "Kein Verlauf: Dieser Sensor ist vom Recorder von Home Assistant ausgeschlossen.", "Sin historial: este sensor está excluido del registrador (recorder) de Home Assistant.", "Nessuna cronologia: questo sensore è escluso dal recorder di Home Assistant.", "Geen geschiedenis: deze sensor is uitgesloten van de recorder van Home Assistant.", "Sem histórico: este sensor está excluído do registador (recorder) do Home Assistant.", "Brak historii: ten czujnik jest wykluczony z rejestratora (recorder) Home Assistant."],
    "Pas de données sur cette période": ["No data for this period", "Keine Daten in diesem Zeitraum", "Sin datos en este periodo", "Nessun dato per questo periodo", "Geen gegevens voor deze periode", "Sem dados neste período", "Brak danych w tym okresie"],
    "6 h": ["6 h", "6 Std", "6 h", "6 h", "6 u", "6 h", "6 h"], "24 h": ["24 h", "24 Std", "24 h", "24 h", "24 u", "24 h", "24 h"], "48 h": ["48 h", "48 Std", "48 h", "48 h", "48 u", "48 h", "48 h"],
    "7 j": ["7 d", "7 T", "7 d", "7 g", "7 d", "7 d", "7 d"],
    "max": ["max", "max", "máx", "max", "max", "máx", "maks"],
    "Appareils": ["Devices", "Geräte", "Dispositivos", "Dispositivi", "Apparaten", "Dispositivos", "Urządzenia"],
    "Tous au repos": ["All idle", "Alle im Ruhezustand", "Todos en reposo", "Tutti a riposo", "Alles in rust", "Todos em repouso", "Wszystkie bezczynne"],
    // éditeur
    "Titre": ["Title", "Titel", "Título", "Titolo", "Titel", "Título", "Tytuł"],
    "Langue": ["Language", "Sprache", "Idioma", "Lingua", "Taal", "Idioma", "Język"],
    "Automatique (profil)": ["Automatic (profile)", "Automatisch (Profil)", "Automático (perfil)", "Automatica (profilo)", "Automatisch (profiel)", "Automático (perfil)", "Automatycznie (profil)"],
    "Tri": ["Sort", "Sortierung", "Orden", "Ordinamento", "Sortering", "Ordenação", "Sortowanie"],
    "Par puissance, en direct": ["By power, live", "Nach Leistung, live", "Por potencia, en directo", "Per potenza, in diretta", "Op vermogen, live", "Por potência, em direto", "Według mocy, na żywo"],
    "Ordre de l'éditeur": ["Editor order", "Reihenfolge des Editors", "Orden del editor", "Ordine dell'editor", "Volgorde van de editor", "Ordem do editor", "Kolejność z edytora"],
    "Appareils au repos": ["Idle devices", "Geräte im Ruhezustand", "Dispositivos en reposo", "Dispositivi a riposo", "Apparaten in rust", "Dispositivos em repouso", "Urządzenia bezczynne"],
    "Afficher": ["Show", "Anzeigen", "Mostrar", "Mostra", "Tonen", "Mostrar", "Pokaż"],
    "Atténuer": ["Dim", "Abblenden", "Atenuar", "Attenua", "Dimmen", "Atenuar", "Przyciemnij"],
    "Masquer": ["Hide", "Ausblenden", "Ocultar", "Nascondi", "Verbergen", "Ocultar", "Ukryj"],
    "Seuil de repos (W)": ["Idle threshold (W)", "Ruheschwelle (W)", "Umbral de reposo (W)", "Soglia di riposo (W)", "Rustdrempel (W)", "Limiar de repouso (W)", "Próg bezczynności (W)"],
    "Style des lignes": ["Row style", "Zeilenstil", "Estilo de las filas", "Stile delle righe", "Rijstijl", "Estilo das linhas", "Styl wierszy"],
    "Ligne remplie": ["Filled row", "Gefüllte Zeile", "Fila rellena", "Riga riempita", "Gevulde rij", "Linha preenchida", "Wypełniony wiersz"],
    "Barre sous le nom": ["Bar under the name", "Balken unter dem Namen", "Barra bajo el nombre", "Barra sotto il nome", "Balk onder de naam", "Barra sob o nome", "Pasek pod nazwą"],
    "Couleurs": ["Colours", "Farben", "Colores", "Colori", "Kleuren", "Cores", "Kolory"],
    "Dégradé vert → rouge": ["Green → red gradient", "Verlauf grün → rot", "Degradado verde → rojo", "Sfumatura verde → rosso", "Verloop groen → rood", "Gradiente verde → vermelho", "Gradient zielony → czerwony"],
    "Selon le niveau": ["By level", "Nach Stufe", "Según el nivel", "In base al livello", "Volgens niveau", "Conforme o nível", "Według poziomu"],
    "Couleur d'accent": ["Accent colour", "Akzentfarbe", "Color de acento", "Colore d'accento", "Accentkleur", "Cor de destaque", "Kolor akcentu"],
    "Colonnes": ["Columns", "Spalten", "Columnas", "Colonne", "Kolommen", "Colunas", "Kolumny"],
    "Automatique": ["Automatic", "Automatisch", "Automático", "Automatico", "Automatisch", "Automático", "Automatycznie"],
    "Afficher le total": ["Show the total", "Summe anzeigen", "Mostrar el total", "Mostra il totale", "Totaal tonen", "Mostrar o total", "Pokaż sumę"],
    "Mini-courbes": ["Sparklines", "Mini-Kurven", "Mini curvas", "Mini curve", "Mini-grafieken", "Mini curvas", "Mini wykresy"],
    "kWh du jour": ["Today's kWh", "kWh heute", "kWh de hoy", "kWh di oggi", "kWh vandaag", "kWh de hoje", "kWh dzisiaj"],
    "Heures des mini-courbes": ["Sparkline hours", "Stunden der Mini-Kurven", "Horas de las mini curvas", "Ore delle mini curve", "Uren van de mini-grafieken", "Horas das mini curvas", "Godziny mini wykresów"],
    "Consommation totale de la maison (facultatif)": ["Total home consumption (optional)", "Gesamtverbrauch des Hauses (optional)", "Consumo total de la casa (opcional)", "Consumo totale della casa (facoltativo)", "Totaal verbruik van het huis (optioneel)", "Consumo total da casa (opcional)", "Całkowite zużycie domu (opcjonalnie)"],
    "Animations": ["Animations", "Animationen", "Animaciones", "Animazioni", "Animaties", "Animações", "Animacje"],
    "Groupes": ["Groups", "Gruppen", "Grupos", "Gruppi", "Groepen", "Grupos", "Grupy"],
    "Nouveau groupe": ["New group", "Neue Gruppe", "Nuevo grupo", "Nuovo gruppo", "Nieuwe groep", "Novo grupo", "Nowa grupa"],
    "Nom du groupe": ["Group name", "Gruppenname", "Nombre del grupo", "Nome del gruppo", "Groepsnaam", "Nome do grupo", "Nazwa grupy"],
    "Icône": ["Icon", "Symbol", "Icono", "Icona", "Pictogram", "Ícone", "Ikona"],
    "Capteur de puissance (W)": ["Power sensor (W)", "Leistungssensor (W)", "Sensor de potencia (W)", "Sensore di potenza (W)", "Vermogenssensor (W)", "Sensor de potência (W)", "Czujnik mocy (W)"],
    "Nom affiché": ["Display name", "Anzeigename", "Nombre mostrado", "Nome visualizzato", "Weergavenaam", "Nome apresentado", "Wyświetlana nazwa"],
    "Puissance max (W, auto si vide)": ["Max power (W, auto if empty)", "Max. Leistung (W, automatisch wenn leer)", "Potencia máx. (W, automática si está vacío)", "Potenza max (W, automatica se vuota)", "Max. vermogen (W, automatisch indien leeg)", "Potência máx. (W, automática se vazio)", "Moc maks. (W, automatycznie, jeśli puste)"],
    "Compteur d'énergie (auto si vide)": ["Energy meter (auto if empty)", "Energiezähler (automatisch wenn leer)", "Contador de energía (automático si está vacío)", "Contatore di energia (automatico se vuoto)", "Energiemeter (automatisch indien leeg)", "Contador de energia (automático se vazio)", "Licznik energii (automatycznie, jeśli puste)"],
    "Interrupteur (facultatif)": ["Switch (optional)", "Schalter (optional)", "Interruptor (opcional)", "Interruttore (facoltativo)", "Schakelaar (optioneel)", "Interruptor (opcional)", "Przełącznik (opcjonalnie)"],
    "Couleur (facultatif)": ["Colour (optional)", "Farbe (optional)", "Color (opcional)", "Colore (facoltativo)", "Kleur (optioneel)", "Cor (opcional)", "Kolor (opcjonalnie)"],
    "Groupe": ["Group", "Gruppe", "Grupo", "Gruppo", "Groep", "Grupo", "Grupa"],
    "Ajouter un appareil": ["Add a device", "Gerät hinzufügen", "Añadir un dispositivo", "Aggiungi un dispositivo", "Apparaat toevoegen", "Adicionar dispositivo", "Dodaj urządzenie"],
    "Ajouter un groupe": ["Add a group", "Gruppe hinzufügen", "Añadir un grupo", "Aggiungi un gruppo", "Groep toevoegen", "Adicionar grupo", "Dodaj grupę"],
    "Importer du tableau Énergie": ["Import from the Energy dashboard", "Aus dem Energie-Dashboard importieren", "Importar del panel de Energía", "Importa dalla dashboard Energia", "Importeren uit het Energie-dashboard", "Importar do painel de Energia", "Importuj z panelu Energia"],
    "Tableau Énergie": ["Energy dashboard", "Energie-Dashboard", "Panel de Energía", "Dashboard Energia", "Energie-dashboard", "Painel de Energia", "Panel Energia"],
    "Rien de nouveau à importer": ["Nothing new to import", "Nichts Neues zu importieren", "Nada nuevo que importar", "Niente di nuovo da importare", "Niets nieuws om te importeren", "Nada de novo para importar", "Brak nowych do zaimportowania"],
    "Nouvel appareil": ["New device", "Neues Gerät", "Nuevo dispositivo", "Nuovo dispositivo", "Nieuw apparaat", "Novo dispositivo", "Nowe urządzenie"],
    "choisissez un capteur": ["choose a sensor", "Sensor wählen", "elige un sensor", "scegli un sensore", "kies een sensor", "escolha um sensor", "wybierz czujnik"],
    "Monter": ["Move up", "Nach oben", "Subir", "Sposta su", "Omhoog", "Mover para cima", "W górę"],
    "Descendre": ["Move down", "Nach unten", "Bajar", "Sposta giù", "Omlaag", "Mover para baixo", "W dół"],
    "Supprimer": ["Delete", "Löschen", "Eliminar", "Elimina", "Verwijderen", "Eliminar", "Usuń"],
    "Affichage": ["Display", "Anzeige", "Visualización", "Visualizzazione", "Weergave", "Visualização", "Wyświetlanie"],
    "HOLM – Puissance en direct": ["HOLM – Live power", "HOLM – Live-Leistung", "HOLM – Potencia en directo", "HOLM – Potenza in diretta", "HOLM – Live vermogen", "HOLM – Potência em direto", "HOLM – Moc na żywo"],
    "La puissance de chaque appareil en direct, par groupes, animée": ["Each device's live power, in groups, animated", "Live-Leistung jedes Geräts, in Gruppen, animiert", "La potencia de cada dispositivo en directo, por grupos, animada", "La potenza di ogni dispositivo in diretta, per gruppi, animata", "Live vermogen per apparaat, in groepen, geanimeerd", "A potência de cada dispositivo em direto, por grupos, animada", "Moc każdego urządzenia na żywo, w grupach, animowana"],
  };
  const langOf = (hass, c) => { const l = String((c && c.language) || hass?.locale?.language || hass?.language || navigator.language || "en").toLowerCase().split(/[-_]/)[0]; return LANGS.includes(l) ? l : "en"; };
  const tr = (l, s) => (l === "fr" ? s : (T[s] && T[s][LANGS.indexOf(l) - 1]) || s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (v) => { const n = parseFloat(v); return isFinite(n) ? n : null; };
  const RANGES = [["6h", 6, "6 h"], ["24h", 24, "24 h"], ["48h", 48, "48 h"], ["7d", 168, "7 j"]];
  const SPIN = /fan|air-filter|air-purifier|hvac|turbine|pump|ventilat|washing-machine|tumble-dryer|dishwasher|robot-vacuum/;
  const PAL = ["#22d3ee", "#a78bfa", "#f472b6", "#84cc16", "#fb923c", "#38bdf8", "#facc15", "#34d399", "#f87171", "#c084fc", "#2dd4bf", "#fbbf24"];
  const ls = { get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (_) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* rien */ } } };
  // couleur d'un niveau 0..1 : vert → jaune → rouge (comme les anciennes cartes)
  const levelColor = (p) => { const s = [[0, [46, 204, 113]], [0.5, [241, 196, 15]], [1, [231, 76, 60]]]; p = Math.max(0, Math.min(1, p));
    const i = p <= 0.5 ? 0 : 1; const [a, ca] = s[i], [b, cb] = s[i + 1]; const k = (p - a) / (b - a);
    return `rgb(${ca.map((v, j) => Math.round(v + (cb[j] - v) * k)).join(",")})`; };

  class HolmLivePowerCard extends HTMLElement {
    static getConfigElement() { return document.createElement("holm-live-power-card-editor"); }
    static getStubConfig(hass) {
      const ids = Object.keys(hass?.states || {}).filter((e) => e.startsWith("sensor.") && hass.states[e].attributes.device_class === "power").slice(0, 4);
      return { groups: [{ name: "", devices: ids.map((entity) => ({ entity })) }] };
    }
    setConfig(c) {
      if (!c) throw new Error("holm-live-power-card : configuration invalide");
      const groups = (Array.isArray(c.groups) && c.groups.length ? c.groups : [{ name: "", devices: c.devices || [] }])
        .map((g) => ({ ...g, devices: (g.devices || []).filter((d) => d && d.entity) }));
      this._c = { sort: "power", idle: "show", idle_threshold: 2, style: "fill", color: "gradient", columns: "auto",
        show_total: true, show_sparkline: true, show_energy: true, sparkline_hours: 3, animation: true, ...c, groups };
      this._key = "holm-lp-" + (c.title || "") + "-" + groups.map((g) => g.name).join("|");
      this._collapsed = new Set(ls.get(this._key) || []);
      this._shown = {};
      this._spark = {}; this._peak = {}; this._today = {};
      this._built = false;
      this._histAt = 0;
      if (this.shadowRoot && this._hass) { this._build(); this._update(true); this._loadHistory(); }
    }
    set hass(h) {
      this._hass = h;
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      if (!this._built) this._build();
      this._update();
      if (Date.now() - this._histAt > 5 * 60000) this._loadHistory();
    }
    connectedCallback() {
      clearInterval(this._tick);
      this._tick = setInterval(() => { if (this._hass) this._loadHistory(); }, 5 * 60000);
    }
    disconnectedCallback() { clearInterval(this._tick); cancelAnimationFrame(this._raf); }
    getCardSize() { return 2 + this._c.groups.reduce((n, g) => n + g.devices.length, 0); }
    getGridOptions() { return { columns: 12, rows: "auto", min_columns: 4 }; }

    get _l() { return langOf(this._hass, this._c); }
    _t(s) { return tr(this._l, s); }
    _nf(v, d = 0) { return new Intl.NumberFormat(this._hass?.locale?.language || this._l, { minimumFractionDigits: d, maximumFractionDigits: d }).format(v); }
    _w(w) { const a = Math.abs(w || 0); return a >= 1000 ? `${this._nf(a / 1000, a >= 10000 ? 1 : 2)} kW` : `${this._nf(a, a < 10 && a % 1 ? 1 : 0)} W`; }
    _power(e) {
      const s = this._hass?.states[e]; if (!s) return null;
      let v = num(s.state); if (v === null) return null;
      const u = String(s.attributes.unit_of_measurement || "W");
      if (u === "kW") v *= 1000; else if (u === "MW") v *= 1e6;
      return Math.max(0, v);
    }
    _devs() { const out = []; this._c.groups.forEach((g, gi) => g.devices.forEach((d, di) => out.push({ ...d, gi, di, k: `${gi}-${di}`, color: d.color || PAL[out.length % PAL.length] }))); return out; }
    _name(d) { return d.name || this._hass?.states[d.entity]?.attributes.friendly_name || d.entity; }
    _icon(d) { return d.icon || this._hass?.states[d.entity]?.attributes.icon || "mdi:flash"; }
    _max(d) { const m = num(d.max); if (m) return m; const p = this._peak[d.entity]; return p ? this._niceMax(p) : Math.max(100, (this._power(d.entity) || 0) * 1.25); }
    _niceMax(v) { if (v <= 10) return 10; const p = Math.pow(10, Math.floor(Math.log10(v))); return ([1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((x) => v / p <= x) || 10) * p; }
    _energyEntity(d) {
      if (d.energy) return d.energy;
      const ents = this._hass?.entities || {};
      const dev = ents[d.entity]?.device_id;
      if (!dev) return null;
      for (const e of Object.values(ents)) {
        if (e.device_id !== dev || !e.entity_id.startsWith("sensor.")) continue;
        const a = this._hass.states[e.entity_id]?.attributes;
        if (a?.device_class === "energy" && (a.state_class === "total_increasing" || a.state_class === "total")) return e.entity_id;
      }
      return null;
    }

    // ───────────── structure (construite une fois par configuration) ─────────────
    _build() {
      if (!this.shadowRoot || !this._hass) return;
      const c = this._c;
      const anim = c.animation !== false;
      const cols = c.columns === "1" || c.columns === 1 ? "1fr" : c.columns === "2" || c.columns === 2 ? "repeat(2, minmax(0, 1fr))" : "repeat(auto-fit, minmax(290px, 1fr))";
      const any = c.groups.some((g) => g.devices.length);
      this.shadowRoot.innerHTML = `<style>${STYLE}</style>
        <ha-card class="${anim ? "anim" : ""} st-${esc(c.style)} co-${esc(c.color)} idle-${esc(c.idle)}">
          ${c.title !== "" || c.show_total !== false ? `
          <div class="hdr">
            <div class="ht"><span class="logo"><ha-icon icon="mdi:lightning-bolt"></ha-icon></span>
              <div class="htx"><span class="ttl">${esc(c.title ?? this._t("Consommations en direct"))}</span><span class="cnt" id="cnt"></span></div>
              ${c.show_total !== false ? `<div class="tot"><b id="tot">0 W</b><small id="totsub"></small></div>` : ""}
            </div>
            ${c.show_total !== false ? `<div class="share" id="share"></div><div class="top" id="top"></div>` : ""}
          </div>` : ""}
          ${!any ? `<div class="msg">${this._t("Ajoutez des appareils dans l'éditeur de la carte.")}</div>` : ""}
          <div class="groups" style="grid-template-columns:${cols}">
            ${c.groups.map((g, gi) => g.devices.length ? `
              <section class="grp ${this._collapsed.has(gi) ? "closed" : ""}" data-g="${gi}">
                ${g.name || c.groups.length > 1 ? `<button class="gh" data-act="toggle" data-g="${gi}">
                  ${g.icon ? `<ha-icon icon="${esc(g.icon)}"></ha-icon>` : ""}<span class="gn">${esc(g.name || this._t("Appareils"))}</span>
                  <span class="gt" data-gt="${gi}"></span><ha-icon class="chev" icon="mdi:chevron-down"></ha-icon></button>` : ""}
                <div class="rows" data-rows="${gi}">
                  ${g.devices.map((d, di) => this._rowHtml({ ...d, gi, di, k: `${gi}-${di}` })).join("")}
                  <div class="allidle" data-allidle="${gi}" hidden>${this._t("Tous au repos")}</div>
                </div>
              </section>` : "").join("")}
          </div>
        </ha-card>`;
      this.shadowRoot.querySelector("ha-card").addEventListener("click", (e) => this._onClick(e));
      this._rows = {};
      this.shadowRoot.querySelectorAll(".row").forEach((r) => { this._rows[r.dataset.k] = r; });
      this._built = true;
      this._sig = "";
    }
    _rowHtml(d) {
      const icon = this._icon(d);
      return `<div class="row" data-k="${d.k}" data-entity="${esc(d.entity)}" style="--dc:${esc(d.color || "")}">
        <div class="fill"><i class="grad"></i><i class="shine"></i></div>
        <span class="ic${SPIN.test(icon) ? " spin" : ""}"><ha-icon icon="${esc(icon)}"></ha-icon></span>
        <div class="tx"><span class="nm">${esc(this._name(d))}</span><span class="sub"></span><div class="mbar"><i></i></div></div>
        ${this._c.show_sparkline !== false ? `<svg class="spark" viewBox="0 0 100 30" preserveAspectRatio="none"><path class="sa"/><path class="sl"/></svg>` : ""}
        <span class="val">—</span>
      </div>`;
    }

    // ───────────── mise à jour en direct (sans reconstruire) ─────────────
    _update(force) {
      if (!this._built || !this._hass) return;
      const devs = this._devs();
      const vals = devs.map((d) => this._power(d.entity));
      const sig = vals.join("|") + JSON.stringify(this._today) + (this._sparkAt || 0) + (this._peakAt || 0);
      if (!force && sig === this._sig) return;
      this._sig = sig;
      const thr = num(this._c.idle_threshold) ?? 2;
      let total = 0, active = 0;
      const gTot = {};
      const items = [];
      devs.forEach((d, i) => {
        const r = this._rows[d.k]; if (!r) return;
        const v = vals[i], on = v !== null && v > thr;
        if (v !== null) { total += v; gTot[d.gi] = (gTot[d.gi] || 0) + v; }
        if (on) active++;
        items.push({ d, v: v ?? 0, on });
        const max = this._max(d), p = Math.max(0, Math.min(1, (v || 0) / max));
        r.classList.toggle("on", on);
        r.classList.toggle("na", v === null);
        r.style.setProperty("--p", (p * 100).toFixed(2) + "%");
        r.style.setProperty("--lc", levelColor(p));
        r.style.setProperty("--speed", (2.6 - 1.8 * p).toFixed(2) + "s");
        const sub = r.querySelector(".sub");
        const e = this._today[d.entity];
        const subTxt = this._c.show_energy !== false && e !== undefined ? `${this._nf(e, e >= 10 ? 1 : 2)} kWh ${this._t("aujourd'hui")}` : "";
        if (sub.textContent !== subTxt) sub.textContent = subTxt;
        r.title = `${this._name(d)} — ${v === null ? "?" : this._w(v)} / ${this._t("max")} ${this._w(max)}`;
        this._tween(r.querySelector(".val"), d.k, v);
        if (this._c.show_sparkline !== false) this._drawSpark(r, d, max);
      });
      // groupes : total, ordre, « tous au repos »
      this._c.groups.forEach((g, gi) => {
        const gt = this.shadowRoot.querySelector(`[data-gt="${gi}"]`); if (gt) gt.textContent = this._w(gTot[gi] || 0);
        const box = this.shadowRoot.querySelector(`[data-rows="${gi}"]`); if (!box) return;
        const its = items.filter((x) => x.d.gi === gi);
        const ai = box.querySelector(`[data-allidle="${gi}"]`);
        if (ai) ai.hidden = !(this._c.idle === "hide" && its.length && !its.some((x) => x.on));
        if (this._c.sort === "power") this._reorder(box, [...its].sort((a, b) => b.v - a.v || a.d.di - b.d.di).map((x) => this._rows[x.d.k]));
      });
      // en-tête
      const root = this.shadowRoot;
      const cnt = root.getElementById("cnt");
      if (cnt) cnt.innerHTML = `<i class="pulse ${active ? "on" : ""}"></i>${active} ${this._t("en marche")} · ${devs.length - active} ${this._t("au repos")}`;
      const tot = root.getElementById("tot");
      if (tot) {
        this._tween(tot, "__total", total);
        const house = this._c.total_entity ? this._power(this._c.total_entity) : null;
        root.getElementById("totsub").textContent = house ? `${this._nf(Math.min(100, (total / house) * 100))} % ${this._t("de la maison")}` : this._t("Total mesuré");
        const share = root.getElementById("share");
        const denom = Math.max(total, house || 0, 1);
        const segs = items.filter((x) => x.v > thr).sort((a, b) => b.v - a.v);
        share.innerHTML = segs.map((x) => `<i style="flex:${x.v / denom};background:${x.d.color}" title="${esc(this._name(x.d))} — ${this._w(x.v)}"></i>`).join("")
          + (house && house > total ? `<i class="rest" style="flex:${(house - total) / denom}" title="${this._t("Non mesuré")} — ${this._w(house - total)}"></i>` : "");
        root.getElementById("top").innerHTML = segs.slice(0, 4).map((x) => `<span><i style="background:${x.d.color}"></i>${esc(this._name(x.d))} <b>${this._w(x.v)}</b></span>`).join("");
      }
    }
    // valeur qui défile en douceur vers la nouvelle mesure
    _tween(el, k, v) {
      if (!el) return;
      if (v === null) { el.textContent = "—"; this._shown[k] = null; return; }
      const from = this._shown[k];
      this._shown[k] = v;
      if (from === null || from === undefined || this._c.animation === false || Math.abs(from - v) < 0.5) { el.textContent = this._w(v); return; }
      if (document.hidden) { el.textContent = this._w(v); return; }
      const t0 = performance.now(), dur = 700;
      setTimeout(() => { if (this._shown[k] === v) el.textContent = this._w(v); }, dur + 120);
      const step = (now) => {
        if (this._shown[k] !== v) return;
        const q = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - q, 3);
        el.textContent = this._w(from + (v - from) * e);
        if (q < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
    // tri en direct avec glissement animé des lignes (FLIP)
    _reorder(box, order) {
      const cur = [...box.querySelectorAll(".row")];
      if (cur.length === order.length && cur.every((r, i) => r === order[i])) return;
      const anim = this._c.animation !== false && !matchMedia("(prefers-reduced-motion: reduce)").matches;
      const first = anim ? new Map(cur.map((r) => [r, r.getBoundingClientRect().top])) : null;
      const tail = box.querySelector(".allidle");
      order.forEach((r) => box.insertBefore(r, tail));
      if (!anim) return;
      order.forEach((r) => {
        const dy = first.get(r) - r.getBoundingClientRect().top;
        if (!dy) return;
        r.animate([{ transform: `translateY(${dy}px)` }, { transform: "translateY(0)" }], { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" });
      });
    }
    _drawSpark(r, d, max) {
      const pts = (this._spark[d.entity] || []).slice();
      const svg = r.querySelector(".spark"); if (!svg) return;
      const cur = this._power(d.entity);
      if (cur !== null) pts.push(cur);
      if (pts.length < 2) { svg.style.opacity = 0; return; }
      svg.style.opacity = "";
      const hi = Math.max(max, ...pts, 1);
      const xy = pts.map((v, i) => [(i / (pts.length - 1)) * 100, 29 - (v / hi) * 27]);
      const line = xy.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");
      svg.querySelector(".sl").setAttribute("d", line);
      svg.querySelector(".sa").setAttribute("d", `${line}L100,30L0,30Z`);
    }

    // ───────────── historique : mini-courbes, pic sur 7 jours, kWh du jour ─────────────
    async _loadHistory() {
      if (!this._hass || this._loading) return;
      const devs = this._devs(); if (!devs.length) return;
      this._histAt = Date.now(); this._loading = true;
      const now = new Date();
      const ids = [...new Set(devs.map((d) => d.entity))];
      const auto = [...new Set(devs.filter((d) => !num(d.max)).map((d) => d.entity))];
      const eMap = {}; for (const d of devs) { const e = this._energyEntity(d); if (e) eMap[d.entity] = e; }
      const eIds = this._c.show_energy !== false ? [...new Set(Object.values(eMap))] : [];
      const hrs = Math.max(1, Math.min(48, Number(this._c.sparkline_hours) || 3));
      const ws = (msg) => this._hass.callWS(msg).catch(() => ({}));
      const [sp, pk, en] = await Promise.all([
        this._c.show_sparkline !== false ? ws({ type: "recorder/statistics_during_period", start_time: new Date(now - hrs * 3600000).toISOString(), end_time: now.toISOString(),
          statistic_ids: ids, period: "5minute", types: ["mean"], units: { power: "W" } }) : {},
        auto.length ? ws({ type: "recorder/statistics_during_period", start_time: new Date(now - 7 * 86400000).toISOString(), end_time: now.toISOString(),
          statistic_ids: auto, period: "hour", types: ["max"], units: { power: "W" } }) : {},
        eIds.length ? ws({ type: "recorder/statistics_during_period", start_time: new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString(), end_time: now.toISOString(),
          statistic_ids: eIds, period: "5minute", types: ["change"], units: { energy: "kWh" } }) : {},
      ]);
      const miss = this._c.show_sparkline !== false ? ids.filter((id) => !(sp[id] || []).length) : [];
      if (miss.length) Object.assign(sp, await this._histBuckets(miss, now.getTime() - hrs * 3600000, now.getTime(), 300000));
      for (const id of ids) {
        const rows = sp[id] || [];
        if (rows.length) this._spark[id] = rows.map((x) => Math.max(0, x.mean || 0));
      }
      for (const id of auto) { const m = Math.max(0, ...(pk[id] || []).map((x) => x.max || 0)); if (m > 0) this._peak[id] = m; }
      this._today = {};
      for (const [p, e] of Object.entries(eMap)) if (en[e]) this._today[p] = en[e].reduce((n, x) => n + Math.max(0, x.change || 0), 0);
      this._sparkAt = Date.now(); this._peakAt = Date.now();
      this._loading = false;
      this._update(true);
    }

    // capteurs sans statistiques : tranches (moyenne pondérée, min, max) calculées depuis l'historique brut
    async _histBuckets(ids, start, end, step) {
      const out = {};
      if (!ids.length) return out;
      const r = await this._hass.callWS({ type: "history/history_during_period", start_time: new Date(start).toISOString(), end_time: new Date(end).toISOString(),
        entity_ids: ids, minimal_response: true, no_attributes: true, significant_changes_only: false }).catch(() => ({}));
      for (const id of ids) {
        const u = String(this._hass.states[id]?.attributes?.unit_of_measurement || "W"), f = u === "kW" ? 1000 : 1;
        const rows = (r[id] || []).map((x) => ({ t: Math.max(start, (x.lc !== undefined ? x.lc : x.lu) * 1000), v: num(x.s) })).sort((a, b) => a.t - b.t);
        const res = [];
        let j = 0;
        for (let b = Math.floor(start / step) * step; b < end; b += step) {
          const e = Math.min(b + step, end);
          let sum = 0, dt = 0, mn = Infinity, mx = -Infinity;
          while (j + 1 < rows.length && rows[j + 1].t <= b) j++;
          for (let k = j; k < rows.length && rows[k].t < e; k++) {
            const a0 = Math.max(rows[k].t, b), a1 = Math.min(k + 1 < rows.length ? rows[k + 1].t : end, e);
            const v = rows[k].v;
            if (a1 > a0 && v !== null) { const w = Math.max(0, v * f); sum += w * (a1 - a0); dt += a1 - a0; mn = Math.min(mn, w); mx = Math.max(mx, w); }
          }
          if (dt > 0) res.push({ start: b, mean: sum / dt, min: mn, max: mx });
        }
        out[id] = res;
      }
      return out;
    }

    _onClick(e) {
      const b = e.target.closest("[data-act]");
      if (b?.dataset.act === "toggle") {
        const gi = Number(b.dataset.g);
        this._collapsed.has(gi) ? this._collapsed.delete(gi) : this._collapsed.add(gi);
        ls.set(this._key, [...this._collapsed]);
        b.closest(".grp").classList.toggle("closed", this._collapsed.has(gi));
        return;
      }
      const r = e.target.closest(".row");
      if (r) { const d = this._devs().find((x) => x.k === r.dataset.k); if (d) this._openDlg(d); }
    }

    // ───────────── fenêtre graphique d'un appareil ─────────────
    _openDlg(d) {
      this._closeDlg();
      this._dlg = { d, range: ls.get("holm-lp-range") || "24h", data: null };
      const back = document.createElement("div");
      back.className = "dback";
      back.innerHTML = `<div class="dlg" role="dialog" aria-modal="true">
        <div class="dh"><span class="dic" style="--dc:${esc(d.color)}"><ha-icon icon="${esc(this._icon(d))}"></ha-icon></span>
          <div class="dt"><b>${esc(this._name(d))}</b><small>${this._t("Puissance")}</small></div>
          <div class="rng">${RANGES.map(([k, h, l]) => `<button data-r="${k}">${this._t(l)}</button>`).join("")}</div>
          <button class="x" data-x title="${this._t("Fermer")}"><ha-icon icon="mdi:close"></ha-icon></button></div>
        <div class="dk" id="dk"></div>
        <div class="dc" id="dc"><div class="dmsg">${this._t("Chargement…")}</div></div>
        <div class="dl"><span><i class="ln" style="background:${esc(d.color)}"></i>${this._t("Puissance")}</span><span><i class="mx"></i>${this._t("Max")}</span><span><i class="on"></i>${this._t("En marche")}</span>
          <button class="hist" data-more><ha-icon icon="mdi:history"></ha-icon>${this._t("Historique")}</button></div>
      </div>`;
      back.addEventListener("click", (e) => {
        if (e.target === back || e.target.closest("[data-x]")) return this._closeDlg();
        const r = e.target.closest("[data-r]");
        if (r) { this._dlg.range = r.dataset.r; ls.set("holm-lp-range", r.dataset.r); this._loadDlg(); return; }
        if (e.target.closest("[data-more]")) {
          const ev = new Event("hass-more-info", { bubbles: true, composed: true }); ev.detail = { entityId: d.entity };
          this._closeDlg(); this.dispatchEvent(ev);
        }
      });
      this._esc = (e) => { if (e.key === "Escape") this._closeDlg(); };
      window.addEventListener("keydown", this._esc);
      this.shadowRoot.appendChild(back);
      this._dlgEl = back;
      void back.offsetWidth; setTimeout(() => back.classList.add("in"), 20);
      this._loadDlg();
    }
    _closeDlg() {
      if (this._esc) window.removeEventListener("keydown", this._esc);
      this._dlgEl?.remove(); this._dlgEl = null; this._dlg = null;
    }
    async _loadDlg() {
      const D = this._dlg, el = this._dlgEl; if (!D || !el) return;
      el.querySelectorAll("[data-r]").forEach((b) => b.classList.toggle("on", b.dataset.r === D.range));
      const hrs = RANGES.find((x) => x[0] === D.range)?.[1] || 24;
      const period = hrs <= 48 ? "5minute" : "hour", step = hrs <= 48 ? 300000 : 3600000;
      const end = new Date(), start = new Date(end - hrs * 3600000);
      const eId = this._energyEntity(D.d);
      const key = D.range;
      const [st, en] = await Promise.all([
        this._hass.callWS({ type: "recorder/statistics_during_period", start_time: start.toISOString(), end_time: end.toISOString(), statistic_ids: [D.d.entity], period, types: ["mean", "min", "max"], units: { power: "W" } }).catch(() => ({})),
        eId ? this._hass.callWS({ type: "recorder/statistics_during_period", start_time: start.toISOString(), end_time: end.toISOString(), statistic_ids: [eId], period, types: ["change"], units: { energy: "kWh" } }).catch(() => ({})) : {},
      ]);
      if (this._dlg !== D || D.range !== key) return;
      if (!(st[D.d.entity] || []).length) Object.assign(st, await this._histBuckets([D.d.entity], start.getTime(), end.getTime(), step));
      if (this._dlg !== D || D.range !== key) return;
      const pts = (st[D.d.entity] || []).map((x) => ({ t: x.start, v: Math.max(0, x.mean || 0), mx: Math.max(0, x.max ?? x.mean ?? 0), mn: Math.max(0, x.min ?? x.mean ?? 0) }));
      const cur = this._power(D.d.entity);
      const thr = num(this._c.idle_threshold) ?? 2;
      const kwh = eId && en[eId] ? en[eId].reduce((n, x) => n + Math.max(0, x.change || 0), 0) : pts.reduce((n, p) => n + (p.v * step) / 3600000000, 0);
      const onSec = pts.reduce((n, p) => n + (p.v > thr ? step / 1000 : 0), 0);
      D.data = { pts, start: start.getTime(), end: end.getTime(), step, hrs, noRec: !pts.length };
      const vals = pts.map((p) => p.v);
      const tile = (l, v) => `<div class="tile"><span>${this._t(l)}</span><b>${v}</b></div>`;
      el.querySelector("#dk").innerHTML = [
        tile("Actuelle", cur === null ? "—" : this._w(cur)),
        tile("Min", vals.length ? this._w(Math.min(...pts.map((p) => p.mn))) : "—"),
        tile("Max", vals.length ? this._w(Math.max(...pts.map((p) => p.mx))) : "—"),
        tile("Moyenne", vals.length ? this._w(vals.reduce((a, b) => a + b, 0) / vals.length) : "—"),
        tile("Énergie", `${this._nf(kwh, kwh >= 10 ? 1 : 2)} kWh`),
        tile("En marche", this._dur(onSec)),
      ].join("");
      this._drawDlg();
    }
    _dur(sec) { const m = Math.round(sec / 60); if (m < 60) return `${m} min`; const h = Math.floor(m / 60), r = m % 60; return r ? `${h} h ${String(r).padStart(2, "0")}` : `${h} h`; }
    _drawDlg() {
      const D = this._dlg, el = this._dlgEl; if (!D?.data || !el) return;
      const box = el.querySelector("#dc");
      const { pts, start, end, step, hrs } = D.data;
      if (pts.length < 2) { box.innerHTML = `<div class="dmsg">${this._t(D.data.noRec ? "Pas d'historique : ce capteur est exclu de l'enregistreur (recorder) de Home Assistant." : "Pas de données sur cette période")}</div>`; return; }
      const W = Math.max(280, box.clientWidth || 700), H = W < 480 ? 200 : 280, pl = 52, pr = 10, pt = 12, pb = 26;
      const iw = W - pl - pr, ih = H - pt - pb;
      const top = Math.max(...pts.map((p) => p.mx), 1);
      const nice = (v) => { const p = Math.pow(10, Math.floor(Math.log10(v))); return ([1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((x) => v / p <= x) || 10) * p; };
      const max = nice(top * 1.05);
      const x = (t) => pl + ((t - start) / (end - start)) * iw, y = (v) => pt + ih - (v / max) * ih;
      const mid = (p) => p.t + step / 2;
      const line = pts.map((p, i) => `${i ? "L" : "M"}${x(mid(p)).toFixed(1)},${y(p.v).toFixed(1)}`).join("");
      const mxl = pts.map((p, i) => `${i ? "L" : "M"}${x(mid(p)).toFixed(1)},${y(p.mx).toFixed(1)}`).join("");
      const area = `${line}L${x(mid(pts[pts.length - 1])).toFixed(1)},${y(0)}L${x(mid(pts[0])).toFixed(1)},${y(0)}Z`;
      // périodes en marche
      const thr = num(this._c.idle_threshold) ?? 2, bands = [];
      for (const p of pts) { if (p.v > thr) { const l = bands[bands.length - 1]; if (l && l[1] === p.t) l[1] = p.t + step; else bands.push([p.t, p.t + step]); } }
      // graduations du temps
      const loc = this._hass?.locale?.language || this._l;
      const ticks = [];
      if (hrs > 48) { const d0 = new Date(start); let d = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate() + 1); while (d < end) { ticks.push([d.getTime(), new Intl.DateTimeFormat(loc, { weekday: "short", day: "numeric" }).format(d)]); d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1); } }
      else { const every = hrs <= 6 ? 1 : hrs <= 24 ? 3 : 6; const d0 = new Date(start); let d = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate(), d0.getHours() + 1); while (d < end) { if (d.getHours() % every === 0) ticks.push([d.getTime(), `${d.getHours()}h`]); d = new Date(d.getTime() + 3600000); } }
      const color = D.d.color;
      const fmtAx = (v) => (v >= 1000 ? `${this._nf(v / 1000, v % 1000 ? 1 : 0)} kW` : `${this._nf(v)} W`);
      box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" class="dsvg">
        <defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="${esc(color)}" stop-opacity=".45"/><stop offset="1" stop-color="${esc(color)}" stop-opacity="0"/></linearGradient></defs>
        ${bands.map(([a, b]) => `<rect class="band" x="${x(a).toFixed(1)}" y="${pt}" width="${Math.max(1, x(b) - x(a)).toFixed(1)}" height="${ih}"/>`).join("")}
        ${[0, 0.25, 0.5, 0.75, 1].map((f) => `<line class="gl" x1="${pl}" x2="${W - pr}" y1="${y(max * f)}" y2="${y(max * f)}"/><text class="ax" x="${pl - 8}" y="${y(max * f) + 4}" text-anchor="end">${fmtAx(max * f)}</text>`).join("")}
        ${ticks.map(([t, l]) => `<text class="ax" x="${x(t)}" y="${H - 6}" text-anchor="middle">${esc(l)}</text>`).join("")}
        <path d="${area}" fill="url(#ga)"/>
        ${hrs > 6 ? `<path class="mxl" d="${mxl}"/>` : ""}
        <path class="pl" d="${line}" style="stroke:${esc(color)}"/>
        <line class="gd" id="gd" y1="${pt}" y2="${pt + ih}" style="display:none"/>
        <circle class="dot" id="dot" r="4.5" style="fill:${esc(color)};display:none"/>
        <rect class="hv" id="hv" x="${pl}" y="${pt}" width="${iw}" height="${ih}"/>
      </svg><div class="dtip" id="dtip" hidden></div>`;
      const svg = box.querySelector("svg"), hv = box.querySelector("#hv"), tip = box.querySelector("#dtip"), gd = box.querySelector("#gd"), dot = box.querySelector("#dot");
      const tf = new Intl.DateTimeFormat(loc, hrs > 48 ? { weekday: "short", day: "numeric", hour: "2-digit", minute: "2-digit" } : { hour: "2-digit", minute: "2-digit" });
      const move = (ev) => {
        const r = svg.getBoundingClientRect();
        const t = start + (((ev.clientX - r.left) / r.width) * W - pl) / iw * (end - start);
        let b = pts[0], bd = Infinity; for (const p of pts) { const dd = Math.abs(mid(p) - t); if (dd < bd) { bd = dd; b = p; } }
        const gx = x(mid(b)), gy = y(b.v);
        gd.setAttribute("x1", gx); gd.setAttribute("x2", gx); gd.style.display = "";
        dot.setAttribute("cx", gx); dot.setAttribute("cy", gy); dot.style.display = "";
        tip.hidden = false;
        tip.innerHTML = `<b>${tf.format(new Date(b.t))}</b><span style="color:${esc(color)}">${this._w(b.v)}</span>${b.mx > b.v + 1 ? `<small>${this._t("Max")} ${this._w(b.mx)}</small>` : ""}`;
        const px = (gx / W) * r.width;
        tip.style.left = `${Math.min(Math.max(px - tip.offsetWidth / 2, 0), r.width - tip.offsetWidth)}px`;
      };
      hv.addEventListener("pointermove", move); hv.addEventListener("pointerdown", move);
      hv.addEventListener("pointerleave", () => { tip.hidden = true; gd.style.display = "none"; dot.style.display = "none"; });
    }
  }

  // ───────────────────────── styles ─────────────────────────
  const STYLE = `
    :host { --lp-r: 12px; --lp-soft: color-mix(in srgb, var(--primary-text-color) 6%, transparent); --lp-line: color-mix(in srgb, var(--divider-color) 70%, transparent);
            --lp-g1: #2ecc71; --lp-g2: #f1c40f; --lp-g3: #e74c3c; }
    ha-card { display: block; box-sizing: border-box; padding: 12px 14px 14px; container-type: inline-size; overflow: hidden; }
    * { box-sizing: border-box; }
    .msg { padding: 8px 2px; color: var(--secondary-text-color); font-size: 14px; }
    /* en-tête */
    .hdr { margin-bottom: 12px; }
    .ht { display: flex; align-items: center; gap: 10px; }
    .logo { width: 36px; height: 36px; border-radius: 11px; display: grid; place-items: center; flex: none;
            background: linear-gradient(135deg, color-mix(in srgb, var(--lp-g1) 35%, transparent), color-mix(in srgb, var(--lp-g3) 30%, transparent)); }
    .logo ha-icon { --mdc-icon-size: 20px; color: var(--primary-text-color); }
    .htx { display: flex; flex-direction: column; min-width: 0; flex: 1; }
    .ttl { font-size: 16px; font-weight: 600; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .cnt { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--secondary-text-color); }
    .pulse { width: 7px; height: 7px; border-radius: 50%; background: var(--disabled-text-color, #777); flex: none; }
    .pulse.on { background: var(--lp-g1); }
    .anim .pulse.on { animation: ping 1.8s ease-out infinite; }
    .tot { display: flex; flex-direction: column; align-items: flex-end; }
    .tot b { font-size: 24px; font-weight: 700; line-height: 1.1; color: var(--primary-text-color); font-variant-numeric: tabular-nums; white-space: nowrap; }
    .tot small { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; }
    .share { display: flex; gap: 2px; height: 8px; margin-top: 10px; border-radius: 99px; overflow: hidden; background: var(--lp-soft); }
    .share i { display: block; min-width: 3px; transition: flex .8s ease; }
    .share i.rest { background: repeating-linear-gradient(45deg, var(--lp-line) 0 4px, transparent 4px 8px); }
    .top { display: flex; flex-wrap: wrap; gap: 3px 12px; margin-top: 6px; font-size: 11.5px; color: var(--secondary-text-color); min-height: 15px; }
    .top span { display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; }
    .top i { width: 8px; height: 8px; border-radius: 3px; }
    .top b { color: var(--primary-text-color); font-weight: 600; }
    /* groupes */
    .groups { display: grid; gap: 10px 16px; align-items: start; }
    .gh { display: flex; align-items: center; gap: 8px; width: 100%; padding: 6px 2px; margin-bottom: 4px; background: none; border: 0; cursor: pointer;
          font: inherit; font-size: 12px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: var(--secondary-text-color); text-align: left; }
    .gh ha-icon { --mdc-icon-size: 17px; }
    .gn { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .gt { font-variant-numeric: tabular-nums; text-transform: none; letter-spacing: 0; color: var(--primary-text-color); }
    .chev { transition: transform .3s; } .grp.closed .chev { transform: rotate(-90deg); }
    .rows { display: flex; flex-direction: column; gap: 6px; }
    .grp.closed .rows { display: none; }
    .allidle { font-size: 12.5px; color: var(--secondary-text-color); padding: 8px 4px; }
    /* lignes */
    .row { position: relative; display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 0 12px 0 8px; border-radius: var(--lp-r); cursor: pointer;
           background: var(--lp-soft); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 6%, transparent); overflow: hidden; isolation: isolate;
           transition: opacity .4s, box-shadow .4s; }
    .row:hover { box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 18%, transparent); }
    .fill { position: absolute; inset: 0; z-index: -1; clip-path: inset(0 calc(100% - var(--p, 0%)) 0 0 round var(--lp-r)); transition: clip-path .9s cubic-bezier(.2,.8,.2,1); }
    .fill .grad { position: absolute; inset: 0; background: linear-gradient(90deg, var(--lp-g1), var(--lp-g2) 50%, var(--lp-g3)); opacity: .85; }
    .co-level .fill .grad { background: var(--lc); }
    .co-accent .fill .grad { background: linear-gradient(90deg, color-mix(in srgb, var(--primary-color) 55%, transparent), var(--primary-color)); }
    .fill .shine { position: absolute; inset: 0; opacity: 0; background: linear-gradient(100deg, transparent 20%, rgba(255,255,255,.35) 45%, transparent 70%) no-repeat; background-size: 40% 100%; }
    .anim .row.on .fill .shine { opacity: 1; animation: shine var(--speed, 2s) linear infinite; }
    .ic { position: relative; flex: none; width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center;
          background: color-mix(in srgb, var(--card-background-color, #1c1c1c) 55%, transparent); transition: box-shadow .4s; }
    .ic ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); transition: color .4s; }
    .row.on .ic ha-icon { color: var(--primary-text-color); }
    .anim .row.on .ic { animation: glow 2.4s ease-in-out infinite; }
    .anim .row.on .ic.spin ha-icon { animation: spin 1.8s linear infinite; }
    .tx { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .nm { font-size: 13.5px; font-weight: 600; color: var(--primary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .sub { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sub:empty { display: none; }
    .st-fill .row.on .nm, .st-fill .row.on .val { text-shadow: 0 1px 3px rgba(0,0,0,.55); }
    .st-fill .row.on .sub { color: color-mix(in srgb, var(--primary-text-color) 75%, transparent); text-shadow: 0 1px 3px rgba(0,0,0,.5); }
    .mbar { display: none; }
    .st-bar .fill { display: none; }
    .st-bar .mbar { display: block; position: relative; height: 5px; margin-top: 4px; border-radius: 99px; background: color-mix(in srgb, var(--primary-text-color) 10%, transparent); overflow: hidden; }
    .st-bar .mbar i { position: absolute; inset: 0; background: linear-gradient(90deg, var(--lp-g1), var(--lp-g2) 50%, var(--lp-g3)); clip-path: inset(0 calc(100% - var(--p, 0%)) 0 0 round 99px); transition: clip-path .9s cubic-bezier(.2,.8,.2,1); }
    .st-bar.co-level .mbar i { background: var(--lc); } .st-bar.co-accent .mbar i { background: var(--primary-color); }
    .spark { flex: none; width: 64px; height: 26px; overflow: visible; transition: opacity .4s; }
    .spark .sl { fill: none; stroke: color-mix(in srgb, var(--primary-text-color) 55%, transparent); stroke-width: 1.4; vector-effect: non-scaling-stroke; stroke-linejoin: round; }
    .spark .sa { fill: color-mix(in srgb, var(--primary-text-color) 10%, transparent); }
    .val { flex: none; min-width: 58px; text-align: right; font-size: 13.5px; font-weight: 700; color: var(--primary-text-color); font-variant-numeric: tabular-nums; white-space: nowrap; }
    .row:not(.on) .val { color: var(--secondary-text-color); font-weight: 600; }
    .row.na { opacity: .45; }
    .idle-dim .row:not(.on) { opacity: .55; }
    .idle-hide .row:not(.on) { display: none; }
    /* fenêtre graphique */
    .dback { position: fixed; inset: 0; z-index: 999; display: grid; place-items: center; padding: 16px; background: rgba(0,0,0,0); backdrop-filter: blur(0); transition: background .25s, backdrop-filter .25s; }
    .dback.in { background: rgba(0,0,0,.55); backdrop-filter: blur(4px); }
    .dlg { width: min(780px, 100%); max-height: calc(100vh - 32px); overflow: auto; border-radius: 22px; padding: 16px 18px 14px; color: var(--primary-text-color);
           background: linear-gradient(var(--ha-card-background, var(--card-background-color, #1c1c1c)), var(--ha-card-background, var(--card-background-color, #1c1c1c))), var(--primary-background-color, #111); box-shadow: 0 20px 60px rgba(0,0,0,.5), inset 0 0 0 1px color-mix(in srgb, var(--primary-text-color) 10%, transparent);
           transform: translateY(14px) scale(.98); opacity: 0; transition: transform .3s cubic-bezier(.2,.8,.2,1), opacity .25s; container-type: inline-size; }
    .dback.in .dlg { transform: none; opacity: 1; }
    .dh { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .dic { width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; flex: none; background: color-mix(in srgb, var(--dc) 22%, transparent); }
    .dic ha-icon { --mdc-icon-size: 21px; color: var(--dc); }
    .dt { flex: 1; min-width: 120px; display: flex; flex-direction: column; }
    .dt b { font-size: 17px; } .dt small { font-size: 12.5px; color: var(--secondary-text-color); }
    .rng { display: flex; gap: 3px; padding: 3px; border-radius: 12px; background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); }
    .rng button { font: inherit; font-size: 13px; font-weight: 700; border: 0; background: none; color: var(--secondary-text-color); padding: 6px 12px; border-radius: 9px; cursor: pointer; }
    .rng button.on { background: #e8833a; color: #fff; }
    .x { width: 36px; height: 36px; border-radius: 50%; border: 0; display: grid; place-items: center; cursor: pointer; color: var(--primary-text-color);
         background: color-mix(in srgb, var(--primary-text-color) 9%, transparent); }
    .dk { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 8px; margin: 14px 0 6px; }
    .tile { border-radius: 12px; padding: 8px 12px; background: color-mix(in srgb, var(--primary-text-color) 7%, transparent); display: flex; flex-direction: column; }
    .tile span { font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; color: var(--secondary-text-color); }
    .tile b { font-size: 19px; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .dc { position: relative; min-height: 200px; margin-top: 6px; }
    .dmsg { display: grid; place-items: center; min-height: 200px; color: var(--secondary-text-color); font-size: 14px; }
    .dsvg { display: block; width: 100%; height: auto; overflow: visible; }
    .dsvg .gl { stroke: var(--lp-line); stroke-width: 1; }
    .dsvg .ax { fill: var(--secondary-text-color); font-size: 11.5px; }
    .dsvg .band { fill: color-mix(in srgb, #e8833a 14%, transparent); }
    .dsvg .pl { fill: none; stroke-width: 2.2; stroke-linejoin: round; stroke-linecap: round; }
    .dsvg .mxl { fill: none; stroke: color-mix(in srgb, var(--primary-text-color) 30%, transparent); stroke-width: 1; stroke-dasharray: 3 3; }
    .dsvg .gd { stroke: color-mix(in srgb, var(--primary-text-color) 45%, transparent); stroke-width: 1; }
    .dsvg .dot { stroke: var(--card-background-color, #1c1c1c); stroke-width: 2; }
    .dsvg .hv { fill: transparent; cursor: crosshair; touch-action: pan-y; }
    .dtip { position: absolute; top: 0; pointer-events: none; display: flex; flex-direction: column; gap: 1px; padding: 7px 11px; border-radius: 10px; font-size: 12.5px; white-space: nowrap;
            background: var(--primary-background-color, #222); box-shadow: 0 6px 18px rgba(0,0,0,.35); border: 1px solid var(--lp-line); }
    .dtip[hidden] { display: none; }
    .dtip span { font-weight: 700; font-size: 14px; } .dtip small { color: var(--secondary-text-color); }
    .dl { display: flex; flex-wrap: wrap; align-items: center; gap: 6px 16px; margin-top: 8px; font-size: 12px; color: var(--secondary-text-color); }
    .dl span { display: inline-flex; align-items: center; gap: 6px; }
    .dl i { display: inline-block; width: 14px; height: 3px; border-radius: 2px; }
    .dl i.mx { height: 0; border-top: 1px dashed color-mix(in srgb, var(--primary-text-color) 45%, transparent); }
    .dl i.on { width: 12px; height: 10px; background: color-mix(in srgb, #e8833a 30%, transparent); }
    .dl .hist { margin-left: auto; display: inline-flex; align-items: center; gap: 5px; border: 0; background: none; color: var(--secondary-text-color); font: inherit; font-size: 12px; cursor: pointer; }
    .dl .hist ha-icon { --mdc-icon-size: 16px; }
    @container (max-width: 460px) { .tile b { font-size: 16px; } .rng button { padding: 6px 9px; } .dk { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
    @keyframes shine { from { background-position: -60% 0; } to { background-position: 180% 0; } }
    @keyframes glow { 0%, 100% { box-shadow: 0 0 0 0 transparent; } 50% { box-shadow: 0 0 10px 1px color-mix(in srgb, #fff 35%, transparent); } }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes ping { 0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--lp-g1) 70%, transparent); } 100% { box-shadow: 0 0 0 7px transparent; } }
    @media (prefers-reduced-motion: reduce) { .anim .row.on .fill .shine, .anim .row.on .ic, .anim .row.on .ic.spin ha-icon, .anim .pulse.on { animation: none !important; } .fill, .mbar i, .share i { transition: none; } }
    @container (max-width: 420px) {
      ha-card { padding: 10px 10px 12px; }
      .spark { width: 44px; }
      .tot b { font-size: 21px; }
      .row { gap: 8px; padding: 0 10px 0 6px; }
    }`;

  // ───────────────────────── éditeur visuel ─────────────────────────
  class HolmLivePowerCardEditor extends HTMLElement {
    setConfig(c) {
      if (this._last && JSON.stringify(c) === this._last && this.shadowRoot) return;
      const groups = (Array.isArray(c.groups) && c.groups.length ? c.groups : [{ name: "", devices: c.devices || [] }]).map((g) => ({ ...g, devices: (g.devices || []).map((d) => ({ ...d })) }));
      this._c = { ...c, groups }; delete this._c.devices;
      if (this._openG === undefined) this._openG = groups.length === 1 ? 0 : -1;
      if (this._openD === undefined) this._openD = "";
      this._build();
    }
    set hass(h) { const first = !this._hass; this._hass = h; this.shadowRoot?.querySelectorAll("ha-form").forEach((f) => { f.hass = h; }); if (first) this._build(); }
    get _l() { return langOf(this._hass, this._c); }
    _t(s) { return tr(this._l, s); }
    _emit(rebuild) {
      const cfg = { ...this._c, groups: this._c.groups.map((g) => {
        const o = {}; if (g.name) o.name = g.name; if (g.icon) o.icon = g.icon;
        o.devices = g.devices.filter((d) => d.entity).map((d) => { const x = {}; for (const k of ["entity", "name", "icon", "max", "energy", "color"]) if (d[k] !== undefined && d[k] !== null && d[k] !== "") x[k] = d[k]; return x; });
        return o;
      }) };
      const DEF = { sort: "power", idle: "show", idle_threshold: 2, style: "fill", color: "gradient", columns: "auto", show_total: true, show_sparkline: true, show_energy: true, sparkline_hours: 3, animation: true };
      for (const [k, v] of Object.entries(DEF)) if (cfg[k] === v || cfg[k] === undefined || cfg[k] === "") delete cfg[k];
      if (!cfg.language) delete cfg.language;
      if (!cfg.total_entity) delete cfg.total_entity;
      this._last = JSON.stringify(cfg);
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg }, bubbles: true, composed: true }));
      if (rebuild) this._build();
    }
    _label(s) {
      const L = { title: "Titre", language: "Langue", sort: "Tri", idle: "Appareils au repos", idle_threshold: "Seuil de repos (W)", style: "Style des lignes", color: "Couleurs", columns: "Colonnes",
        show_total: "Afficher le total", show_sparkline: "Mini-courbes", show_energy: "kWh du jour", sparkline_hours: "Heures des mini-courbes", total_entity: "Consommation totale de la maison (facultatif)",
        animation: "Animations", name: "Nom affiché", gname: "Nom du groupe", icon: "Icône", entity: "Capteur de puissance (W)", max: "Puissance max (W, auto si vide)", energy: "Compteur d'énergie (auto si vide)",
        color_d: "Couleur (facultatif)", group: "Groupe" };
      return L[s.name] ? this._t(L[s.name]) : s.title || s.name;
    }
    _build() {
      if (!this._hass || !this._c) return;
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      const t = (s) => this._t(s);
      const opt = (v, l) => ({ value: v, label: t(l) });
      const G = this._c.groups;
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; }
          .sec { font-weight: 600; margin: 16px 0 8px; color: var(--primary-text-color); }
          .box { border: 1px solid var(--divider-color); border-radius: 12px; overflow: hidden; margin-bottom: 8px; }
          .bh { display: flex; align-items: center; gap: 8px; padding: 6px 6px 6px 12px; cursor: pointer; }
          .bh ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); }
          .bh .t { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .bh .t small { display: block; color: var(--secondary-text-color); font-size: 12px; }
          .bh button { border: 0; background: none; color: var(--secondary-text-color); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: grid; place-items: center; }
          .bh button:hover { background: color-mix(in srgb, var(--primary-text-color) 8%, transparent); color: var(--primary-text-color); }
          .bh button:disabled { opacity: .3; cursor: default; }
          .bb { padding: 4px 12px 12px; border-top: 1px solid var(--divider-color); }
          .dev { border: 1px solid var(--divider-color); border-radius: 10px; margin-top: 6px; overflow: hidden; }
          .dev .bh { padding-left: 10px; }
          .add { margin: 8px 8px 0 0; display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; border-radius: 18px; border: 1px dashed var(--divider-color);
                 background: none; color: var(--primary-color); font: inherit; font-weight: 500; cursor: pointer; }
          .add:hover { background: color-mix(in srgb, var(--primary-color) 10%, transparent); }
          .note { font-size: 12px; color: var(--secondary-text-color); margin-top: 6px; }
        </style>
        <ha-form id="top"></ha-form>
        <div class="sec">${t("Groupes")}</div>
        ${G.map((g, gi) => `
          <div class="box">
            <div class="bh" data-og="${gi}"><ha-icon icon="${esc(g.icon || "mdi:folder-outline")}"></ha-icon>
              <div class="t">${esc(g.name || t("Nouveau groupe"))}<small>${g.devices.length} · ${t("Appareils").toLowerCase()}</small></div>
              <button data-gup="${gi}" ${gi === 0 ? "disabled" : ""} title="${t("Monter")}"><ha-icon icon="mdi:arrow-up"></ha-icon></button>
              <button data-gdown="${gi}" ${gi === G.length - 1 ? "disabled" : ""} title="${t("Descendre")}"><ha-icon icon="mdi:arrow-down"></ha-icon></button>
              <button data-gdel="${gi}" title="${t("Supprimer")}"><ha-icon icon="mdi:delete-outline"></ha-icon></button>
              <ha-icon icon="${this._openG === gi ? "mdi:chevron-up" : "mdi:chevron-down"}"></ha-icon></div>
            ${this._openG === gi ? `<div class="bb">
              <ha-form data-gform="${gi}"></ha-form>
              ${g.devices.map((d, di) => { const st = d.entity && this._hass.states[d.entity]; const k = `${gi}-${di}`; return `
                <div class="dev">
                  <div class="bh" data-od="${k}"><ha-icon icon="${esc(d.icon || st?.attributes?.icon || "mdi:flash")}"></ha-icon>
                    <div class="t">${esc(d.name || st?.attributes?.friendly_name || t("Nouvel appareil"))}<small>${esc(d.entity || t("choisissez un capteur"))}</small></div>
                    <button data-dup="${k}" ${di === 0 ? "disabled" : ""} title="${t("Monter")}"><ha-icon icon="mdi:arrow-up"></ha-icon></button>
                    <button data-ddown="${k}" ${di === g.devices.length - 1 ? "disabled" : ""} title="${t("Descendre")}"><ha-icon icon="mdi:arrow-down"></ha-icon></button>
                    <button data-ddel="${k}" title="${t("Supprimer")}"><ha-icon icon="mdi:delete-outline"></ha-icon></button>
                    <ha-icon icon="${this._openD === k ? "mdi:chevron-up" : "mdi:chevron-down"}"></ha-icon></div>
                  ${this._openD === k ? `<div class="bb"><ha-form data-dform="${k}"></ha-form></div>` : ""}
                </div>`; }).join("")}
              <button class="add" data-dadd="${gi}"><ha-icon icon="mdi:plus"></ha-icon>${t("Ajouter un appareil")}</button>
            </div>` : ""}
          </div>`).join("")}
        <button class="add" id="gadd"><ha-icon icon="mdi:folder-plus-outline"></ha-icon>${t("Ajouter un groupe")}</button>
        <button class="add" id="imp"><ha-icon icon="mdi:import"></ha-icon>${t("Importer du tableau Énergie")}</button>
        <div class="note" id="note"></div>`;
      const top = this.shadowRoot.getElementById("top");
      top.hass = this._hass; top.computeLabel = (s) => this._label(s);
      top.schema = [
        { name: "title", selector: { text: {} } },
        { type: "expandable", name: "", title: t("Affichage"), schema: [
          { type: "grid", name: "", schema: [
            { name: "sort", selector: { select: { mode: "dropdown", options: [opt("power", "Par puissance, en direct"), opt("none", "Ordre de l'éditeur")] } } },
            { name: "idle", selector: { select: { mode: "dropdown", options: [opt("show", "Afficher"), opt("dim", "Atténuer"), opt("hide", "Masquer")] } } },
            { name: "style", selector: { select: { mode: "dropdown", options: [opt("fill", "Ligne remplie"), opt("bar", "Barre sous le nom")] } } },
            { name: "color", selector: { select: { mode: "dropdown", options: [opt("gradient", "Dégradé vert → rouge"), opt("level", "Selon le niveau"), opt("accent", "Couleur d'accent")] } } },
            { name: "columns", selector: { select: { mode: "dropdown", options: [opt("auto", "Automatique"), { value: "1", label: "1" }, { value: "2", label: "2" }] } } },
            { name: "idle_threshold", selector: { number: { mode: "box", min: 0, step: "any", unit_of_measurement: "W" } } },
          ] },
          { type: "grid", name: "", schema: [
            { name: "show_total", selector: { boolean: {} } }, { name: "show_sparkline", selector: { boolean: {} } },
            { name: "show_energy", selector: { boolean: {} } }, { name: "animation", selector: { boolean: {} } },
          ] },
          { name: "sparkline_hours", selector: { number: { mode: "box", min: 1, max: 48, unit_of_measurement: "h" } } },
          { name: "total_entity", selector: { entity: { domain: "sensor", device_class: "power" } } },
          { name: "language", selector: { select: { mode: "dropdown", options: [{ value: "", label: t("Automatique (profil)") }, ...[["fr", "Français"], ["en", "English"], ["de", "Deutsch"], ["es", "Español"], ["it", "Italiano"], ["nl", "Nederlands"], ["pt", "Português"], ["pl", "Polski"]].map(([value, label]) => ({ value, label }))] } } },
        ] },
      ];
      const c = this._c;
      top.data = { title: c.title ?? t("Consommations en direct"), sort: c.sort || "power", idle: c.idle || "show", style: c.style || "fill", color: c.color || "gradient", columns: String(c.columns || "auto"),
        idle_threshold: c.idle_threshold ?? 2, show_total: c.show_total !== false, show_sparkline: c.show_sparkline !== false, show_energy: c.show_energy !== false, animation: c.animation !== false,
        sparkline_hours: c.sparkline_hours ?? 3, total_entity: c.total_entity || "", language: c.language || "" };
      top.addEventListener("value-changed", (e) => {
        e.stopPropagation();
        const relang = (e.detail.value.language || "") !== (this._c.language || "");
        Object.assign(this._c, e.detail.value);
        this._emit(relang);
      });
      // formulaire du groupe ouvert
      this.shadowRoot.querySelectorAll("ha-form[data-gform]").forEach((f) => {
        const gi = Number(f.dataset.gform), g = this._c.groups[gi];
        f.hass = this._hass; f.computeLabel = (s) => this._label(s.name === "name" ? { name: "gname" } : s);
        f.schema = [{ type: "grid", name: "", schema: [{ name: "name", selector: { text: {} } }, { name: "icon", selector: { icon: {} } }] }];
        f.data = { name: g.name || "", icon: g.icon || "" };
        f.addEventListener("value-changed", (e) => { e.stopPropagation(); g.name = e.detail.value.name; g.icon = e.detail.value.icon; this._emit(false); });
      });
      // formulaire de l'appareil ouvert
      this.shadowRoot.querySelectorAll("ha-form[data-dform]").forEach((f) => {
        const [gi, di] = f.dataset.dform.split("-").map(Number), d = this._c.groups[gi].devices[di];
        f.hass = this._hass; f.computeLabel = (s) => this._label(s.name === "color" ? { name: "color_d" } : s);
        f.schema = [
          { name: "entity", required: true, selector: { entity: { domain: "sensor" } } },
          { type: "grid", name: "", schema: [{ name: "name", selector: { text: {} } }, { name: "icon", selector: { icon: {} } }] },
          { type: "grid", name: "", schema: [{ name: "max", selector: { number: { mode: "box", min: 0, step: "any", unit_of_measurement: "W" } } }, { name: "color", selector: { text: {} } }] },
          { name: "energy", selector: { entity: { domain: "sensor", device_class: "energy" } } },
          ...(this._c.groups.length > 1 ? [{ name: "group", selector: { select: { mode: "dropdown", options: this._c.groups.map((x, i) => ({ value: String(i), label: x.name || `${t("Groupe")} ${i + 1}` })) } } }] : []),
        ];
        f.data = { ...d, group: String(gi) };
        f.addEventListener("value-changed", (e) => {
          e.stopPropagation();
          const v = { ...e.detail.value }; const ng = Number(v.group ?? gi); delete v.group;
          const entityChanged = v.entity !== d.entity;
          for (const k of ["entity", "name", "icon", "max", "energy", "color"]) d[k] = v[k];
          if (ng !== gi) { this._c.groups[gi].devices.splice(di, 1); this._c.groups[ng].devices.push(d); this._openG = ng; this._openD = `${ng}-${this._c.groups[ng].devices.length - 1}`; this._emit(true); return; }
          this._emit(entityChanged);
        });
      });
      const $ = (s) => this.shadowRoot.querySelectorAll(s);
      const swap = (a, i, j) => { [a[i], a[j]] = [a[j], a[i]]; };
      $("[data-og]").forEach((el) => el.addEventListener("click", (e) => { if (e.target.closest("button")) return; const gi = Number(el.dataset.og); this._openG = this._openG === gi ? -1 : gi; this._openD = ""; this._build(); }));
      $("[data-od]").forEach((el) => el.addEventListener("click", (e) => { if (e.target.closest("button")) return; this._openD = this._openD === el.dataset.od ? "" : el.dataset.od; this._build(); }));
      $("[data-gup]").forEach((b) => b.addEventListener("click", () => { const i = Number(b.dataset.gup); swap(this._c.groups, i, i - 1); this._openG = i - 1; this._emit(true); }));
      $("[data-gdown]").forEach((b) => b.addEventListener("click", () => { const i = Number(b.dataset.gdown); swap(this._c.groups, i, i + 1); this._openG = i + 1; this._emit(true); }));
      $("[data-gdel]").forEach((b) => b.addEventListener("click", () => { this._c.groups.splice(Number(b.dataset.gdel), 1); if (!this._c.groups.length) this._c.groups.push({ name: "", devices: [] }); this._openG = -1; this._emit(true); }));
      $("[data-dup]").forEach((b) => b.addEventListener("click", () => { const [g, i] = b.dataset.dup.split("-").map(Number); swap(this._c.groups[g].devices, i, i - 1); this._openD = this._openD === `${g}-${i}` ? `${g}-${i - 1}` : this._openD; this._emit(true); }));
      $("[data-ddown]").forEach((b) => b.addEventListener("click", () => { const [g, i] = b.dataset.ddown.split("-").map(Number); swap(this._c.groups[g].devices, i, i + 1); this._openD = this._openD === `${g}-${i}` ? `${g}-${i + 1}` : this._openD; this._emit(true); }));
      $("[data-ddel]").forEach((b) => b.addEventListener("click", () => { const [g, i] = b.dataset.ddel.split("-").map(Number); this._c.groups[g].devices.splice(i, 1); this._openD = ""; this._emit(true); }));
      $("[data-dadd]").forEach((b) => b.addEventListener("click", () => { const g = Number(b.dataset.dadd); this._c.groups[g].devices.push({ entity: "" }); this._openD = `${g}-${this._c.groups[g].devices.length - 1}`; this._build(); }));
      this.shadowRoot.getElementById("gadd").addEventListener("click", () => { this._c.groups.push({ name: t("Nouveau groupe"), devices: [] }); this._openG = this._c.groups.length - 1; this._emit(true); });
      this.shadowRoot.getElementById("imp").addEventListener("click", () => this._import());
    }
    // ajoute les appareils du tableau Énergie (capteur de puissance « stat_rate ») qui ne sont pas déjà dans la carte
    async _import() {
      const note = this.shadowRoot.getElementById("note");
      try {
        const p = await this._hass.callWS({ type: "energy/get_prefs" });
        const have = new Set(this._c.groups.flatMap((g) => g.devices.map((d) => d.entity)));
        const add = (p.device_consumption || []).filter((d) => d.stat_rate && this._hass.states[d.stat_rate] && !have.has(d.stat_rate))
          .map((d) => ({ entity: d.stat_rate, ...(d.name ? { name: d.name } : {}) }));
        if (!add.length) { note.textContent = this._t("Rien de nouveau à importer"); return; }
        this._c.groups.push({ name: this._t("Tableau Énergie"), icon: "mdi:lightning-bolt", devices: add });
        this._openG = this._c.groups.length - 1; this._openD = "";
        this._emit(true);
      } catch (e) { note.textContent = String(e?.message || e); }
    }
  }

  if (!customElements.get("holm-live-power-card")) customElements.define("holm-live-power-card", HolmLivePowerCard);
  if (!customElements.get("holm-live-power-card-editor")) customElements.define("holm-live-power-card-editor", HolmLivePowerCardEditor);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === "holm-live-power-card")) {
    const l = langOf(document.querySelector("home-assistant")?.hass);
    window.customCards.push({ type: "holm-live-power-card", name: tr(l, "HOLM – Puissance en direct"), description: tr(l, "La puissance de chaque appareil en direct, par groupes, animée"), preview: true });
  }
  console.info(`%c HOLM-LIVE-POWER %c ${VERSION} `, "background:#2ecc71;color:#111;border-radius:3px 0 0 3px", "background:#123;color:#fff;border-radius:0 3px 3px 0");
})();
