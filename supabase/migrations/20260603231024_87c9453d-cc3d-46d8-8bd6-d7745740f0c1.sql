
-- Lock down orders table
DROP POLICY IF EXISTS "Anyone can read orders by ref" ON public.orders;
DROP POLICY IF EXISTS "Service role can update orders" ON public.orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;

-- Only service_role (edge functions) can read/update orders
CREATE POLICY "Service role manages orders select"
  ON public.orders FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role manages orders update"
  ON public.orders FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon to create orders (needed if any client-side insert exists; otherwise edge function uses service role)
CREATE POLICY "Service role inserts orders"
  ON public.orders FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Revoke direct anon/authenticated access (service_role bypasses RLS anyway)
REVOKE ALL ON public.orders FROM anon, authenticated;
GRANT ALL ON public.orders TO service_role;

-- Lock down storage 'books' bucket: remove permissive public-read policy
DROP POLICY IF EXISTS "Allow public read of books" ON storage.objects;
-- No replacement policy needed: download-book edge function uses service_role to mint signed URLs.
