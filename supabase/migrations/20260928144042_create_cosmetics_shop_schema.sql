/*
# Falaye Boutique - Schéma de la boutique de cosmétiques

## Description
Crée le schéma de base de données pour la boutique Falaye Boutique, située au marché de Mamaribougou.
Cette boutique vend des produits cosmétiques. L'application est une boutique en ligne sans authentification
(pas de connexion requise). Les visiteurs peuvent parcourir les produits, les ajouter au panier,
et passer commande.

## Nouvelles tables

1. `categories`
   - `id` (uuid, clé primaire)
   - `name` (text, nom de la catégorie, non nul)
   - `slug` (text, identifiant URL unique, non nul)
   - `description` (text, description de la catégorie)
   - `image_url` (text, image illustrant la catégorie)
   - `created_at` (timestamp, date de création)

2. `products`
   - `id` (uuid, clé primaire)
   - `name` (text, nom du produit, non nul)
   - `slug` (text, identifiant URL unique, non nul)
   - `description` (text, description détaillée)
   - `price` (numeric, prix en FCFA, non nul)
   - `image_url` (text, image du produit)
   - `category_id` (uuid, clé étrangère vers categories)
   - `stock` (integer, quantité en stock, défaut 0)
   - `featured` (boolean, produit en vedette, défaut false)
   - `created_at` (timestamp, date de création)

3. `orders`
   - `id` (uuid, clé primaire)
   - `customer_name` (text, nom du client, non nul)
   - `customer_phone` (text, téléphone du client, non nul)
   - `customer_address` (text, adresse de livraison)
   - `total_amount` (numeric, montant total, non nul)
   - `status` (text, statut de la commande: 'pending', 'confirmed', 'delivered', 'cancelled')
   - `created_at` (timestamp, date de commande)

4. `order_items`
   - `id` (uuid, clé primaire)
   - `order_id` (uuid, clé étrangère vers orders)
   - `product_id` (uuid, clé étrangère vers products)
   - `product_name` (text, nom du produit au moment de la commande)
   - `quantity` (integer, quantité commandée, non nul)
   - `unit_price` (numeric, prix unitaire au moment de la commande)

## Sécurité
- RLS activée sur toutes les tables.
- Politiques d'accès public (anon + authenticated) pour SELECT sur categories et products.
- Politiques d'accès public pour INSERT sur orders et order_items.
- Pas de mise à jour ni suppression depuis le frontend.

## Notes importantes
1. Application sans authentification: les politiques utilisent `TO anon, authenticated`.
2. Les prix sont en FCFA (Franc CFA), monnaie utilisée au Mali.
3. Les commandes sont en lecture seule depuis le frontend (le marchand gère les statuts).
*/

-- ==================== CATEGORIES ====================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- ==================== PRODUCTS ====================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  image_url text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  stock integer NOT NULL DEFAULT 0,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- ==================== ORDERS ====================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_address text,
  total_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

-- ==================== ORDER_ITEMS ====================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_order_items" ON order_items;
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_order_items" ON order_items;
CREATE POLICY "anon_select_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);