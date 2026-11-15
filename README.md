# ⚡ HOLM Live Power Card

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://hacs.xyz/)
![Version](https://img.shields.io/github/v/release/kaaribou/holm-live-power-card)
![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2025.1%2B-03a9f4)

🇫🇷 Français · [🇬🇧 English](README.en.md)

**La puissance de chaque appareil en direct, rangée par groupes, dans une carte moderne et animée — entièrement réglable dans l'éditeur visuel.**

Fini les dizaines de `button-card` copiées-collées : une seule carte affiche tous vos appareils mesurés (prises connectées, pinces, capteurs de puissance), les trie en direct selon ce qu'ils consomment et montre d'un coup d'œil qui tire sur le compteur.

### En bref

- 📊 **En-tête** : puissance totale qui défile en douceur, nombre d'appareils en marche et au repos, barre de répartition colorée et les quatre plus gros consommateurs du moment.
- 🗂️ **Groupes repliables** (« Autres consommations », « Consommations permanentes »…), côte à côte sur grand écran, empilés sur mobile, avec leur total.
- 🌈 **Lignes remplies selon la puissance** : dégradé vert → jaune → rouge par rapport au maximum de l'appareil, reflet animé qui accélère avec la charge, icône qui s'illumine (et tourne pour les ventilateurs, lave-linge, pompes…).
- 🔀 **Tri en direct** : l'appareil qui démarre remonte en tête avec un glissement animé.
- 📈 **Mini-courbe** des dernières heures et **kWh du jour** pour chaque appareil (compteur d'énergie trouvé tout seul sur le même appareil).
- 🎯 **Maximum automatique** : sans valeur saisie, l'échelle s'adapte au pic des 7 derniers jours.
- 📉 **Un graphique pour chaque appareil** : toucher une ligne ouvre une fenêtre avec la courbe de puissance sur 6 h, 24 h, 48 h ou 7 jours, les périodes de marche, et les tuiles Actuelle, Min, Max, Moyenne, Énergie et En marche.
- 🌳 **Sous-appareils** : une prise qui mesure un ensemble et les appareils qu'il contient, sans double comptage, avec la part non détaillée.
- ⏻ **Bouton marche / arrêt** facultatif par appareil, avec confirmation avant d'éteindre. Désactivé par défaut : la carte reste en lecture seule tant que vous ne l'activez pas.
- ✏️ **Éditeur visuel complet** : groupes et appareils (ajouter, réordonner, déplacer d'un groupe à l'autre), affichage, couleurs, et **import des appareils du tableau Énergie** en un clic.
- 🌍 **8 langues**, thème clair et sombre, animations coupées si le système demande moins de mouvement.

### 🆕 Nouveautés de la 1.2.0

- 🌳 **Sous-appareils sans double comptage** ([#1](https://github.com/kaaribou/holm-live-power-card/issues/1), idée de MilesTEG1) : une prise qui mesure toute une baie, un meuble TV ou un tableau divisionnaire peut avoir ses « sous-appareils » mesurés à part. Ils s'affichent en retrait sous elle, ne sont plus comptés deux fois dans le total, et une ligne **Reste non détaillé** montre ce qui n'est pas mesuré individuellement. Voir [Sous-appareils](#sous-appareils).
- ⏻ **Bouton marche / arrêt** par appareil, désactivé par défaut, avec confirmation avant d'éteindre. Voir [Bouton marche / arrêt](#bouton-marche--arrêt).

![Sous-appareils, ligne « Reste » et boutons marche / arrêt](docs/images/sous-appareils.png)

| La carte | Sur mobile | L'éditeur |
|---|---|---|
| ![HOLM Live Power Card](docs/images/carte.png) | ![Sur mobile](docs/images/mobile.png) | ![Éditeur visuel](docs/images/editeur.png) |

![Le graphique d'un appareil](docs/images/graphique.png)

---

## Installation

### Via HACS (recommandé)

1. HACS → menu ⋮ → **Dépôts personnalisés** → ajoutez `https://github.com/kaaribou/holm-live-power-card`, catégorie **Tableau de bord**.
2. Recherchez **HOLM Live Power Card** et installez.
3. Rechargez la page (Ctrl + F5).

### Manuelle

1. Copiez `holm-live-power-card.js` dans `config/www/community/holm-cards/`.
2. Paramètres → Tableaux de bord → ⋮ → **Ressources** → ajoutez `/local/community/holm-cards/holm-live-power-card.js?v=1.2.0`, type **Module JavaScript**.
3. Rechargez la page (Ctrl + F5).

## Configuration

Ajoutez la carte **HOLM – Puissance en direct** depuis le sélecteur de cartes, puis ajoutez vos appareils dans l'éditeur (ou importez ceux du tableau Énergie).

```yaml
type: custom:holm-live-power-card
title: Consommations en direct
groups:
  - name: Autres consommations
    icon: mdi:chart-histogram
    devices:
      - entity: sensor.chauffe_eau_power
        name: Chauffe-eau
        icon: mdi:water-boiler
        max: 2500
      - entity: sensor.lave_linge_power
        name: Lave-linge
        icon: mdi:washing-machine
  - name: Consommations permanentes
    icon: mdi:home-lightning-bolt-outline
    devices:
      - entity: sensor.prise_frigo_buanderie_power
        name: Réfrigérateur
```

### Options de la carte

| Option | Description | Par défaut |
|---|---|---|
| `title` | Titre | `Consommations en direct` |
| `language` | Langue : `fr`, `en`, `de`, `es`, `it`, `nl`, `pt`, `pl` | celle du profil |
| `sort` | `power` (tri en direct) ou `none` (ordre de l'éditeur) | `power` |
| `idle` | Appareils au repos : `show`, `dim` (atténués) ou `hide` (masqués) | `show` |
| `idle_threshold` | Seuil en W sous lequel un appareil est « au repos » | `2` |
| `style` | `fill` (ligne remplie) ou `bar` (barre sous le nom) | `fill` |
| `color` | `gradient` (vert → rouge), `level` (couleur selon le niveau) ou `accent` | `gradient` |
| `columns` | Groupes côte à côte : `auto`, `1` ou `2` | `auto` |
| `show_total` | En-tête avec total et répartition | `true` |
| `show_sparkline` | Mini-courbes | `true` |
| `sparkline_hours` | Durée des mini-courbes (h) | `3` |
| `show_energy` | kWh du jour | `true` |
| `total_entity` | Consommation totale de la maison (W) : affiche la part mesurée et le « non mesuré » | — |
| `show_rest` | Ligne « Reste non détaillé » sous un appareil qui a des sous-appareils | `true` |
| `animation` | Animations | `true` |

### Options d'un appareil

| Option | Description |
|---|---|
| `entity` | Capteur de puissance (W ou kW) — **obligatoire** |
| `name`, `icon` | Nom et icône affichés (sinon ceux de l'entité) |
| `max` | Puissance maximale pour l'échelle ; sinon le pic des 7 derniers jours |
| `energy` | Compteur d'énergie pour les kWh du jour ; sinon cherché sur le même appareil |
| `color` | Couleur de l'appareil dans la barre de répartition |
| `parent` | Capteur de l'appareil qui contient celui-ci : il s'affiche en retrait et n'est pas compté deux fois (voir [Sous-appareils](#sous-appareils)) |
| `show_switch` | Bouton marche / arrêt sur la ligne (voir [Bouton marche / arrêt](#bouton-marche--arrêt)) |
| `switch` | Interrupteur piloté par le bouton ; sinon celui du même appareil |
| `switch_confirm` | `false` pour éteindre sans confirmation (par défaut : confirmation) |

## Sous-appareils

Quand une prise mesure un ensemble (une baie informatique, un meuble TV, une multiprise de cuisine…) et que certains appareils de cet ensemble ont aussi leur propre prise, choisissez pour chacun d'eux **Inclus dans (sous-appareil de)** dans l'éditeur (option `parent`).

```yaml
devices:
  - entity: sensor.prise_baie_power        # mesure toute la baie : 160 W
    name: Baie informatique
  - entity: sensor.prise_serveur_1_power   # 40 W
    name: Serveur 1
    parent: sensor.prise_baie_power
  - entity: sensor.prise_serveur_2_power   # 15 W
    name: Serveur 2
    parent: sensor.prise_baie_power
```

| Élément | À quoi il sert |
|---|---|
| **Ligne de l'appareil parent** | La puissance totale de l'ensemble (160 W). C'est elle qui compte dans le total, la barre de répartition et les plus gros consommateurs. |
| **Lignes en retrait, reliées par un trait ↳** | Les sous-appareils (40 W, 15 W) : leur puissance, leur mini-courbe, leurs kWh du jour et leur graphique au toucher, comme les autres, mais ils ne sont **pas ajoutés une seconde fois** au total. |
| **Ligne « Reste non détaillé »** (en italique) | Ce que le parent consomme en plus de ses sous-appareils : 160 − 40 − 15 = 105 W (réseau, routeur, onduleur…). Elle se masque avec l'option `show_rest: false`. Elle n'ouvre pas de graphique. |

- Le tri en direct range les appareils principaux ; chacun garde ses sous-appareils (triés eux aussi) et sa ligne « Reste » juste en dessous.
- Un sous-appareil s'affiche toujours sous son parent, même s'il a été ajouté dans un autre groupe.
- Un seul niveau : un sous-appareil ne peut pas avoir lui-même de sous-appareils.

## Bouton marche / arrêt

Activez **Bouton marche / arrêt** dans les réglages d'un appareil (option `show_switch`) pour pouvoir l'allumer ou l'éteindre depuis la carte.

| Élément | À quoi il sert |
|---|---|
| **Bouton ⏻ à droite de la ligne** | Allume ou éteint l'interrupteur de l'appareil. **Coloré** (couleur de l'appareil) quand il est allumé, **gris** quand il est éteint, **pâle** et inactif quand l'interrupteur est indisponible. |
| **« Éteindre ? » en rouge** | Pour éteindre, un premier toucher demande confirmation : touchez de nouveau dans les 4 secondes. Sans second toucher, rien ne se passe. Pour éteindre d'un seul toucher, décochez **Confirmer avant d'éteindre** (`switch_confirm: false`). Allumer se fait toujours d'un seul toucher. |

- **Interrupteur** (`switch`) : laissé vide, la carte prend l'interrupteur rattaché au même appareil que le capteur de puissance (le cas de la plupart des prises connectées). Vous pouvez aussi choisir n'importe quel `switch`, `light`, `fan` ou `input_boolean`.
- Indiquer un `switch` en YAML suffit à afficher le bouton.
- Le bouton est désactivé par défaut : pensez à ne pas l'activer sur un congélateur ou un serveur qui ne doit jamais être coupé.

## Comment ça marche

- **Le direct** suit l'état des capteurs de puissance : les lignes, le total et le tri bougent dès qu'une valeur change.
- **Les mini-courbes** et le **maximum automatique** viennent des statistiques de Home Assistant (moyennes sur 5 minutes et pics horaires), les **kWh du jour** des statistiques du compteur d'énergie. Tout est relu toutes les 5 minutes, sans créer d'entité.
- **Le graphique d'un appareil** lit les statistiques de son capteur (moyennes, minimums et maximums sur 5 minutes, ou par heure sur 7 jours) ; pour un capteur sans statistiques, il recalcule la courbe depuis l'historique. Un capteur exclu de l'enregistreur (`recorder`) de Home Assistant n'a pas d'historique : la carte le signale.
- **L'import du tableau Énergie** ajoute dans un nouveau groupe les appareils du tableau Énergie qui ont un capteur de puissance et ne sont pas déjà dans la carte.

---

Fait partie de **HOLM — Home Orchestration & Living Management** : la gestion et l'orchestration intelligente de la maison.

Les autres projets : [Volets HOLM](https://github.com/kaaribou/volets-holm) · [Climat HOLM](https://github.com/kaaribou/climat-holm) · [Carburant HOLM](https://github.com/kaaribou/carburant-holm) · [Commandes à la maison HOLM](https://github.com/kaaribou/commandes-holm) · [HOLM LaMetric](https://github.com/kaaribou/lametric-holm) · [HOLM My Menu](https://github.com/kaaribou/holm-mymenu) · [HOLM Lektrico](https://github.com/kaaribou/lektrico-holm) · [HOLM GitHub](https://github.com/kaaribou/github-holm) · [HOLM Cars](https://github.com/kaaribou/holm-cars) · [HOLM HP/HC](https://github.com/kaaribou/holm-tarif) · [HOLM Navbar Card](https://github.com/kaaribou/holm-navbar-card) · [HOLM Climate Card](https://github.com/kaaribou/climate-card-holm) · [HOLM Music Card](https://github.com/kaaribou/holm-music-card) · [HOLM Sentinel Card](https://github.com/kaaribou/holm-sentinel-card) · [HOLM Security Card](https://github.com/kaaribou/holm-security-card) · [HOLM Recordings Card](https://github.com/kaaribou/holm-recordings-card) · [HOLM Covers Card](https://github.com/kaaribou/holm-covers-card) · [HOLM Runtime Card](https://github.com/kaaribou/holm-runtime-card) · [HOLM Power Flow Card](https://github.com/kaaribou/holm-power-flow-card) · [HOLM Energy Cards](https://github.com/kaaribou/holm-energy-cards) · [HOLM Radiator Card](https://github.com/kaaribou/holm-radiator-card) · [HOLM Floor Card](https://github.com/kaaribou/holm-floor-card) · [HOLM Ecojoko Card](https://github.com/kaaribou/holm-ecojoko-card) · [HOLM Smoke Card](https://github.com/kaaribou/holm-smoke-card) · [HOLM Family Card](https://github.com/kaaribou/holm-family-card) · [HOLM Solar Optimizer Card](https://github.com/kaaribou/holm-solar-optimizer-card) · [HOLM Govee Light Card](https://github.com/kaaribou/holm-govee-light-card) · [HOLM Leapmotor Card](https://github.com/kaaribou/holm-leapmotor-card). · [HOLM Poubelles](https://github.com/kaaribou/holm-bins) · [HOLM FX](https://github.com/kaaribou/holm-fx-card) · [HOLM Theme Editor](https://github.com/kaaribou/holm-theme)

Licence MIT · [☕ Offrir une bière](https://paypal.me/kaaribou)
