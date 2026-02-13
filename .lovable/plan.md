

# Stock Quantity + Categorie CRUD - Plan

## Wat wordt er gebouwd

1. **Stock quantity (voorraad)** kolom toevoegen aan products
2. **Categorie CRUD** -- een aparte `categories` tabel zodat je categorieën kunt toevoegen, bewerken en verwijderen vanuit het admin dashboard (in plaats van de huidige vaste enum)

---

## Stap 1: Database migraties

### 1a. `stock_qty` kolom toevoegen
- Voeg een `stock_qty integer NOT NULL DEFAULT 0` kolom toe aan `products`

### 1b. Categories tabel aanmaken
- Maak een nieuwe `categories` tabel met:
  - `id uuid PRIMARY KEY`
  - `name_nl text NOT NULL`
  - `name_fr text NOT NULL`
  - `name_ar text NOT NULL`
  - `slug text UNIQUE NOT NULL` (bijv. "robes", "jelbabs")
  - `created_at timestamptz DEFAULT now()`
- RLS: iedereen kan lezen, alleen admins kunnen insert/update/delete
- Seed de bestaande 3 categorieën (robes, jelbabs, complets)

### 1c. Products category kolom migreren
- Voeg een `category_id uuid REFERENCES categories(id)` kolom toe aan products
- Vul category_id in op basis van de huidige enum waarden
- Verwijder de oude `category` enum kolom
- Hernoem `category_id` naar `category_id` (blijft zo)

**Opmerking:** Omdat de huidige `category` kolom een enum is die overal in de code wordt gebruikt, is het veiliger om category_id toe te voegen als extra kolom en de frontend geleidelijk te migreren. Als alternatief kunnen we de enum kolom behouden en een aparte categories tabel als referentie gebruiken -- dit is eenvoudiger en minder breaking.

**Gekozen aanpak (minimaal breaking):** We behouden de bestaande `category` enum kolom op products, maar voegen een `categories` tabel toe voor CRUD-beheer. De enum wordt uitgebreid wanneer een admin een nieuwe categorie aanmaakt (via een database functie). Dit voorkomt dat bestaande code breekt.

---

## Stap 2: Supabase types updaten

Na de migratie worden de types automatisch bijgewerkt. De `categories` tabel en `stock_qty` kolom verschijnen in de gegenereerde types.

---

## Stap 3: Admin Dashboard aanpassen

### 3a. Stock quantity in product formulier
- Voeg een `stock_qty` number input toe aan het product formulier (naast prijs en maten)
- Toon stock in de productlijst/kaarten met kleurcodering:
  - Groen: >10 op voorraad
  - Oranje: 1-10 op voorraad  
  - Rood: 0 (uitverkocht)
- Voeg een "Voorraad" StatCard toe aan het overzicht

### 3b. Categorieën tab toevoegen
- Nieuwe tab "Categorieën" in het admin dashboard
- Tabel/lijst met alle categorieën (naam NL/FR/AR, slug, aantal producten)
- Toevoegen/bewerken/verwijderen van categorieën
- Bij verwijderen: check of er producten aan gekoppeld zijn, zo ja: blokkeer of waarschuw
- Categorie-selectie in het product formulier haalt data op uit de `categories` tabel

### 3c. Hooks bijwerken
- `useProducts` hook: map `stock_qty` mee in het Product type
- Nieuwe `useCategories` hook voor het ophalen van categorieën

---

## Stap 4: Frontend aanpassingen

- Product type in `src/lib/products.ts`: voeg `stockQty: number` toe
- Catalogus pagina: toon "Uitverkocht" badge wanneer stock_qty === 0
- Product detail: disable bestellen wanneer uitverkocht

---

## Technische details

```text
products tabel (nieuw):
+------------+------+----------+---------+
| kolom      | type | nullable | default |
+------------+------+----------+---------+
| stock_qty  | int  | NO       | 0       |
+------------+------+----------+---------+

categories tabel (nieuw):
+------------+------+----------+---------+
| kolom      | type | nullable | default |
+------------+------+----------+---------+
| id         | uuid | NO       | random  |
| name_nl    | text | NO       | --      |
| name_fr    | text | NO       | --      |
| name_ar    | text | NO       | --      |
| slug       | text | NO       | --      |
| created_at | tstz | NO       | now()   |
+------------+------+----------+---------+
```

**Bestanden die worden aangepast:**
- `src/pages/AdminDashboard.tsx` -- stock veld + categorieën tab
- `src/lib/products.ts` -- Product type uitbreiden
- `src/hooks/useProducts.ts` -- stock_qty mappen
- `src/pages/Catalog.tsx` -- uitverkocht badge
- `src/pages/ProductDetail.tsx` -- uitverkocht status
- Nieuwe file: `src/hooks/useCategories.ts`

**Database migraties:**
- Migratie 1: `stock_qty` kolom + `categories` tabel + seed data + RLS policies

