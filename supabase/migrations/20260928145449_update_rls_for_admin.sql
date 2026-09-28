/*
# Mise à jour des politiques RLS pour l'administration

## Description
Ajoute des politiques d'écriture (INSERT, UPDATE, DELETE) pour les tables categories, products et orders
afin qu'un administrateur authentifié puisse gérer la boutique depuis l'espace d'administration.

## Changements de sécurité
- Categories: ajout de politiques INSERT, UPDATE, DELETE pour authenticated
- Products: ajout de politiques INSERT, UPDATE, DELETE pour authenticated
- Orders: ajout de politiques UPDATE, DELETE pour authenticated (les commandes sont déjà insérées par les clients)
- Order_items: ajout de politiques UPDATE, DELETE pour authenticated

## Notes importantes
1. Les clients (anon) conservent leur accès en lecture seule sur categories et products.
2. Les clients peuvent créer des commandes (INSERT sur orders et order_items).
3. Seul un utilisateur authentifié (admin) peut modifier/supprimer des produits, catégories et gérer les commandes.
*/

-- ==================== CATEGORIES: write policies ====================
DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- ==================== PRODUCTS: write policies ====================
DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- ==================== ORDERS: write policies ====================
DROP POLICY IF EXISTS "auth_update_orders" ON orders;
CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_orders" ON orders;
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- ==================== ORDER_ITEMS: write policies ====================
DROP POLICY IF EXISTS "auth_update_order_items" ON order_items;
CREATE POLICY "auth_update_order_items" ON order_items FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_order_items" ON order_items;
CREATE POLICY "auth_delete_order_items" ON order_items FOR DELETE
  TO authenticated USING (true);